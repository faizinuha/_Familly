
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type GroupMemberWithProfile = Tables<'group_members'> & {
  profiles: {
    id: string;
    full_name: string;
  } | null;
};

export function useGroupMembers(groupId: string | null) {
  const [members, setMembers] = useState<GroupMemberWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!groupId) {
      setMembers([]);
      setLoading(false);
      return;
    }
    
    console.log('useGroupMembers - groupId changed:', groupId);
    fetchMembers();
    
    // Set up real-time subscription for member changes
    const channel = supabase
      .channel(`group_members_${groupId}_${Date.now()}`)
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'group_members',
          filter: `group_id=eq.${groupId}`
        },
        (payload) => {
          console.log('Group members real-time update:', payload);
          fetchMembers();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up group members subscription');
      supabase.removeChannel(channel);
    };
  }, [groupId]);

  const fetchMembers = async () => {
    if (!groupId) {
      console.log('No groupId provided, skipping fetch');
      return;
    }
    
    console.log('Fetching members for group:', groupId);
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          *,
          profiles!inner(id, full_name)
        `)
        .eq('group_id', groupId);
      
      if (error) {
        console.error('Error fetching group members:', error);
        throw error;
      }
      
      console.log('Raw members data from DB:', data);
      
      // Transform the data to match our expected type
      const transformedMembers = (data || []).map((member: any) => ({
        ...member,
        profiles: member.profiles || { id: member.user_id, full_name: 'Unknown' }
      })) as GroupMemberWithProfile[];
      
      console.log('Transformed members:', transformedMembers);
      console.log('Member count:', transformedMembers.length);
      setMembers(transformedMembers);
    } catch (error) {
      console.error('Error in fetchMembers:', error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // Add debugging for member count
  useEffect(() => {
    console.log('useGroupMembers - members updated:', {
      groupId,
      memberCount: members.length,
      members: members.map(m => ({ id: m.id, user_id: m.user_id, full_name: m.profiles?.full_name }))
    });
  }, [members, groupId]);

  return { members, loading, refreshMembers: fetchMembers };
}
