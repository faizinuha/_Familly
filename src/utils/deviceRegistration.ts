
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  platform: string;
  osVersion: string;
  manufacturer: string;
  model: string;
  isVirtual: boolean;
  webViewVersion: string;
  batteryLevel?: number;
  isCharging?: boolean;
  networkType: string;
  isConnected: boolean;
}

export const registerOrUpdateDevice = async (user: User, deviceInfo: DeviceInfo): Promise<string | null> => {
  if (!user || !deviceInfo) return null;

  try {
    // Sanitize device name to avoid query issues
    const sanitizedDeviceName = deviceInfo.deviceName.replace(/[^\w\s-]/g, '').trim() || 'Unknown Device';
    
    console.log('Registering device:', { 
      user_id: user.id, 
      device_name: sanitizedDeviceName,
      original_name: deviceInfo.deviceName 
    });

    // Use a more robust query approach - search by user_id first
    const { data: existingDevices, error: searchError } = await supabase
      .from('devices')
      .select('id, device_name')
      .eq('user_id', user.id);

    if (searchError) {
      console.error('Error searching devices:', searchError);
      throw searchError;
    }

    // Find matching device by name comparison
    const existingDevice = existingDevices?.find(d => 
      d.device_name === sanitizedDeviceName || 
      d.device_name === deviceInfo.deviceName
    );

    if (existingDevice) {
      // Update existing device
      const { error } = await supabase
        .from('devices')
        .update({
          status: 'online',
          last_seen: new Date().toISOString(),
          device_type: deviceInfo.platform,
          current_app: 'Family App',
          updated_at: new Date().toISOString()
        })
        .eq('id', existingDevice.id);

      if (error) {
        console.error('Error updating device:', error);
        throw error;
      }
      console.log('Device updated successfully:', existingDevice.id);
      return existingDevice.id;
    } else {
      // Register new device
      const { data, error } = await supabase
        .from('devices')
        .insert({
          user_id: user.id,
          device_name: sanitizedDeviceName,
          device_type: deviceInfo.platform,
          status: 'online',
          current_app: 'Family App',
          last_seen: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error inserting device:', error);
        throw error;
      }
      console.log('New device registered:', data.id);
      return data.id;
    }
  } catch (error) {
    console.error('Error in registerOrUpdateDevice:', error);
    return null;
  }
};
