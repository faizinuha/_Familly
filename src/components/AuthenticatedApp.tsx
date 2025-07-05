
import React from 'react';
import { ViewType } from '@/pages/Index';
import HomeView from '@/components/views/HomeView';
import ChatView from '@/components/views/ChatView';
import GroupsView from '@/components/views/GroupsView';
import MonitoringView from '@/components/views/MonitoringView';
import EnhancedMonitoringView from '@/components/views/EnhancedMonitoringView';
import SettingsView from '@/components/views/SettingsView';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import { useDarkMode } from '@/hooks/useDarkMode';

interface AuthenticatedAppProps {
  activeView: ViewType;
  onTabChange: (tab: string) => void;
  profile: any;
  user: any;
  isHeadOfFamily: boolean;
  groups: any[];
  selectedGroupId: string | null;
  onSelectGroup: (groupId: string | null) => void;
  devices: any[];
  onSendNotification: (message: string) => Promise<void>;
  // Group management props
  newGroupName: string;
  setNewGroupName: (name: string) => void;
  inviteCode: string;
  setInviteCode: (code: string) => void;
  onCreateGroup: () => Promise<void>;
  onJoinGroup: () => Promise<void>;
  onDeleteGroup: (groupId: string) => Promise<void>;
  onLeaveGroup: (groupId: string) => Promise<void>;
}

const AuthenticatedApp: React.FC<AuthenticatedAppProps> = ({
  activeView,
  onTabChange,
  profile,
  user,
  isHeadOfFamily,
  groups,
  selectedGroupId,
  onSelectGroup,
  devices,
  onSendNotification,
  newGroupName,
  setNewGroupName,
  inviteCode,
  setInviteCode,
  onCreateGroup,
  onJoinGroup,
  onDeleteGroup,
  onLeaveGroup,
}) => {
  const { isDarkMode } = useDarkMode();

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
            onSelectGroup={onSelectGroup}
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
            onCreateGroup={onCreateGroup}
            onJoinGroup={onJoinGroup}
            onDeleteGroup={onDeleteGroup}
            onSelectGroup={onSelectGroup}
            onLeaveGroup={onLeaveGroup}
          />
        );
      case 'monitoring':
        return (
          <MonitoringView 
            devices={devices}
            isHeadOfFamily={isHeadOfFamily}
            onSendNotification={onSendNotification}
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
            onTabChange={onTabChange} 
            isHeadOfFamily={isHeadOfFamily} 
          />
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedApp;
