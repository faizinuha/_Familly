
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useEnhancedDeviceMonitoring } from '@/hooks/useEnhancedDeviceMonitoring';
import { useGroupManagement } from '@/hooks/useGroupManagement';
import { useToast } from '@/hooks/use-toast';
import Auth from './Auth';
import Onboarding from '@/components/Onboarding';
import LandingPage from '@/components/LandingPage';
import AuthenticatedApp from '@/components/AuthenticatedApp';
import LoadingScreen from '@/components/LoadingScreen';

export type ViewType = 'home' | 'chat' | 'groups' | 'monitoring' | 'enhanced-monitoring' | 'settings';

const Index = () => {
  const { user, loading } = useAuth();
  const { profile } = useProfile();
  const { devices, sendNotification } = useEnhancedDeviceMonitoring();
  const { toast } = useToast();
  
  // Group management
  const {
    groups,
    newGroupName,
    setNewGroupName,
    inviteCode,
    setInviteCode,
    handleCreateGroup,
    handleJoinGroup,
    handleDeleteGroup,
    handleLeaveGroup,
  } = useGroupManagement();

  // UI state
  const [activeView, setActiveView] = useState<ViewType>('home');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const isHeadOfFamily = groups.some(group => group.head_of_family_id === user?.id);

  // Handle onboarding and auth flow - PERBAIKAN LOGIKA ONBOARDING
  useEffect(() => {
    if (!loading && !user) {
      const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
      console.log('Checking onboarding status:', hasSeenOnboarding);
      
      if (!hasSeenOnboarding) {
        console.log('Showing onboarding...');
        setShowOnboarding(true);
        setShowAuth(false);
      } else {
        console.log('Showing auth...');
        setShowOnboarding(false);
        setShowAuth(true);
      }
    } else if (!loading && user) {
      // User sudah login, reset flags
      setShowOnboarding(false);
      setShowAuth(false);
    }
  }, [user, loading]);

  const handleOnboardingComplete = () => {
    console.log('Onboarding completed, setting localStorage');
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
    setShowAuth(true);
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

  // Loading state
  if (loading) {
    return <LoadingScreen />;
  }

  // Non-authenticated user flows
  if (!user) {
    if (showOnboarding) {
      console.log('Rendering onboarding');
      return <Onboarding onComplete={handleOnboardingComplete} />;
    }
    if (showAuth) {
      console.log('Rendering auth');
      return <Auth />;
    }
    
    // Landing page - fallback jika tidak ada flag yang set
    console.log('Rendering landing page');
    return (
      <LandingPage 
        onShowOnboarding={() => {
          setShowOnboarding(true);
          setShowAuth(false);
        }}
        onShowAuth={() => {
          setShowOnboarding(false);
          setShowAuth(true);
        }}
      />
    );
  }

  // Authenticated user
  console.log('Rendering authenticated app');
  return (
    <AuthenticatedApp
      activeView={activeView}
      onTabChange={handleTabChange}
      profile={profile}
      user={user}
      isHeadOfFamily={isHeadOfFamily}
      groups={groups}
      selectedGroupId={selectedGroupId}
      onSelectGroup={setSelectedGroupId}
      devices={devices}
      onSendNotification={handleSendNotification}
      newGroupName={newGroupName}
      setNewGroupName={setNewGroupName}
      inviteCode={inviteCode}
      setInviteCode={setInviteCode}
      onCreateGroup={handleCreateGroup}
      onJoinGroup={handleJoinGroup}
      onDeleteGroup={handleDeleteGroup}
      onLeaveGroup={handleLeaveGroup}
    />
  );
};

export default Index;
