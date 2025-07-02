import { supabase } from '@/integrations/supabase/client';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from './useAuth';

interface PrivateMessage {
  id: string;
  message: string;
  sender_id: string;
  recipient_id: string;
  created_at: string;
  file_url?: string;
  file_type?: string;
  file_name?: string;
}

export function usePrivateMessages(contactId: string | null) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<PrivateMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const channelRef = useRef<any>(null);

  // For now, store messages in local state since we don't have private_messages table
  // In a real app, you'd create a private_messages table in the database
  const [localMessages, setLocalMessages] = useState<PrivateMessage[]>([]);

  useEffect(() => {
    // Cleanup channel on contactId/user change or unmount
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    if (!contactId || !user) {
      setMessages([]);
      setLoading(false);
      return;
    }

    // Load messages for this contact
    setLoading(true);
    
    // Filter messages for this specific contact conversation
    const contactMessages = localMessages.filter(msg => 
      (msg.sender_id === user.id && msg.recipient_id === contactId) ||
      (msg.sender_id === contactId && msg.recipient_id === user.id)
    );
    
    setMessages(contactMessages);
    setLoading(false);

    // Set up real-time subscription for this contact
    const channelName = `private-messages-${[user.id, contactId].sort().join('-')}`;
    const channel = supabase
      .channel(channelName + '_' + Date.now())
      .on('broadcast', { event: 'new_message' }, (payload) => {
        const newMessage = payload.payload as PrivateMessage;
        if ((newMessage.sender_id === user.id && newMessage.recipient_id === contactId) ||
            (newMessage.sender_id === contactId && newMessage.recipient_id === user.id)) {
          setMessages(prev => [...prev, newMessage]);
          setLocalMessages(prev => [...prev, newMessage]);
        }
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [contactId, user, localMessages]);

  const sendMessage = async (
    message: string,
    fileUrl?: string,
    fileType?: string,
    fileName?: string
  ) => {
    if (!user || !contactId || (!message.trim() && !fileUrl)) return;

    const newMessage: PrivateMessage = {
      id: Date.now().toString(),
      message: message.trim() || '',
      sender_id: user.id,
      recipient_id: contactId,
      created_at: new Date().toISOString(),
      file_url: fileUrl,
      file_type: fileType,
      file_name: fileName,
    };

    // Add to local state
    setMessages(prev => [...prev, newMessage]);
    setLocalMessages(prev => [...prev, newMessage]);

    // Broadcast to other clients
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'new_message',
        payload: newMessage
      });
    }
  };

  const uploadFile = async (file: File) => {
    if (!user || !contactId) return null;
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('chat-files')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('chat-files')
        .getPublicUrl(fileName);
      
      return {
        url: data.publicUrl,
        name: file.name,
        type: file.type,
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    uploadFile,
  };
}