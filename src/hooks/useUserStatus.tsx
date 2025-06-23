
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type UserStatus = Tables<'user_status'> & {
  profile?: {
    full_name: string;
  };
};

export function useUserStatus() {
  const { user } = useAuth();
  const [userStatuses, setUserStatuses] = useState<UserStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUserStatuses([]);
      setLoading(false);
      return;
    }

    fetchUserStatuses();
    updateMyStatus(true);

    // Update status every 30 seconds
    const statusInterval = setInterval(() => {
      updateMyStatus(true);
    }, 30000);

    // Set offline when leaving
    const handleBeforeUnload = () => {
      updateMyStatus(false);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Real-time subscription
    const channel = supabase
      .channel('user-status-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_status'
        },
        () => {
          fetchUserStatuses();
        }
      )
      .subscribe();

    return () => {
      clearInterval(statusInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      updateMyStatus(false);
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchUserStatuses = async () => {
    try {
      const { data, error } = await supabase
        .from('user_status')
        .select(`
          *,
          profiles!user_status_user_id_fkey(full_name)
        `)
        .order('last_seen', { ascending: false });

      if (error) throw error;
      
      const mappedStatuses = (data || []).map(status => ({
        ...status,
        profile: status.profiles ? { full_name: status.profiles.full_name } : undefined
      })) as UserStatus[];
      
      setUserStatuses(mappedStatuses);
    } catch (error) {
      console.error('Error fetching user statuses:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateMyStatus = async (isOnline: boolean, currentActivity?: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_status')
        .upsert({
          user_id: user.id,
          is_online: isOnline,
          last_seen: new Date().toISOString(),
          current_activity: currentActivity,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getOnlineUsers = () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return userStatuses.filter(status => 
      status.is_online && new Date(status.last_seen || '') > fiveMinutesAgo
    );
  };

  return {
    userStatuses,
    loading,
    updateMyStatus,
    getOnlineUsers,
    refreshStatuses: fetchUserStatuses
  };
}
