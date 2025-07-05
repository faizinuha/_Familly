
import { supabase } from '@/integrations/supabase/client';

export const updateDeviceStatus = async (
  deviceId: string, 
  status: 'online' | 'offline', 
  currentApp?: string
) => {
  try {
    const { error } = await supabase
      .from('devices')
      .update({
        status,
        current_app: currentApp || 'Family App',
        last_seen: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', deviceId);

    if (error) {
      console.error('Error updating device status:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error updating device status:', error);
  }
};

export const getOnlineDevices = (devices: any[]) => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  return devices.filter(device => 
    device.status === 'online' && 
    new Date(device.last_seen || '') > fiveMinutesAgo
  );
};

export const getCurrentUserDevices = (devices: any[], userId?: string) => {
  return devices.filter(device => device.user_id === userId);
};
