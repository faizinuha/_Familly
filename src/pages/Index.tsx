import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useFamilyGroups } from "@/hooks/useFamilyGroups";
import { useGroupMessages } from "@/hooks/useGroupMessages";
import { useDeviceMonitoring } from "@/hooks/useDeviceMonitoring";
import { useUserStatus } from "@/hooks/useUserStatus";
import { useToast } from "@/hooks/use-toast";
import { useGroupMembers } from "@/hooks/useGroupMembers";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import HomeView from "@/components/views/HomeView";
import GroupsView from "@/components/views/GroupsView";
import MonitoringView from "@/components/views/MonitoringView";
import ChatView from "@/components/views/ChatView";
import SettingsView from "@/components/views/SettingsView";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  
  const { user, signOut } = useAuth();
  const { profile, isHeadOfFamily } = useProfile();
  const { groups, createGroup, joinGroup, refreshGroups } = useFamilyGroups();
  const { messages, sendMessage, sendSystemNotification, uploadFile } = useGroupMessages(selectedGroupId);
  const { devices, activities } = useDeviceMonitoring();
  const { getOnlineUsers, updateMyStatus } = useUserStatus();
  const { members: groupMembers } = useGroupMembers(selectedGroupId);
  const { toast } = useToast();

  // Auto-select first group
  useEffect(() => {
    if (groups.length > 0 && !selectedGroupId) {
      setSelectedGroupId(groups[0].id);
    }
  }, [groups, selectedGroupId]);

  // Update user activity
  useEffect(() => {
    updateMyStatus(true, `Menggunakan Good Family - Tab: ${activeTab}`);
  }, [activeTab, updateMyStatus]);

  const onlineUsers = getOnlineUsers();

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    
    try {
      const group = await createGroup(newGroupName);
      if (group) {
        toast({
          title: "Berhasil!",
          description: `Grup "${newGroupName}" berhasil dibuat`,
        });
        setNewGroupName("");
        setSelectedGroupId(group.id);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal membuat grup",
        variant: "destructive"
      });
    }
  };

  const handleJoinGroup = async () => {
    if (!inviteCode.trim()) return;
    
    try {
      const group = await joinGroup(inviteCode);
      if (group) {
        toast({
          title: "Berhasil!",
          description: `Berhasil bergabung dengan grup "${group.name}"`,
        });
        setInviteCode("");
        setSelectedGroupId(group.id);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Gagal bergabung ke grup",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = async (message: string, fileUrl?: string, fileType?: string, fileName?: string) => {
    try {
      await sendMessage(message, [], fileUrl, fileType, fileName);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengirim pesan",
        variant: "destructive"
      });
      throw error;
    }
  };

  const handleSendNotification = async (message: string) => {
    try {
      await sendSystemNotification(message);
      toast({
        title: "Notifikasi terkirim",
        description: message,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengirim notifikasi",
        variant: "destructive"
      });
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!window.confirm("Yakin ingin menghapus grup ini?")) return;
    try {
      const { error } = await import("@/integrations/supabase/client").then(({ supabase }) =>
        supabase.from("family_groups").delete().eq("id", groupId)
      );
      if (error) throw error;
      toast({ title: "Grup dihapus", description: "Grup berhasil dihapus" });
      refreshGroups();
      setSelectedGroupId(null);
    } catch (error) {
      toast({ title: "Error", description: "Gagal menghapus grup", variant: "destructive" });
    }
  };

  const selectedGroup = groups.find(g => g.id === selectedGroupId);

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <HomeView
            profile={profile}
            user={user}
            isHeadOfFamily={isHeadOfFamily}
            groups={groups}
            devices={devices}
            activities={activities}
            onlineUsers={onlineUsers}
          />
        );
      case "groups":
        return (
          <GroupsView
            groups={groups}
            user={user}
            groupMembers={groupMembers || []}
            newGroupName={newGroupName}
            setNewGroupName={setNewGroupName}
            inviteCode={inviteCode}
            setInviteCode={setInviteCode}
            onCreateGroup={handleCreateGroup}
            onJoinGroup={handleJoinGroup}
            onDeleteGroup={handleDeleteGroup}
            onSelectGroup={setSelectedGroupId}
          />
        );
      case "monitoring":
        return (
          <MonitoringView
            devices={devices}
            isHeadOfFamily={isHeadOfFamily}
            onSendNotification={handleSendNotification}
          />
        );
      case "chat":
        return (
          <ChatView
            selectedGroup={selectedGroup}
            messages={messages}
            user={user}
            onSendMessage={handleSendMessage}
            onUploadFile={uploadFile}
          />
        );
      case "settings":
        return <SettingsView />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <Header />
      
      <div className="flex-1 overflow-hidden">
        <div className={`h-full ${activeTab === 'chat' ? 'flex flex-col' : ''}`}>
          <div className={`max-w-md mx-auto h-full ${activeTab === 'chat' ? 'flex flex-col' : 'overflow-y-auto px-4 py-6'}`}>
            {renderContent()}
          </div>
        </div>
      </div>

      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isHeadOfFamily={isHeadOfFamily}
      />
    </div>
  );
};

export default Index;
