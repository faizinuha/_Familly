
import { useState, useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { useNativeDeviceInfo } from './useNativeDeviceInfo';
import { registerOrUpdateDevice } from '@/utils/deviceRegistration';
import { updateDeviceStatus, getOnlineDevices, getCurrentUserDevices } from '@/utils/deviceStatusManager';
import { logActivity, sendNotification } from '@/utils/activityLogger';
import { RealtimeSubscriptionManager } from '@/utils/realtimeSubscriptions';
import { fetchDevices, fetchActivities } from '@/utils/deviceDataFetcher';
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
  
  // Use refs to track managers and intervals
  const subscriptionManagerRef = useRef<RealtimeSubscriptionManager | null>(null);
  const statusIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const activityIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user || deviceLoading || !deviceInfo) {
      setDevices([]);
      setActivities([]);
      setLoading(false);
      return;
    }

    const initializeMonitoring = async () => {
      // Register or update device
      const deviceId = await registerOrUpdateDevice(user, deviceInfo);
      setCurrentDeviceId(deviceId);

      // Log initial activity
      if (deviceId) {
        await logActivity(user.id, deviceId, 'Family App', 'app_start');
      }

      // Fetch initial data
      const [devicesData, activitiesData] = await Promise.all([
        fetchDevices(),
        fetchActivities()
      ]);
      
      setDevices(devicesData);
      setActivities(activitiesData);

      // Clear existing intervals
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current);
      }
      if (activityIntervalRef.current) {
        clearInterval(activityIntervalRef.current);
      }

      // Update device status every 30 seconds
      statusIntervalRef.current = setInterval(() => {
        if (deviceId) {
          updateDeviceStatus(deviceId, 'online');
        }
      }, 30000);

      // Log activity every 2 minutes
      activityIntervalRef.current = setInterval(() => {
        if (deviceId) {
          logActivity(user.id, deviceId, 'Family App', 'active_usage', 2);
        }
      }, 120000);

      // Setup real-time subscriptions
      subscriptionManagerRef.current = new RealtimeSubscriptionManager();
      subscriptionManagerRef.current.setupDeviceSubscription(user.id, async () => {
        const updatedDevices = await fetchDevices();
        setDevices(updatedDevices);
      });
      subscriptionManagerRef.current.setupActivitySubscription(user.id, async () => {
        const updatedActivities = await fetchActivities();
        setActivities(updatedActivities);
      });
    };

    initializeMonitoring();

    // Cleanup on page unload
    const handleBeforeUnload = () => {
      if (currentDeviceId) {
        updateDeviceStatus(currentDeviceId, 'offline');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // Clear intervals
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current);
      }
      if (activityIntervalRef.current) {
        clearInterval(activityIntervalRef.current);
      }
      
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Cleanup subscriptions
      if (subscriptionManagerRef.current) {
        subscriptionManagerRef.current.cleanupAll();
      }
      
      // Set device offline when component unmounts
      if (currentDeviceId) {
        updateDeviceStatus(currentDeviceId, 'offline');
      }
    };
  }, [user, deviceInfo, deviceLoading]);

  const refreshDevices = async () => {
    const updatedDevices = await fetchDevices();
    setDevices(updatedDevices);
  };

  const refreshActivities = async () => {
    const updatedActivities = await fetchActivities();
    setActivities(updatedActivities);
  };

  const handleSendNotification = async (message: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    await sendNotification(user.id, message);
  };

  const handleLogActivity = async (appName: string, activityType: string, durationMinutes?: number) => {
    if (!user) return;
    await logActivity(user.id, currentDeviceId, appName, activityType, durationMinutes);
  };

  return {
    devices,
    activities,
    loading,
    deviceInfo,
    currentDeviceId,
    updateDeviceStatus,
    logActivity: handleLogActivity,
    getOnlineDevices: () => getOnlineDevices(devices),
    getCurrentUserDevices: () => getCurrentUserDevices(devices, user?.id),
    refreshDevices,
    refreshActivities,
    sendNotification: handleSendNotification
  };
}
