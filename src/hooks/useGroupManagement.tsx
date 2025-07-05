
import { useState } from 'react';
import { useFamilyGroups } from '@/hooks/useFamilyGroups';
import { useToast } from '@/hooks/use-toast';

export function useGroupManagement() {
  const { groups, createGroup, joinGroup, deleteGroup, leaveGroup } = useFamilyGroups();
  const { toast } = useToast();
  const [newGroupName, setNewGroupName] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    
    try {
      await createGroup(newGroupName);
      setNewGroupName('');
      toast({
        title: "Sukses",
        description: "Grup berhasil dibuat",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal membuat grup",
        variant: "destructive",
      });
    }
  };

  const handleJoinGroup = async () => {
    if (!inviteCode.trim()) return;
    
    try {
      await joinGroup(inviteCode);
      setInviteCode('');
      toast({
        title: "Sukses",
        description: "Berhasil bergabung dengan grup",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal bergabung dengan grup",
        variant: "destructive",
      });
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      await deleteGroup(groupId);
      toast({
        title: "Sukses",
        description: "Grup berhasil dihapus",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus grup",
        variant: "destructive",
      });
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    try {
      await leaveGroup(groupId);
      toast({
        title: "Sukses",
        description: "Berhasil keluar dari grup",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal keluar dari grup",
        variant: "destructive",
      });
    }
  };

  return {
    groups,
    newGroupName,
    setNewGroupName,
    inviteCode,
    setInviteCode,
    handleCreateGroup,
    handleJoinGroup,
    handleDeleteGroup,
    handleLeaveGroup,
  };
}
