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
    deleteMessage,
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

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
      toast({
        title: 'Berhasil',
        description: 'Pesan berhasil dihapus',
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: 'Error',
        description: 'Gagal menghapus pesan',
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

  const getStatusText = (status: Contact['status']) => {
    switch (status) {
      case 'online': return 'Online';
      case 'busy': return 'Sibuk';
      case 'offline': return contact.lastSeen ? `Terakhir dilihat ${contact.lastSeen}` : 'Offline';
      default: return 'Offline';
    }
  };

  const transformedMessages = messages.map(msg => ({
    ...msg,
    sender_id: msg.sender_id,
    sender: msg.sender_id === user?.id ? undefined : { full_name: contact.name },
    created_at: msg.created_at,
  }));

  return (
    <div className="flex flex-col h-full max-w-md mx-auto bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 flex items-center gap-3 shadow-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-white hover:bg-white/20 p-2 h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold shadow-sm">
            {contact.avatar}
          </div>
          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(contact.status)}`}></div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">{contact.name}</h3>
          <p className="text-sm opacity-90 truncate">
            {getStatusText(contact.status)}
          </p>
        </div>
        
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2 h-8 w-8">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2 h-8 w-8">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2 h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ChatMessages
        messages={transformedMessages}
        messagesLoading={loading}
        currentUserId={user?.id || ''}
        onDeleteMessage={handleDeleteMessage}
      />

      {/* Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onUploadFile={handleUploadFile}
        disabled={loading}
      />
    </div>
  );
};

export default ContactChat;
