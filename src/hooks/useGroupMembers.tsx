import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type GroupMemberWithProfile = Tables<'group_members'> & {
  profile: {
    id: string;
    full_name: string;
  };
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
  }, [groupId]);

  const fetchMembers = async () => {
    if (!groupId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('group_members')
        .select(`*, profiles!group_members_user_id_fkey(id, full_name)`) // join profiles using the correct foreign key
        .eq('group_id', groupId);
      if (error) throw error;
      setMembers(
        (data || []).map((m: any) => ({
          ...m,
          profile: m.profiles && !('error' in m.profiles) ? m.profiles : { id: '', full_name: '' },
        }))
      );
    } catch (error) {
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  return { members, loading, refreshMembers: fetchMembers };
}
