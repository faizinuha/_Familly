
import React, { useState, useRef, useEffect } from 'react';
import { Send, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGroupMessages } from "@/hooks/useGroupMessages";
import { useGroupMembers } from "@/hooks/useGroupMembers";
import { useAuth } from "@/hooks/useAuth";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { useToast } from "@/hooks/use-toast";

interface ChatViewProps {
  groups: any[];
  selectedGroupId: string | null;
  onSelectGroup: (groupId: string | null) => void;
}

const TypingIndicator: React.FC<{ typingUsers: { [key: string]: string } }> = ({ typingUsers }) => {
  const typingUserNames = Object.values(typingUsers);
  
  if (typingUserNames.length === 0) return null;

  const displayText = typingUserNames.length === 1 
    ? `${typingUserNames[0]} sedang mengetik...`
    : `${typingUserNames.slice(0, 2).join(', ')}${typingUserNames.length > 2 ? ` dan ${typingUserNames.length - 2} lainnya` : ''} sedang mengetik...`;

  return (
    <div className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 bg-gray-50">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <span>{displayText}</span>
    </div>
  );
};

export default function ChatView({ groups, selectedGroupId, onSelectGroup }: ChatViewProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const { messages, loading: messagesLoading, sendMessage, uploadFile } = useGroupMessages(selectedGroupId);
  const { members, loading: membersLoading } = useGroupMembers(selectedGroupId);
  const { typingUsers, startTyping, stopTyping } = useTypingIndicator(selectedGroupId);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages, typingUsers]);

  const handleSendMessage = async (message: string, fileUrl?: string, fileType?: string, fileName?: string) => {
    try {
      stopTyping();
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
    console.log('Back button clicked, selectedGroupId:', selectedGroupId);
    console.log('Available groups:', groups);
    
    try {
      onSelectGroup(null);
      console.log('Successfully called onSelectGroup(null)');
    } catch (error) {
      console.error('Error in handleBackClick:', error);
      // Force refresh or fallback
      window.location.reload();
    }
  };

  const handleInputTyping = () => {
    if (user?.id) {
      const currentUser = members?.find(m => m.user_id === user.id);
      startTyping(currentUser?.profiles?.full_name || 'Unknown User');
    }
  };

  const handleInputStop = () => {
    stopTyping();
  };

  if (!selectedGroupId) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Chat Keluarga</h2>
        <div className="grid gap-4">
          {groups.map((group) => (
            <Card 
              key={group.id} 
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => onSelectGroup(group.id)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-700 font-bold">
                        {group.name?.[0]?.toUpperCase() || 'G'}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{group.name || 'Unnamed Group'}</div>
                      <div className="text-sm text-gray-500">
                        Tap untuk mulai chat
                      </div>
                    </div>
                  </div>
                  <Users className="h-5 w-5 text-gray-400" />
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
        {groups.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Belum ada grup untuk chat</p>
          </div>
        )}
      </div>
    );
  }

  const selectedGroup = groups.find(g => g.id === selectedGroupId);

  if (!selectedGroup) {
    console.error('Selected group not found:', selectedGroupId);
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="flex items-center gap-3 p-4 border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h3 className="font-medium text-red-600">Grup tidak ditemukan</h3>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Grup yang dipilih tidak tersedia</p>
            <Button onClick={handleBackClick} variant="outline">
              Kembali ke Daftar Grup
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-white sticky top-0 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackClick}
          className="hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-700 font-bold text-sm">
              {selectedGroup.name?.[0]?.toUpperCase() || 'G'}
            </span>
          </div>
          <div>
            <h3 className="font-medium">{selectedGroup.name || 'Unnamed Group'}</h3>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Users className="h-3 w-3" />
              <span>{members?.length || 0} anggota</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messagesLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Memuat pesan...</p>
            </div>
          ) : messages.length > 0 ? (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                currentUserId={user?.id || ''}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Belum ada pesan. Mulai percakapan!</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Typing Indicator */}
      <TypingIndicator typingUsers={typingUsers} />

      {/* Input Area */}
      <div className="border-t bg-white">
        <ChatInput
          onSendMessage={handleSendMessage}
          onUploadFile={handleUploadFile}
          onTyping={handleInputTyping}
          onStopTyping={handleInputStop}
          disabled={messagesLoading}
        />
      </div>
    </div>
  );
}
