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
  const [loading, setLoading] = useState(true);

  const channelRef = useRef<any>(null);
  useEffect(() => {
    if (!groupId || !user) {
      setMessages([]);
      setLoading(false);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      return;
    }

    fetchMessages();

    // Cleanup previous channel if exists
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const channelName = `group-messages-${groupId}`;
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
          fetchMessages();
        }
      )
      .subscribe();
    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [groupId, user]);

  const fetchMessages = async () => {
    if (!groupId || !user) return;

    try {
      const { data, error } = await supabase
        .from('group_messages')
        .select(
          `
          *,
          profiles(full_name)
        `
        )
        .eq('group_id', groupId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const mappedMessages = (data || []).map((message) => ({
        ...message,
        sender: message.profiles
          ? { full_name: message.profiles.full_name }
          : { full_name: 'Unknown' },
      })) as GroupMessage[];

      setMessages(mappedMessages);
    } catch (error) {
      console.error('❌ Error fetching messages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (
    message: string,
    mentions: string[] = [],
    fileUrl?: string,
    fileType?: string,
    fileName?: string
  ) => {
    if (!user || !groupId || (!message.trim() && !fileUrl)) return;

    try {
      const { error } = await supabase.from('group_messages').insert({
        group_id: groupId,
        sender_id: user.id,
        message: message.trim() || '',
        mentions,
        file_url: fileUrl,
        file_type: fileType,
        file_name: fileName,
      });

      if (error) throw error;
    } catch (error) {
      console.error('❌ Error sending message:', error);
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
    } catch (error) {
      console.error('❌ Error sending system notification:', error);
    }
  };

  const uploadFile = async (file: File) => {
    if (!user || !groupId) return null;

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
      console.error('❌ Error uploading file:', error);
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
