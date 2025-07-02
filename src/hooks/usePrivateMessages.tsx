
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
  const [localMessages, setLocalMessages] = useState<PrivateMessage[]>([]);

  useEffect(() => {
    // Always cleanup previous channel first
    if (channelRef.current) {
      console.log('Cleaning up previous channel');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    if (!contactId || !user) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Filter messages for this specific contact conversation
    const contactMessages = localMessages.filter(msg => 
      (msg.sender_id === user.id && msg.recipient_id === contactId) ||
      (msg.sender_id === contactId && msg.recipient_id === user.id)
    );
    
    setMessages(contactMessages);
    setLoading(false);

    // Create unique channel name to avoid duplicate subscriptions
    const channelName = `private-${user.id}-${contactId}-${Date.now()}`;
    console.log('Creating new channel:', channelName);
    
    try {
      const channel = supabase
        .channel(channelName)
        .on('broadcast', { event: 'new_message' }, (payload) => {
          console.log('Received broadcast message:', payload);
          const newMessage = payload.payload as PrivateMessage;
          if ((newMessage.sender_id === user.id && newMessage.recipient_id === contactId) ||
              (newMessage.sender_id === contactId && newMessage.recipient_id === user.id)) {
            setMessages(prev => [...prev, newMessage]);
            setLocalMessages(prev => [...prev, newMessage]);
          }
        })
        .subscribe((status) => {
          console.log('Channel subscription status:', status);
        });

      channelRef.current = channel;
    } catch (error) {
      console.error('Error setting up channel:', error);
      setLoading(false);
    }

    return () => {
      if (channelRef.current) {
        console.log('Cleanup on unmount');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [contactId, user?.id]); // Remove localMessages from dependency to avoid infinite loops

  const sendMessage = async (
    message: string,
    fileUrl?: string,
    fileType?: string,
    fileName?: string
  ) => {
    if (!user || !contactId || (!message.trim() && !fileUrl)) return;

    const newMessage: PrivateMessage = {
      id: `${Date.now()}-${Math.random()}`,
      message: message.trim() || '',
      sender_id: user.id,
      recipient_id: contactId,
      created_at: new Date().toISOString(),
      file_url: fileUrl,
      file_type: fileType,
      file_name: fileName,
    };

    console.log('Sending message:', newMessage);

    // Add to local state immediately
    setMessages(prev => [...prev, newMessage]);
    setLocalMessages(prev => [...prev, newMessage]);

    // Broadcast to other clients
    if (channelRef.current) {
      try {
        const result = await channelRef.current.send({
          type: 'broadcast',
          event: 'new_message',
          payload: newMessage
        });
        console.log('Broadcast result:', result);
      } catch (error) {
        console.error('Error broadcasting message:', error);
      }
    }
  };

  const uploadFile = async (file: File) => {
    if (!user || !contactId) return null;
    
    try {
      console.log('Starting file upload:', file.name, file.type, file.size);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('chat-files')
        .upload(fileName, file);
      
      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }
      
      const { data } = supabase.storage
        .from('chat-files')
        .getPublicUrl(fileName);
      
      console.log('File uploaded successfully:', data.publicUrl);
      
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
