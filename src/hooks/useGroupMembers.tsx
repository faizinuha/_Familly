
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { useEffect, useRef, useState } from 'react';

// Extend the Window interface to include profilesCache
declare global {
  interface Window {
    profilesCache?: Record<string, { id: string; full_name: string }>;
  }
}

export type GroupMemberWithProfile = Tables<'group_members'> & {
  profiles: {
    id: string;
    full_name: string;
  };
};

export function useGroupMembers(groupId: string | null) {
  const [members, setMembers] = useState<GroupMemberWithProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const channelRef = useRef<any>(null);

  // Fetch members from DB
  const fetchMembers = async () => {
    if (!groupId) {
      setMembers([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      let { data, error } = await supabase
        .from('group_members')
        .select('*, profiles(id, full_name)')
        .eq('group_id', groupId);
      
      let transformed: GroupMemberWithProfile[] = [];
      
      if (error) {
        // fallback jika join gagal
        const fallbackResult = await supabase
          .from('group_members')
          .select('*')
          .eq('group_id', groupId);
        
        if (fallbackResult.data) {
          // Transform fallback data to include profiles
          transformed = fallbackResult.data.map((member: Tables<'group_members'>) => ({
            ...member,
            profiles: window?.profilesCache?.[member.user_id] || 
              { id: member.user_id, full_name: 'Unknown' }
          }));
        }
      } else if (data) {
        // Transform successful data
        transformed = data.map((member: any) => {
          const profileData = member.profiles || 
            (window?.profilesCache?.[member.user_id]) || 
            { id: member.user_id, full_name: 'Unknown' };
          
          return {
            ...member,
            profiles: profileData
          };
        });
      }
      
      // Deduplicate
      const seen = new Set();
      const deduplicated = transformed.filter((member: any) => {
        if (seen.has(member.user_id)) return false;
        seen.add(member.user_id);
        return true;
      });
      
      setMembers(deduplicated);
    } catch (e) {
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to realtime changes
  useEffect(() => {
    // Cleanup channel on groupId change or unmount
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    if (!groupId) {
      setMembers([]);
      setLoading(false);
      return;
    }
    fetchMembers();
    const channelName = `group_members_${groupId}`;
    // Always create a new channel instance for each groupId
    const channel = supabase
      .channel(channelName + '_' + Date.now())
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'group_members',
          filter: `group_id=eq.${groupId}`,
        },
        () => fetchMembers()
      )
      .subscribe();
    channelRef.current = channel;
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [groupId]);

  return { members, loading, refreshMembers: fetchMembers };
}
