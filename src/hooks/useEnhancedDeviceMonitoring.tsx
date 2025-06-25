
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useNativeDeviceInfo } from './useNativeDeviceInfo';
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

export function useEnhancedDeviceMonitoring() {
  const { user } = useAuth();
  const { deviceInfo, loading: deviceLoading } = useNativeDeviceInfo();
  const [devices, setDevices] = useState<Device[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || deviceLoading || !deviceInfo) {
      setDevices([]);
      setActivities([]);
      setLoading(false);
      return;
    }

    registerOrUpdateDevice();
    fetchDevices();
    fetchActivities();

    // Update device status every 30 seconds
    const statusInterval = setInterval(() => {
      if (currentDeviceId) {
        updateDeviceStatus(currentDeviceId, 'online');
      }
    }, 30000);

    // Log activity every 2 minutes
    const activityInterval = setInterval(() => {
      logCurrentActivity();
    }, 120000);

    // Real-time subscriptions
    const deviceChannel = supabase
      .channel('device-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'devices'
        },
        () => {
          fetchDevices();
        }
      )
      .subscribe();

    const activityChannel = supabase
      .channel('activity-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_logs'
        },
        () => {
          fetchActivities();
        }
      )
      .subscribe();

    // Cleanup on page unload
    const handleBeforeUnload = () => {
      if (currentDeviceId) {
        updateDeviceStatus(currentDeviceId, 'offline');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(statusInterval);
      clearInterval(activityInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      supabase.removeChannel(deviceChannel);
      supabase.removeChannel(activityChannel);
      
      // Set device offline when component unmounts
      if (currentDeviceId) {
        updateDeviceStatus(currentDeviceId, 'offline');
      }
    };
  }, [user, deviceInfo, deviceLoading, currentDeviceId]);

  const registerOrUpdateDevice = async () => {
    if (!user || !deviceInfo) return;

    try {
      // Check if device already exists
      const { data: existingDevice } = await supabase
        .from('devices')
        .select('id')
        .eq('user_id', user.id)
        .eq('device_name', deviceInfo.deviceName)
        .single();

      if (existingDevice) {
        // Update existing device
        const { error } = await supabase
          .from('devices')
          .update({
            status: 'online',
            last_seen: new Date().toISOString(),
            device_type: deviceInfo.platform,
            current_app: 'Good Family App',
            updated_at: new Date().toISOString()
          })
          .eq('id', existingDevice.id);

        if (error) throw error;
        setCurrentDeviceId(existingDevice.id);
      } else {
        // Register new device
        const { data, error } = await supabase
          .from('devices')
          .insert({
            user_id: user.id,
            device_name: deviceInfo.deviceName,
            device_type: deviceInfo.platform,
            status: 'online',
            current_app: 'Good Family App',
            last_seen: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;
        setCurrentDeviceId(data.id);
      }

      // Log initial activity
      await logActivity('Good Family App', 'app_start');
    } catch (error) {
      console.error('Error registering device:', error);
    }
  };

  const fetchDevices = async () => {
    try {
      const { data, error } = await supabase
        .from('devices')
        .select(`
          *,
          profiles(full_name)
        `)
        .order('last_seen', { ascending: false });

      if (error) throw error;
      setDevices(data || []);
    } catch (error) {
      console.error('Error fetching devices:', error);
      setDevices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select(`
          *,
          profiles(full_name)
        `)
        .order('timestamp', { ascending: false })
        .limit(50);

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setActivities([]);
    }
  };

  const updateDeviceStatus = async (deviceId: string, status: 'online' | 'offline', currentApp?: string) => {
    try {
      const { error } = await supabase
        .from('devices')
        .update({
          status,
          current_app: currentApp || 'Good Family App',
          last_seen: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', deviceId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating device status:', error);
    }
  };

  const logActivity = async (appName: string, activityType: string, durationMinutes?: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('activity_logs')
        .insert({
          user_id: user.id,
          device_id: currentDeviceId,
          app_name: appName,
          activity_type: activityType,
          duration_minutes: durationMinutes
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const logCurrentActivity = async () => {
    if (!user) return;
    
    // Log current app usage
    await logActivity('Good Family App', 'active_usage', 2);
  };

  const getOnlineDevices = () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return devices.filter(device => 
      device.status === 'online' && 
      new Date(device.last_seen || '') > fiveMinutesAgo
    );
  };

  const getCurrentUserDevices = () => {
    return devices.filter(device => device.user_id === user?.id);
  };

  return {
    devices,
    activities,
    loading,
    deviceInfo,
    currentDeviceId,
    updateDeviceStatus,
    logActivity,
    getOnlineDevices,
    getCurrentUserDevices,
    refreshDevices: fetchDevices,
    refreshActivities: fetchActivities
  };
}
