
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

type UserStatus = {
  id: string;
  user_id: string;
  is_online: boolean;
  last_seen: string | null;
  current_activity: string | null;
  created_at: string | null;
  updated_at: string | null;
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

    return () => {
      clearInterval(statusInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      updateMyStatus(false);
    };
  }, [user]);

  const fetchUserStatuses = async () => {
    try {
      // Use raw SQL query since user_status table might not be in types yet
      const { data, error } = await supabase.rpc('get_user_statuses');

      if (error) {
        console.error('Error fetching user statuses:', error);
        setUserStatuses([]);
      } else {
        setUserStatuses(data || []);
      }
    } catch (error) {
      console.error('Error fetching user statuses:', error);
      setUserStatuses([]);
    } finally {
      setLoading(false);
    }
  };

  const updateMyStatus = async (isOnline: boolean, currentActivity?: string) => {
    if (!user) return;

    try {
      // Use raw SQL to update status since table might not be in types
      const { error } = await supabase.rpc('update_user_status', {
        p_user_id: user.id,
        p_is_online: isOnline,
        p_current_activity: currentActivity || null
      });

      if (error) {
        console.error('Error updating status:', error);
      }
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
