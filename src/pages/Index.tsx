import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, MessageCircle, Users, Shield, Monitor, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Auth from './Auth';
import Onboarding from '@/components/Onboarding';
import HomeView from '@/components/views/HomeView';
import ChatView from '@/components/views/ChatView';
import GroupsView from '@/components/views/GroupsView';
import MonitoringView from '@/components/views/MonitoringView';
import SettingsView from '@/components/views/SettingsView';
import EnhancedMonitoringView from '@/components/views/EnhancedMonitoringView';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import { useFamilyGroups } from '@/hooks/useFamilyGroups';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useProfile } from '@/hooks/useProfile';
import { useEnhancedDeviceMonitoring } from '@/hooks/useEnhancedDeviceMonitoring';
import { useToast } from '@/hooks/use-toast';

export type ViewType = 'home' | 'chat' | 'groups' | 'monitoring' | 'enhanced-monitoring' | 'settings';

const Index = () => {
  const { user, loading } = useAuth();
  const { groups, createGroup, joinGroup, deleteGroup, leaveGroup } = useFamilyGroups();
  const [activeView, setActiveView] = useState<ViewType>('home');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { isDarkMode } = useDarkMode();
  const { profile } = useProfile();
  const { devices, sendNotification } = useEnhancedDeviceMonitoring();
  const { toast } = useToast();

  // Group creation/management state
  const [newGroupName, setNewGroupName] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  // Check if user has seen onboarding
  useEffect(() => {
    if (!loading && !user) {
      const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
      if (!hasSeenOnboarding) {
        setShowOnboarding(true);
      } else {
        setShowAuth(true);
      }
    }
  }, [user, loading]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
    setShowAuth(true);
  };

  const isHeadOfFamily = groups.some(group => group.head_of_family_id === user?.id);

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

  const handleSendNotification = async (message: string) => {
    try {
      await sendNotification(message);
      toast({
        title: "Sukses",
        description: "Notifikasi berhasil dikirim",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengirim notifikasi",
        variant: "destructive",
      });
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveView(tab as ViewType);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg animate-pulse">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-300">Memuat Family...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (showOnboarding) {
      return <Onboarding onComplete={handleOnboardingComplete} />;
    }
    if (showAuth) {
      return <Auth />;
    }
    
    // Landing page for non-authenticated users
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-pink-400/20 to-orange-600/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative container mx-auto px-4 py-16">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-xl mb-6 animate-bounce">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Family
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Terhubung dengan keluarga tercinta melalui aplikasi yang aman, modern, dan mudah digunakan
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => setShowOnboarding(true)}
                  className="h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-base"
                >
                  Mulai Sekarang
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowAuth(true)}
                  className="h-14 px-8 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all duration-200 text-base"
                >
                  Sudah Punya Akun?
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Chat Keluarga</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Kirim pesan, foto, dan file dengan aman</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Monitor className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Monitoring</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Pantau aktivitas digital keluarga</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Keamanan</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Enkripsi end-to-end dan privasi terjamin</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Grup Keluarga</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Kelola anggota dan aktivitas keluarga</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return (
          <HomeView 
            profile={profile}
            user={user}
            isHeadOfFamily={isHeadOfFamily}
            groups={groups}
          />
        );
      case 'chat':
        return (
          <ChatView
            groups={groups}
            selectedGroupId={selectedGroupId}
            onSelectGroup={setSelectedGroupId}
          />
        );
      case 'groups':
        return (
          <GroupsView 
            groups={groups}
            user={user}
            groupMembers={[]}
            newGroupName={newGroupName}
            setNewGroupName={setNewGroupName}
            inviteCode={inviteCode}
            setInviteCode={setInviteCode}
            onCreateGroup={handleCreateGroup}
            onJoinGroup={handleJoinGroup}
            onDeleteGroup={handleDeleteGroup}
            onSelectGroup={setSelectedGroupId}
            onLeaveGroup={handleLeaveGroup}
          />
        );
      case 'monitoring':
        return (
          <MonitoringView 
            devices={devices}
            isHeadOfFamily={isHeadOfFamily}
            onSendNotification={handleSendNotification}
            groups={groups}
            selectedGroupId={selectedGroupId}
          />
        );
      case 'enhanced-monitoring':
        return <EnhancedMonitoringView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <HomeView 
            profile={profile}
            user={user}
            isHeadOfFamily={isHeadOfFamily}
            groups={groups}
          />
        );
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-200">
        <div className="flex flex-col h-screen max-w-md mx-auto bg-white dark:bg-gray-900 shadow-xl">
          <Header />
          <main className="flex-1 overflow-y-auto">
            {renderActiveView()}
          </main>
          <Navigation 
            activeTab={activeView} 
            onTabChange={handleTabChange} 
            isHeadOfFamily={isHeadOfFamily} 
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
