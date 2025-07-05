
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export class RealtimeSubscriptionManager {
  private deviceChannel: RealtimeChannel | null = null;
  private activityChannel: RealtimeChannel | null = null;

  setupDeviceSubscription(userId: string, onDeviceChange: () => void) {
    this.cleanupDeviceSubscription();

    const deviceChannelName = `device-updates-${userId}-${Date.now()}`;
    this.deviceChannel = supabase
      .channel(deviceChannelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'devices'
        },
        () => {
          onDeviceChange();
        }
      )
      .subscribe();
  }

  setupActivitySubscription(userId: string, onActivityChange: () => void) {
    this.cleanupActivitySubscription();

    const activityChannelName = `activity-updates-${userId}-${Date.now()}`;
    this.activityChannel = supabase
      .channel(activityChannelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_logs'
        },
        () => {
          onActivityChange();
        }
      )
      .subscribe();
  }

  cleanupDeviceSubscription() {
    if (this.deviceChannel) {
      supabase.removeChannel(this.deviceChannel);
      this.deviceChannel = null;
    }
  }

  cleanupActivitySubscription() {
    if (this.activityChannel) {
      supabase.removeChannel(this.activityChannel);
      this.activityChannel = null;
    }
  }

  cleanupAll() {
    this.cleanupDeviceSubscription();
    this.cleanupActivitySubscription();
  }
}
