
import { supabase } from '@/integrations/supabase/client';

export const logActivity = async (
  userId: string,
  deviceId: string | null,
  appName: string,
  activityType: string,
  durationMinutes?: number
) => {
  if (!userId) return;

  try {
    const { error } = await supabase
      .from('activity_logs')
      .insert({
        user_id: userId,
        device_id: deviceId,
        app_name: appName,
        activity_type: activityType,
        duration_minutes: durationMinutes
      });

    if (error) {
      console.error('Error logging activity:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

export const sendNotification = async (userId: string, message: string) => {
  if (!userId) {
    throw new Error('User not authenticated');
  }

  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title: 'Family Notification',
        message: message,
        type: 'monitoring'
      });

    if (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};
