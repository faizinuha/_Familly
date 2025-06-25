
import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { Network } from '@capacitor/network';

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

export function useNativeDeviceInfo() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDeviceInfo = async () => {
      try {
        if (Capacitor.isNativePlatform()) {
          // Native platform - use Capacitor APIs
          const [deviceData, networkStatus] = await Promise.all([
            Device.getInfo(),
            Network.getStatus()
          ]);

          // Generate device ID from available data
          const deviceId = `${deviceData.platform}-${deviceData.model}-${Date.now()}`;

          const info: DeviceInfo = {
            deviceId,
            deviceName: deviceData.name || `${deviceData.platform} Device`,
            platform: deviceData.platform,
            osVersion: deviceData.osVersion,
            manufacturer: deviceData.manufacturer,
            model: deviceData.model,
            isVirtual: deviceData.isVirtual,
            webViewVersion: deviceData.webViewVersion,
            networkType: networkStatus.connectionType,
            isConnected: networkStatus.connected
          };

          // Try to get battery info if available
          try {
            const batteryInfo = await Device.getBatteryInfo();
            info.batteryLevel = batteryInfo.batteryLevel;
            info.isCharging = batteryInfo.isCharging;
          } catch (error) {
            console.log('Battery info not available:', error);
          }

          setDeviceInfo(info);
        } else {
          // Web platform - use browser APIs
          const userAgent = navigator.userAgent;
          const platform = navigator.platform;
          
          // Generate consistent device ID for web
          let deviceId = localStorage.getItem('device_id');
          if (!deviceId) {
            deviceId = `web-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('device_id', deviceId);
          }
          
          const info: DeviceInfo = {
            deviceId,
            deviceName: `${platform} Browser`,
            platform: 'web',
            osVersion: userAgent,
            manufacturer: 'Browser',
            model: getBrowserName(),
            isVirtual: false,
            webViewVersion: 'N/A',
            networkType: (navigator as any).connection?.effectiveType || 'unknown',
            isConnected: navigator.onLine
          };

          setDeviceInfo(info);
        }
      } catch (error) {
        console.error('Error getting device info:', error);
        
        // Fallback device info
        const fallback: DeviceInfo = {
          deviceId: 'unknown-device',
          deviceName: 'Unknown Device',
          platform: 'unknown',
          osVersion: 'unknown',
          manufacturer: 'unknown',
          model: 'unknown',
          isVirtual: false,
          webViewVersion: 'unknown',
          networkType: 'unknown',
          isConnected: navigator.onLine
        };
        
        setDeviceInfo(fallback);
      } finally {
        setLoading(false);
      }
    };

    getDeviceInfo();

    // Listen for network changes
    const handleNetworkChange = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          const networkStatus = await Network.getStatus();
          setDeviceInfo(prev => prev ? {
            ...prev,
            networkType: networkStatus.connectionType,
            isConnected: networkStatus.connected
          } : null);
        } catch (error) {
          console.error('Error updating network status:', error);
        }
      } else {
        setDeviceInfo(prev => prev ? {
          ...prev,
          isConnected: navigator.onLine
        } : null);
      }
    };

    if (Capacitor.isNativePlatform()) {
      Network.addListener('networkStatusChange', handleNetworkChange);
    } else {
      window.addEventListener('online', handleNetworkChange);
      window.addEventListener('offline', handleNetworkChange);
    }

    return () => {
      if (Capacitor.isNativePlatform()) {
        Network.removeAllListeners();
      } else {
        window.removeEventListener('online', handleNetworkChange);
        window.removeEventListener('offline', handleNetworkChange);
      }
    };
  }, []);

  const getBrowserName = (): string => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown Browser';
  };

  return {
    deviceInfo,
    loading,
    isNative: Capacitor.isNativePlatform()
  };
}
