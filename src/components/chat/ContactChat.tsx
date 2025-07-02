
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Video, MoreVertical } from "lucide-react";
import ChatMessages from './ChatMessages';
import ChatInput from '@/components/ChatInput';
import { usePrivateMessages } from '@/hooks/usePrivateMessages';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Contact {
  id: string;
  name: string;
  phone: string;
  status: 'online' | 'offline' | 'busy';
  avatar: string;
  lastSeen?: string;
  isFamily?: boolean;
}


interface ContactChatProps {
  contact: Contact;
  onBack: () => void;
}

const ContactChat: React.FC<ContactChatProps> = ({ contact, onBack }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    messages,
    loading,
    sendMessage,
    uploadFile,
  } = usePrivateMessages(contact.id);

  const handleSendMessage = async (
    message: string,
    fileUrl?: string,
    fileType?: string,
    fileName?: string
  ) => {
    try {
      await sendMessage(message, fileUrl, fileType, fileName);
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

  const getStatusColor = (status: Contact['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  // Transform messages to match ChatMessage component format
  const transformedMessages = messages.map(msg => ({
    ...msg,
    sender_id: msg.sender_id,
    sender: msg.sender_id === user?.id ? undefined : { full_name: contact.name },
    created_at: msg.created_at,
  }));

  return (
    <div className="flex flex-col h-full max-w-md mx-auto">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 flex items-center gap-3 sticky top-0 z-10 shadow-md">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-white hover:bg-white/20 p-2 shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <div className="relative shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm sm:text-lg shadow-lg">
            {contact.avatar}
          </div>
          <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-white ${getStatusColor(contact.status)}`}></div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm sm:text-lg truncate">{contact.name}</h3>
          <p className="text-xs sm:text-sm opacity-90 truncate">
            {contact.status === 'online' ? 'Online' : 
             contact.status === 'busy' ? 'Sibuk' : 
             contact.lastSeen ? `Terakhir dilihat ${contact.lastSeen}` : 'Offline'}
          </p>
        </div>
        
        <div className="flex gap-1 sm:gap-2 shrink-0">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-1.5 sm:p-2">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-1.5 sm:p-2">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-1.5 sm:p-2">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ChatMessages
        messages={transformedMessages}
        messagesLoading={loading}
        currentUserId={user?.id || ''}
      />

      {/* Message Input */}
      <div className="border-t bg-white shadow-lg sticky bottom-0 z-10">
        <ChatInput
          onSendMessage={handleSendMessage}
          onUploadFile={handleUploadFile}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default ContactChat;
