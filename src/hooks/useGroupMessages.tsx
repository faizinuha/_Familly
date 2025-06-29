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
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to realtime changes
  useEffect(() => {
    // Cleanup channel on groupId/user change or unmount
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    if (!groupId || !user) {
      setMessages([]);
      setLoading(false);
      return;
    }
    fetchMessages();
    const channelName = `group-messages-${groupId}`;
    // Always create a new channel instance for each groupId
    const channel = supabase
      .channel(channelName + '_' + Date.now())
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'group_messages',
          filter: `group_id=eq.${groupId}`,
        },
        () => fetchMessages()
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

  const sendMessage = async (
    message: string,
    mentions: string[] = [],
    fileUrl?: string,
    fileType?: string,
    fileName?: string
  ) => {
    if (!user || !groupId || (!message.trim() && !fileUrl)) return;
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
      console.error(e);
    }
  };

  const uploadFile = async (file: File) => {
    if (!user || !groupId) return null;
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
