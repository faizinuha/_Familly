import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import PinAuthScreen from '@/components/PinAuthScreen';
import ChatView from '@/components/views/ChatView';
import GroupsView from '@/components/views/GroupsView';
import HomeView from '@/components/views/HomeView';
import MonitoringView from '@/components/views/MonitoringView';
import SettingsView from '@/components/views/SettingsView';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useDeviceMonitoring } from '@/hooks/useDeviceMonitoring';
import { useFamilyGroups } from '@/hooks/useFamilyGroups';
import { useGroupMembers } from '@/hooks/useGroupMembers';
import { useGroupMessages } from '@/hooks/useGroupMessages';
import { usePinAuth } from '@/hooks/usePinAuth';
import { useProfile } from '@/hooks/useProfile';
import { useUserStatus } from '@/hooks/useUserStatus';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isPrivateGroup, setIsPrivateGroup] = useState(false);
  const [joinedGroupIds, setJoinedGroupIds] = useState<string[]>([]);
  const {
    user,
    signOut
  } = useAuth();
  const {
    profile,
    isHeadOfFamily
  } = useProfile();
  const {
    groups,
    createGroup,
    joinGroup,
    leaveGroup,
    refreshGroups
  } = useFamilyGroups();
  const {
    messages,
    sendMessage,
    sendSystemNotification,
    uploadFile
  } = useGroupMessages(selectedGroupId);
  const {
    devices,
    activities
  } = useDeviceMonitoring();
  const {
    updateMyStatus
  } = useUserStatus();
  const {
    members: groupMembers
  } = useGroupMembers(selectedGroupId);
  const {
    toast
  } = useToast();
  const {
    isAuthenticated,
    pinEnabled,
    authenticate,
    requireAuth
  } = usePinAuth();

  // Ambil daftar group_id yang sudah di-join user
  useEffect(() => {
    const fetchJoinedGroups = async () => {
      if (!user?.id) return;
      const {
        data,
        error
      } = await supabase.from('group_members').select('group_id').eq('user_id', user.id);
      if (!error && data) {
        setJoinedGroupIds(data.map((row: any) => row.group_id));
      }
    };
    fetchJoinedGroups();
  }, [user?.id]);

  // PERBAIKAN: Hapus auto-select grup yang menyebabkan masalah navigasi
  // Biarkan user memilih grup secara manual

  // Update user activity
  useEffect(() => {
    updateMyStatus(true, `Menggunakan Family - Tab: ${activeTab}`);
  }, [activeTab, updateMyStatus]);

  // Handle app blur/focus for PIN auth
  useEffect(() => {
    const handleBlur = () => {
      if (pinEnabled) {
        setTimeout(() => requireAuth(), 100);
      }
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [pinEnabled, requireAuth]);
  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    try {
      const group = await createGroup(newGroupName, isPrivateGroup);
      if (group) {
        toast({
          title: 'Berhasil!',
          description: `Grup "${newGroupName}" ${isPrivateGroup ? 'private' : 'public'} berhasil dibuat`
        });
        setNewGroupName('');
        setIsPrivateGroup(false);
        refreshGroups();
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Gagal membuat grup',
        variant: 'destructive'
      });
    }
  };
  const handleJoinGroup = async () => {
    if (!inviteCode.trim()) return;
    try {
      const group = await joinGroup(inviteCode);
      if (group) {
        toast({
          title: 'Berhasil!',
          description: `Berhasil bergabung dengan grup "${group.name}"`
        });
        setInviteCode('');
        // Perbaikan: Hanya set selected group jika user memang ingin langsung masuk
        // setSelectedGroupId(group.id);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Gagal bergabung ke grup',
        variant: 'destructive'
      });
    }
  };
  const handleLeaveGroup = async (groupId: string) => {
    if (!window.confirm('Yakin ingin keluar dari grup ini?')) return;
    try {
      await leaveGroup(groupId);
      toast({
        title: 'Berhasil!',
        description: 'Berhasil keluar dari grup'
      });

      // If this was the selected group, clear the selection
      if (selectedGroupId === groupId) {
        setSelectedGroupId(null);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal keluar dari grup',
        variant: 'destructive'
      });
    }
  };
  const handleSendMessage = async (message: string, fileUrl?: string, fileType?: string, fileName?: string) => {
    try {
      await sendMessage(message, [], fileUrl, fileType, fileName);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal mengirim pesan',
        variant: 'destructive'
      });
      throw error;
    }
  };
  const handleSendNotification = async (message: string) => {
    try {
      await sendSystemNotification(message);
      toast({
        title: 'Notifikasi terkirim',
        description: message
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal mengirim notifikasi',
        variant: 'destructive'
      });
    }
  };
  const handleDeleteGroup = async (groupId: string) => {
    if (!window.confirm('Yakin ingin menghapus grup ini?')) return;
    try {
      const {
        error
      } = await import('@/integrations/supabase/client').then(({
        supabase
      }) => supabase.from('family_groups').delete().eq('id', groupId));
      if (error) throw error;
      toast({
        title: 'Grup dihapus',
        description: 'Grup berhasil dihapus'
      });
      refreshGroups();
      setSelectedGroupId(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal menghapus grup',
        variant: 'destructive'
      });
    }
  };
  const selectedGroup = groups.find(g => g.name === selectedGroupId);
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView profile={profile} user={user} isHeadOfFamily={isHeadOfFamily} groups={groups} />;
      case 'groups':
        return <GroupsView groups={groups} user={user} groupMembers={groupMembers || []} newGroupName={newGroupName} setNewGroupName={setNewGroupName} inviteCode={inviteCode} setInviteCode={setInviteCode} isPrivateGroup={isPrivateGroup} setIsPrivateGroup={setIsPrivateGroup} onCreateGroup={handleCreateGroup} onJoinGroup={handleJoinGroup} onDeleteGroup={handleDeleteGroup} onSelectGroup={setSelectedGroupId} onLeaveGroup={handleLeaveGroup} />;
      case 'monitoring':
        return <MonitoringView devices={devices} isHeadOfFamily={isHeadOfFamily} onSendNotification={handleSendNotification} groups={groups} selectedGroupId={selectedGroupId} />;
      case 'chat':
        {
          // Filter: hanya grup yang sudah di-join user atau dibuat user
          const filteredGroups = groups.filter(g => joinedGroupIds.includes(g.id) || g.head_of_family_id === user?.id);
          return <ChatView groups={filteredGroups} selectedGroupId={selectedGroupId} onSelectGroup={setSelectedGroupId} />;
        }
      case 'settings':
        return <SettingsView />;
      default:
        return null;
    }
  };

  // Show PIN authentication screen if not authenticated
  if (pinEnabled && !isAuthenticated) {
    return <PinAuthScreen onAuthenticated={authenticate} />;
  }
  return <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="flex-1 pb-20 sticky ">
        <div className={`h-full ${activeTab === 'chat' ? 'flex flex-col' : ''}`}>
          <div className={`max-w-md mx-auto h-full ${activeTab === 'chat' ? 'flex flex-col' : 'overflow-y-auto px-4 py-6'}`}>
            {renderContent()}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} isHeadOfFamily={isHeadOfFamily} />
      </div>
    </div>;
};
export default Index;