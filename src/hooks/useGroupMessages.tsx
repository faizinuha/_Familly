
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from './useAuth';

type GroupMessage = Tables<'group_messages'> & {
  profiles?: {
    full_name: string;
  };
};

export function useGroupMessages(groupId: string | null) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const channelRef = useRef<any>(null);

  // Fetch messages from DB
  const fetchMessages = async () => {
    if (!groupId || !user) {
      setMessages([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('group_messages')
        .select('*, profiles(full_name)')
        .eq('group_id', groupId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      const mapped = (data || []).map((msg) => ({
        ...msg,
        sender: msg.profiles
          ? { full_name: msg.profiles.full_name }
          : { full_name: 'Unknown' },
      })) as GroupMessage[];
      setMessages(mapped);
    } catch (e) {
      console.error('Error fetching messages:', e);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to realtime changes
  useEffect(() => {
    // Always cleanup previous channel first
    if (channelRef.current) {
      console.log('Cleaning up previous group messages channel');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    if (!groupId || !user) {
      setMessages([]);
      setLoading(false);
      return;
    }

    fetchMessages();

    // Create unique channel name to avoid duplicate subscriptions
    const channelName = `group-messages-${groupId}-${Date.now()}`;
    console.log('Creating new group messages channel:', channelName);
    
    try {
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'group_messages',
            filter: `group_id=eq.${groupId}`,
          },
          (payload) => {
            console.log('New group message received:', payload);
            fetchMessages(); // Refetch to get complete data with profiles
          }
        )
        .subscribe((status) => {
          console.log('Group messages channel subscription status:', status);
        });

      channelRef.current = channel;
    } catch (error) {
      console.error('Error setting up group messages channel:', error);
    }

    return () => {
      if (channelRef.current) {
        console.log('Cleanup group messages channel on unmount');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [groupId, user?.id]); // Remove fetchMessages from dependencies to avoid infinite loops

  const sendMessage = async (
    message: string,
    mentions: string[] = [],
    fileUrl?: string,
    fileType?: string,
    fileName?: string
  ) => {
    if (!user || !groupId || (!message.trim() && !fileUrl)) return;
    
    try {
      console.log('Sending group message:', { message, fileUrl, fileType, fileName });
      const { error } = await supabase.from('group_messages').insert({
        group_id: groupId,
        sender_id: user.id,
        message: message.trim() || '',
        mentions,
        file_url: fileUrl,
        file_type: fileType,
        file_name: fileName,
      });
      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in sendMessage:', error);
      throw error;
    }
  };

  const sendSystemNotification = async (message: string) => {
    if (!user || !groupId) return;
    try {
      const { error } = await supabase.from('group_messages').insert({
        group_id: groupId,
        sender_id: user.id,
        message,
        is_system_notification: true,
        message_type: 'notification',
      });
      if (error) throw error;
    } catch (e) {
      console.error('Error sending system notification:', e);
    }
  };

  const uploadFile = async (file: File) => {
    if (!user || !groupId) return null;
    
    try {
      console.log('Uploading file to group chat:', file.name, file.type, file.size);
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
      
      console.log('File uploaded successfully to group chat:', data.publicUrl);
      
      return {
        url: data.publicUrl,
        name: file.name,
        type: file.type,
      };
    } catch (error) {
      console.error('Error uploading file to group chat:', error);
      throw error;
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    sendSystemNotification,
    uploadFile,
    refreshMessages: fetchMessages,
  };
}
