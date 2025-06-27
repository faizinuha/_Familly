
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useGroupMessages } from "@/hooks/useGroupMessages";
import { useGroupMembers } from "@/hooks/useGroupMembers";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatGroupList from "@/components/chat/ChatGroupList";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/ChatInput";
import EmptyState from "@/components/ui/EmptyState";
import { Users } from "lucide-react";

interface ChatViewProps {
  groups: any[];
  selectedGroupId: string | null;
  onSelectGroup: (groupId: string | null) => void;
}

export default function ChatView({ groups, selectedGroupId, onSelectGroup }: ChatViewProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { messages, loading: messagesLoading, sendMessage, uploadFile } = useGroupMessages(selectedGroupId);
  const { members, loading: membersLoading } = useGroupMembers(selectedGroupId);

  // Debug logging for member count
  useEffect(() => {
    console.log('ChatView members update:', {
      selectedGroupId,
      members,
      memberCount: members?.length || 0,
      membersLoading
    });
  }, [members, selectedGroupId, membersLoading]);

  const handleSendMessage = async (message: string, fileUrl?: string, fileType?: string, fileName?: string) => {
    try {
      await sendMessage(message, [], fileUrl, fileType, fileName);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Gagal mengirim pesan",
        variant: "destructive"
      });
    }
  };

  const handleUploadFile = async (file: File) => {
    try {
      return await uploadFile(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error", 
        description: "Gagal upload file",
        variant: "destructive"
      });
      return null;
    }
  };

  const handleBackClick = () => {
    try {
      console.log('Back button clicked, returning to group list');
      onSelectGroup(null);
    } catch (error) {
      console.error('Error in handleBackClick:', error);
      onSelectGroup(null);
    }
  };

  if (!selectedGroupId) {
    return <ChatGroupList groups={groups} onSelectGroup={onSelectGroup} />;
  }

  const selectedGroup = groups.find(g => g.id === selectedGroupId);

  if (!selectedGroup) {
    console.error('Selected group not found:', selectedGroupId);
    return (
      <div className="flex flex-col h-full">
        <ChatHeader
          selectedGroup={{ id: selectedGroupId, name: 'Grup tidak ditemukan' }}
          memberCount={0}
          membersLoading={false}
          onBackClick={handleBackClick}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Grup yang dipilih tidak tersedia</p>
            <Button onClick={handleBackClick}>
              Kembali ke Daftar Grup
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const actualMemberCount = members?.length || 0;

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        selectedGroup={selectedGroup}
        memberCount={actualMemberCount}
        membersLoading={membersLoading}
        onBackClick={handleBackClick}
      />

      <ChatMessages
        messages={messages}
        messagesLoading={messagesLoading}
        currentUserId={user?.id || ''}
      />

      <div className="border-t bg-white shadow-lg">
        <ChatInput
          onSendMessage={handleSendMessage}
          onUploadFile={handleUploadFile}
          disabled={messagesLoading}
        />
      </div>
    </div>
  );
}
