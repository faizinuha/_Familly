import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

type GroupMessage = Tables<'group_messages'> & {
  sender?: {
    full_name: string;
  };
};

export function useGroupMessages(groupId: string | null) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!groupId || !user) {
      setMessages([]);
      setLoading(false);
      return;
    }

    fetchMessages();

    const channel = supabase
      .channel(`group-messages-${groupId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'group_messages',
          filter: `group_id=eq.${groupId}`,
        },
        (payload) => {
          setMessages((prev) => [
            ...prev,
            {
              ...(payload.new as GroupMessage),
              sender: payload.new.sender
                ? { full_name: payload.new.sender.full_name }
                : undefined,
            },
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId, user]);

  const fetchMessages = async () => {
    if (!groupId) return;

    try {
      const { data, error } = await supabase
        .from('group_messages')
        .select('*') // Tidak pakai join ke profiles
        .eq('group_id', groupId)
        .order('created_at', { ascending: true })
        .throwOnError();

      // Mapping nama pengirim: jika sender_id == user.id, pakai nama user, selain itu Unknown
      const mappedMessages = (data || []).map((message) => ({
        ...message,
        sender:
          message.sender_id === user?.id
            ? { full_name: user?.user_metadata?.full_name || 'Saya' }
            : { full_name: 'Unknown' },
      })) as GroupMessage[];

      setMessages(mappedMessages);
    } catch (error) {
      console.error('❌ Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (message: string, mentions: string[] = []) => {
    if (!user || !groupId || !message.trim()) return;

    try {
      const { error } = await supabase.from('group_messages').insert({
        group_id: groupId,
        sender_id: user.id,
        message: message.trim(),
        mentions,
      });

      if (error) throw error;
      // Fetch ulang pesan setelah kirim
      await fetchMessages();
    } catch (error) {
      console.error('❌ Error sending message:', error);
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

  return {
    messages,
    loading,
    sendMessage,
    sendSystemNotification,
    refreshMessages: fetchMessages,
  };
}
