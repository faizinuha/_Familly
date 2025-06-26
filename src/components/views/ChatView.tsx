
import React, { useState, useRef, useEffect } from 'react';
import { Send, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGroupMessages } from "@/hooks/useGroupMessages";
import { useGroupMembers } from "@/hooks/useGroupMembers";
import { useAuth } from "@/hooks/useAuth";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { useToast } from "@/hooks/use-toast";

interface ChatViewProps {
  groups: any[];
  selectedGroupId: string | null;
  onSelectGroup: (groupId: string | null) => void;
}

export default function ChatView({ groups, selectedGroupId, onSelectGroup }: ChatViewProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const { messages, loading: messagesLoading, sendMessage, uploadFile } = useGroupMessages(selectedGroupId);
  const { members, loading: membersLoading } = useGroupMembers(selectedGroupId);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

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
      // Fallback - still try to go back
      onSelectGroup(null);
    }
  };

  if (!selectedGroupId) {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold mb-2">Chat Keluarga</h2>
          <p className="opacity-90">Pilih grup untuk memulai percakapan</p>
        </div>
        <div className="grid gap-4">
          {groups.map((group) => (
            <Card 
              key={group.id} 
              className="cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-blue-200"
              onClick={() => onSelectGroup(group.id)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">
                        {group.name?.[0]?.toUpperCase() || 'G'}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-lg">{group.name || 'Unnamed Group'}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>Tap untuk mulai chat</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <Users className="h-6 w-6 text-blue-500 mb-1" />
                    <Badge variant="secondary" className="text-xs">
                      Chat
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
        {groups.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">Belum ada grup untuk chat</p>
            <p className="text-sm text-gray-400 mt-1">Buat atau join grup terlebih dahulu</p>
          </div>
        )}
      </div>
    );
  }

  const selectedGroup = groups.find(g => g.id === selectedGroupId);

  if (!selectedGroup) {
    console.error('Selected group not found:', selectedGroupId);
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 p-4 border-b bg-white">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h3 className="font-medium">Grup tidak ditemukan</h3>
          </div>
        </div>
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

  // Get member count with proper fallback
  const memberCount = members?.length || 0;
  
  console.log('ChatView - selectedGroup:', selectedGroup);
  console.log('ChatView - members:', members);
  console.log('ChatView - memberCount:', memberCount);
  console.log('ChatView - membersLoading:', membersLoading);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-gradient-to-r from-white to-blue-50 shadow-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackClick}
          className="hover:bg-blue-100"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">
              {selectedGroup.name?.[0]?.toUpperCase() || 'G'}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{selectedGroup.name || 'Unnamed Group'}</h3>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Users className="h-3 w-3" />
              {membersLoading ? (
                <span>Memuat anggota...</span>
              ) : (
                <span>{memberCount} anggota</span>
              )}
            </div>
          </div>
        </div>
        <Badge 
          variant="secondary" 
          className="bg-blue-100 text-blue-700 border-blue-200"
        >
          {memberCount} member{memberCount !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 bg-gray-50" ref={scrollAreaRef}>
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
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">Belum ada pesan</p>
              <p className="text-sm text-gray-400 mt-1">Mulai percakapan dengan anggota grup!</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
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
