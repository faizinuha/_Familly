
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type FamilyGroup = Tables<'family_groups'>;
type GroupMember = Tables<'group_members'>;

export function useFamilyGroups() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<FamilyGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setGroups([]);
      setLoading(false);
      return;
    }

    fetchGroups();
  }, [user]);

  const fetchGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('family_groups')
        .select('*');

      if (error) throw error;
      setGroups(data || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (name: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('family_groups')
        .insert({
          name,
          head_of_family_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Update profile role to head_of_family
      await supabase
        .from('profiles')
        .update({ role: 'head_of_family' })
        .eq('id', user.id);

      setGroups(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  };

  const joinGroup = async (inviteCode: string) => {
    if (!user) return null;

    try {
      // First, find the group by invite code
      const { data: group, error: groupError } = await supabase
        .from('family_groups')
        .select('*')
        .eq('invite_code', inviteCode.toUpperCase())
        .single();

      if (groupError) throw new Error('Kode undangan tidak valid');

      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', group.id)
        .eq('user_id', user.id)
        .single();

      if (existingMember) {
        throw new Error('Anda sudah menjadi anggota grup ini');
      }

      // Add user to group
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: group.id,
          user_id: user.id
        });

      if (memberError) throw memberError;

      setGroups(prev => [...prev, group]);
      return group;
    } catch (error) {
      console.error('Error joining group:', error);
      throw error;
    }
  };

  return {
    groups,
    loading,
    createGroup,
    joinGroup,
    refreshGroups: fetchGroups
  };
}
