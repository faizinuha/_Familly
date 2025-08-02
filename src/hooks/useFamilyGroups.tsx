
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

type FamilyGroup = Tables<'family_groups'>;

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
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          family_groups (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Extract family_groups from group_members
      const groupsData = (data || [])
        .map((gm: any) => gm.family_groups)
        .filter(Boolean);
      setGroups(groupsData);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (name: string, isPrivate: boolean = false) => {
    if (!user) return null;

    try {
      // Create the group first
      const { data: groupData, error: groupError } = await supabase
        .from('family_groups')
        .insert({
          name,
          head_of_family_id: user.id,
          is_private: isPrivate,
          invite_code: '', // Will be replaced by trigger
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Update profile role to head_of_family
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'head_of_family' })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Insert user as member of the group
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: groupData.id,
          user_id: user.id,
        });

      if (memberError) throw memberError;

      await fetchGroups(); // Refresh to get updated data
      return groupData;
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
        .eq('invite_code', inviteCode.trim())
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
          user_id: user.id,
        });

      if (memberError) throw memberError;

      await fetchGroups(); // Refresh to get updated data
      return group;
    } catch (error) {
      console.error('Error joining group:', error);
      throw error;
    }
  };

  const leaveGroup = async (groupId: string) => {
    if (!user) return;

    try {
      // Remove user from group
      const { error: memberError } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id);

      if (memberError) throw memberError;

      // Check if user is still head of family of any other groups
      const { data: remainingGroups, error: checkError } = await supabase
        .from('family_groups')
        .select('id')
        .eq('head_of_family_id', user.id);

      if (checkError) throw checkError;

      // If user is not head of family of any groups, reset role to member
      if (!remainingGroups || remainingGroups.length === 0) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: 'member' })
          .eq('id', user.id);

        if (profileError) throw profileError;
      }

      await fetchGroups(); // Refresh to get updated data
    } catch (error) {
      console.error('Error leaving group:', error);
      throw error;
    }
  };

  const deleteGroup = async (groupId: string) => {
    if (!user) return;

    try {
      // Only head of family can delete the group
      const { error: deleteError } = await supabase
        .from('family_groups')
        .delete()
        .eq('id', groupId)
        .eq('head_of_family_id', user.id);

      if (deleteError) throw deleteError;

      // Check if user is still head of family of any other groups
      const { data: remainingGroups, error: checkError } = await supabase
        .from('family_groups')
        .select('id')
        .eq('head_of_family_id', user.id);

      if (checkError) throw checkError;

      // If user is not head of family of any groups, reset role to member
      if (!remainingGroups || remainingGroups.length === 0) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: 'member' })
          .eq('id', user.id);

        if (profileError) throw profileError;
      }

      await fetchGroups(); // Refresh to get updated data
    } catch (error) {
      console.error('Error deleting group:', error);
      throw error;
    }
  };

  return {
    groups,
    loading,
    createGroup,
    joinGroup,
    leaveGroup,
    deleteGroup,
    refreshGroups: fetchGroups,
  };
}
