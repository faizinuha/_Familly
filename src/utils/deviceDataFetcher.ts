
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Device = Tables<'devices'> & {
  profiles?: {
    full_name: string;
  };
};

type ActivityLog = Tables<'activity_logs'> & {
  profiles?: {
    full_name: string;
  };
};

export const fetchDevices = async (): Promise<Device[]> => {
  try {
    const { data, error } = await supabase
      .from('devices')
      .select(`
        *,
        profiles(full_name)
      `)
      .order('last_seen', { ascending: false });

    if (error) {
      console.error('Error fetching devices:', error);
      throw error;
    }
    console.log('Devices fetched successfully:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Error fetching devices:', error);
    return [];
  }
};

export const fetchActivities = async (): Promise<ActivityLog[]> => {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select(`
        *,
        profiles(full_name)
      `)
      .order('timestamp', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
    console.log('Activities fetched successfully:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
};
