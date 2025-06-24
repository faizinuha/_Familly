
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Users, X } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import ContactSidebar from "@/components/ContactSidebar";
import { useToast } from "@/hooks/use-toast";

interface ChatViewProps {
  selectedGroup: any;
  messages: any[];
  user: any;
  onSendMessage: (message: string, fileUrl?: string, fileType?: string, fileName?: string) => Promise<void>;
  onUploadFile: (file: File) => Promise<any>;
}

const ChatView: React.FC<ChatViewProps> = ({
  selectedGroup,
  messages,
  user,
  onSendMessage,
  onUploadFile
}) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { toast } = useToast();

  const handleNotifyMembers = () => {
    toast({
      title: "Notifikasi Terkirim",
      description: "Semua anggota grup telah diberitahu tentang pesan baru",
    });
  };

  return (
    <div className="flex h-full max-h-screen relative">
      {/* Contact Sidebar */}
      <ContactSidebar 
        isOpen={showSidebar} 
        onClose={() => setShowSidebar(false)}
        selectedGroup={selectedGroup}
      />

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSidebar(true)}
            >
              <Users className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-bold">Chat Grup</h2>
            {selectedGroup && (
              <Badge variant="secondary">{selectedGroup.name}</Badge>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNotifyMembers}
          >
            <Bell className="h-4 w-4 mr-2" />
            Notify
          </Button>
        </div>

        {selectedGroup ? (
          <div className="flex flex-col flex-1 min-h-0">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  currentUserId={user?.id || ''}
                />
              ))}
              {messages.length === 0 && (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-gray-500">Belum ada pesan. Mulai percakapan!</p>
                </div>
              )}
            </div>
            
            {/* Chat Input - Always at bottom */}
            <div className="border-t bg-white">
              <ChatInput
                onSendMessage={onSendMessage}
                onUploadFile={onUploadFile}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Pilih grup untuk mulai chat</p>
            </div>
            {/* Chat Input - Always at bottom even when no group selected */}
            <div className="border-t bg-white">
              <div className="p-4 text-center text-gray-400">
                Pilih grup untuk mengirim pesan
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatView;
