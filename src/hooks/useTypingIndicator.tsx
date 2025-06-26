
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useTypingIndicator(groupId: string | null) {
  const { user } = useAuth();
  const [typingUsers, setTypingUsers] = useState<{ [key: string]: string }>({});
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!groupId || !user) {
      setTypingUsers({});
      return;
    }

    // Setup realtime channel for typing indicators
    const channelName = `typing-${groupId}`;
    
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    channelRef.current = supabase
      .channel(channelName)
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channelRef.current.presenceState();
        const newTypingUsers: { [key: string]: string } = {};
        
        Object.keys(presenceState).forEach(userId => {
          if (userId !== user.id && presenceState[userId]?.[0]?.typing) {
            newTypingUsers[userId] = presenceState[userId][0].full_name || 'Unknown';
          }
        });
        
        setTypingUsers(newTypingUsers);
      })
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [groupId, user]);

  const startTyping = async (fullName: string) => {
    if (!channelRef.current || !user) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Send typing status
    await channelRef.current.track({
      user_id: user.id,
      full_name: fullName,
      typing: true,
    });

    // Auto-stop typing after 3 seconds
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  };

  const stopTyping = async () => {
    if (!channelRef.current || !user) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    await channelRef.current.track({
      user_id: user.id,
      typing: false,
    });
  };

  return {
    typingUsers,
    startTyping,
    stopTyping,
  };
}
