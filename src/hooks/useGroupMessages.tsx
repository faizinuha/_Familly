
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface GroupMessage {
  id: string;
  message: string;
  sender_id: string;
  group_id: string;
  created_at: string;
  file_url?: string;
  file_type?: string;
  file_name?: string;
  mentions?: string[];
  is_system_notification?: boolean;
  message_type?: string;
  profiles?: {
    id: string;
    full_name: string;
  };
}

export function useGroupMessages(groupId: string | null) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const currentGroupIdRef = useRef<string | null>(null);

  // Cleanup function for channel
  const cleanupChannel = () => {
    if (channelRef.current) {
      console.log('Cleaning up existing channel');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  };

  // Fetch messages for a group
  const fetchMessages = async (currentGroupId: string) => {
    if (!currentGroupId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('group_messages')
        .select(`
          *,
          profiles:sender_id (
            id,
            full_name
          )
        `)
        .eq('group_id', currentGroupId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat pesan',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Setup real-time subscription
  const setupRealtimeSubscription = (currentGroupId: string) => {
    if (!currentGroupId || !user) return;

    // Create unique channel name to prevent conflicts
    const channelName = `group-messages-${currentGroupId}-${user.id}-${Date.now()}`;
    console.log('Creating new group messages channel:', channelName);

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'group_messages',
          filter: `group_id=eq.${currentGroupId}`,
        },
        async (payload) => {
          console.log('Real-time message update:', payload);
          
          if (payload.eventType === 'INSERT') {
            // Fetch the complete message with profile data
            const { data: newMessage, error } = await supabase
              .from('group_messages')
              .select(`
                *,
                profiles:sender_id (
                  id,
                  full_name
                )
              `)
              .eq('id', payload.new.id)
              .single();

            if (!error && newMessage) {
              setMessages(prev => {
                // Check if message already exists to prevent duplicates
                const exists = prev.some(msg => msg.id === newMessage.id);
                if (exists) return prev;
                
                return [...prev, newMessage];
              });
            }
          } else if (payload.eventType === 'UPDATE') {
            setMessages(prev =>
              prev.map(msg =>
                msg.id === payload.new.id ? { ...msg, ...payload.new } : msg
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
          }
        }
      )
      .subscribe((status) => {
        console.log('Group messages channel subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to group messages');
        }
      });

    channelRef.current = channel;
  };

  // Main effect to handle group changes
  useEffect(() => {
    // If group changed or cleared, cleanup previous subscription
    if (currentGroupIdRef.current !== groupId) {
      cleanupChannel();
      setMessages([]);
      currentGroupIdRef.current = groupId;
    }

    if (groupId && user) {
      fetchMessages(groupId);
      setupRealtimeSubscription(groupId);
    }

    // Cleanup on unmount or group change
    return () => {
      if (currentGroupIdRef.current !== groupId) {
        cleanupChannel();
      }
    };
  }, [groupId, user]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupChannel();
    };
  }, []);

  const sendMessage = async (
    message: string,
    mentions: string[] = [],
    fileUrl?: string,
    fileType?: string,
    fileName?: string
  ) => {
    if (!user || !groupId || (!message.trim() && !fileUrl)) return;

    try {
      const messageData = {
        message: message.trim(),
        sender_id: user.id,
        group_id: groupId,
        mentions: mentions.length > 0 ? mentions : null,
        file_url: fileUrl || null,
        file_type: fileType || null,
        file_name: fileName || null,
        message_type: fileUrl ? 'file' : 'text',
      };

      const { error } = await supabase
        .from('group_messages')
        .insert(messageData);

      if (error) throw error;

    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    if (!user || !groupId) return null;

    try {
      const fileExtension = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
      const filePath = `group-files/${groupId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('chat-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('chat-files')
        .getPublicUrl(filePath);

      return publicUrl;
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
