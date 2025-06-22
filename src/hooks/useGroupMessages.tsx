
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

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
    
    // Set up real-time subscription
    const channel = supabase
      .channel(`group-messages-${groupId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'group_messages',
          filter: `group_id=eq.${groupId}`
        },
        (payload) => {
          console.log('New message:', payload);
          fetchMessages(); // Refresh messages when new one arrives
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
        .select(`
          *,
          sender:profiles(full_name)
        `)
        .eq('group_id', groupId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Map the data to match our type structure
      const mappedMessages = (data || []).map(message => ({
        ...message,
        sender: message.sender ? { full_name: message.sender.full_name } : undefined
      }));
      
      setMessages(mappedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (message: string, mentions: string[] = []) => {
    if (!user || !groupId || !message.trim()) return;

    try {
      const { error } = await supabase
        .from('group_messages')
        .insert({
          group_id: groupId,
          sender_id: user.id,
          message: message.trim(),
          mentions
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const sendSystemNotification = async (message: string) => {
    if (!user || !groupId) return;

    try {
      const { error } = await supabase
        .from('group_messages')
        .insert({
          group_id: groupId,
          sender_id: user.id,
          message,
          is_system_notification: true,
          message_type: 'notification'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending system notification:', error);
      throw error;
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    sendSystemNotification,
    refreshMessages: fetchMessages
  };
}
