
import ChatGroupList from '@/components/chat/ChatGroupList';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/ChatInput';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useGroupMembers } from '@/hooks/useGroupMembers';
import { useGroupMessages } from '@/hooks/useGroupMessages';
import { Phone, User, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import ContactList from '@/components/chat/ContactList';

interface Group {
  id: string;
  name: string;
}

interface ChatViewProps {
  groups: Group[];
  selectedGroupId: string | null;
  onSelectGroup: (groupId: string | null) => void;
}

export default function ChatView({
  groups,
  selectedGroupId,
  onSelectGroup,
}: ChatViewProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'group' | 'contact' | 'call'>('group');

  const {
    messages,
    loading: messagesLoading,
    sendMessage,
    uploadFile,
  } = useGroupMessages(activeTab === 'group' ? selectedGroupId : null);
  const { members, loading: membersLoading } = useGroupMembers(
    activeTab === 'group' ? selectedGroupId : null
  );

  useEffect(() => {
    if (activeTab === 'group' && selectedGroupId) {
      console.log('ChatView members update:', {
        selectedGroupId,
        members,
        memberCount: members?.length || 0,
        membersLoading,
      });
    }
  }, [members, selectedGroupId, membersLoading, activeTab]);

  const handleSendMessage = async (
    message: string,
    fileUrl?: string,
    fileType?: string,
    fileName?: string
  ) => {
    try {
      await sendMessage(message, [], fileUrl, fileType, fileName);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Gagal mengirim pesan',
        variant: 'destructive',
      });
    }
  };

  const handleUploadFile = async (file: File) => {
    try {
      return await uploadFile(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Error',
        description: 'Gagal upload file',
        variant: 'destructive',
      });
      return null;
    }
  };

  const [lastOpenedGroupId, setLastOpenedGroupId] = useState<string | null>(null);
  const availableGroups = groups;
  const filteredGroups = groups.filter((g: any) => {
    const isJoined = g.joined === true;
    const isOwner = g.ownerId === user?.id;
    return isJoined || isOwner;
  });

  useEffect(() => {
    if (selectedGroupId) setLastOpenedGroupId(selectedGroupId);
  }, [selectedGroupId]);

  const handleBackClick = () => {
    if (membersLoading) return;
    onSelectGroup(null);
  };

  const handleTabChange = (tab: 'group' | 'contact' | 'call') => {
    setActiveTab(tab);
    if (activeTab === 'group' && tab !== 'group') {
      onSelectGroup(null);
    }
  };

  const tabList = [
    { key: 'group', label: 'Grup', icon: Users },
    { key: 'contact', label: 'Kontak', icon: User },
    { key: 'call', label: 'Telepon', icon: Phone },
  ];

  return (
    <div className="flex flex-col h-full relative">
      {/* Tab Navbar */}
      <div className="flex border-b bg-white dark:bg-gray-900 sticky top-0 z-40">
        {tabList.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key as 'group' | 'contact' | 'call')}
            className={`flex-1 flex flex-col items-center py-3 px-1 text-sm font-medium transition-all border-b-2 ${
              activeTab === tab.key
                ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            <tab.icon className="h-5 w-5 mb-1" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {activeTab === 'group' && (
          <>
            {!selectedGroupId ? (
              <ChatGroupList
                groups={availableGroups}
                onSelectGroup={onSelectGroup}
                lastOpenedGroupId={lastOpenedGroupId}
              />
            ) : (
              (() => {
                const selectedGroup = availableGroups.find((g) => g.id === selectedGroupId);
                if (!selectedGroup) {
                  return (
                    <div className="flex flex-col h-full">
                      <ChatHeader
                        selectedGroup={{
                          id: selectedGroupId,
                          name: 'Grup tidak ditemukan',
                        }}
                        memberCount={0}
                        membersLoading={false}
                        onBackClick={handleBackClick}
                        groups={availableGroups}
                        onSelectGroup={onSelectGroup}
                      />
                      <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-gray-500 dark:text-gray-400 mb-4">
                            Grup yang dipilih tidak tersedia
                          </p>
                          <Button onClick={handleBackClick}>Kembali ke Daftar Grup</Button>
                        </div>
                      </div>
                    </div>
                  );
                }
                if (membersLoading) {
                  return (
                    <div className="flex flex-col h-full items-center justify-center">
                      <div className="text-gray-400 dark:text-gray-500 text-sm">
                        Memuat anggota grup...
                      </div>
                    </div>
                  );
                }
                if (!members) {
                  return (
                    <div className="flex flex-col h-full items-center justify-center">
                      <div className="text-gray-400 dark:text-gray-500 text-sm">
                        Tidak ada anggota grup ditemukan.
                      </div>
                    </div>
                  );
                }
                const actualMemberCount = members.length;
                return (
                  <div className="flex flex-col h-full">
                    <ChatHeader
                      selectedGroup={selectedGroup}
                      memberCount={actualMemberCount}
                      membersLoading={membersLoading}
                      onBackClick={handleBackClick}
                      groups={availableGroups}
                      onSelectGroup={onSelectGroup}
                    />
                    <div className="flex-1 min-h-0">
                      <ChatMessages
                        messages={messages}
                        messagesLoading={messagesLoading}
                        currentUserId={user?.id || ''}
                      />
                    </div>
                    <ChatInput
                      onSendMessage={handleSendMessage}
                      onUploadFile={handleUploadFile}
                      disabled={messagesLoading}
                      members={members}
                    />
                  </div>
                );
              })()
            )}
          </>
        )}
        {activeTab === 'contact' && <ContactList />}
        {activeTab === 'call' && (
          <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500 text-lg">
            Fitur telepon coming soon
          </div>
        )}
      </div>
    </div>
  );
}
