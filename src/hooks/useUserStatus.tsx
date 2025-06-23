import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export type UserStatus = {
  id: string;
  user_id: string;
  is_online: boolean;
  last_seen: string | null;
  current_activity: string | null;
  created_at: string | null;
  updated_at: string | null;
};

declare module '@supabase/supabase-js' {
  export interface Database {
    public: {
      Tables: {
        user_status: {
          Row: UserStatus;
          Insert: Partial<UserStatus>;
          Update: Partial<UserStatus>;
          Relationships: [];
        };
        // ...other tables
      };
      // ...other properties
    };
  }
}

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

    const interval = setInterval(() => {
      updateMyStatus(true);
    }, 30000);

    const handleBeforeUnload = () => {
      updateMyStatus(false);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      updateMyStatus(false);
    };
  }, [user]);

  const fetchUserStatuses = async () => {
    try {
      const { data, error } = await supabase
        .from('user_status')
        .select(`
          id,
          user_id,
          is_online,
          last_seen,
          current_activity,
          created_at,
          updated_at
        `);

      if (error) {
        console.error('Error fetching user statuses:', error);
        return setUserStatuses([]);
      }

      setUserStatuses(data as UserStatus[]);
    } catch (err) {
      console.error('Unexpected error fetching statuses:', err);
      setUserStatuses([]);
    } finally {
      setLoading(false);
    }
  };

  const updateMyStatus = async (isOnline: boolean, currentActivity?: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('user_status').upsert({
        user_id: user.id,
        is_online: isOnline,
        last_seen: new Date().toISOString(),
        current_activity: currentActivity || null,
        updated_at: new Date().toISOString(),
      });

      if (error) console.error('Error updating status:', error);
    } catch (err) {
      console.error('Unexpected error updating status:', err);
    }
  };

  const getOnlineUsers = () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return userStatuses.filter(
      (s) => s.is_online && new Date(s.last_seen || '') > fiveMinutesAgo
    );
  };

  return {
    userStatuses,
    loading,
    updateMyStatus,
    getOnlineUsers,
    refreshStatuses: fetchUserStatuses,
  };
}
