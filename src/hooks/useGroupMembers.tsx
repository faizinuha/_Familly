
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
    fetchMembers();
    
    // Set up real-time subscription for member changes
    const channel = supabase
      .channel(`group_members_${groupId}`)
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'group_members',
          filter: `group_id=eq.${groupId}`
        },
        () => {
          console.log('Group members changed, refetching...');
          fetchMembers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId]);

  const fetchMembers = async () => {
    if (!groupId) return;
    
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
      
      console.log('Raw members data:', data);
      
      // Transform the data to match our expected type
      const transformedMembers = (data || []).map((member: any) => ({
        ...member,
        profiles: member.profiles || null
      })) as GroupMemberWithProfile[];
      
      console.log('Transformed members:', transformedMembers);
      setMembers(transformedMembers);
    } catch (error) {
      console.error('Error fetching group members:', error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  return { members, loading, refreshMembers: fetchMembers };
}
