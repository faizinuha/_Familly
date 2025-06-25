
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, Smartphone, Wifi, Battery, Clock, Activity } from "lucide-react";
import { useEnhancedDeviceMonitoring } from "@/hooks/useEnhancedDeviceMonitoring";

const EnhancedMonitoringView: React.FC = () => {
  const { 
    devices, 
    activities, 
    loading, 
    deviceInfo, 
    getOnlineDevices,
    getCurrentUserDevices 
  } = useEnhancedDeviceMonitoring();

  const onlineDevices = getOnlineDevices();
  const currentUserDevices = getCurrentUserDevices();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-500">Memuat data monitoring...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Device Info */}
      {deviceInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Perangkat Saat Ini
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Nama Perangkat</p>
                <p className="text-sm text-gray-600">{deviceInfo.deviceName}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Platform</p>
                <p className="text-sm text-gray-600">{deviceInfo.platform}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Model</p>
                <p className="text-sm text-gray-600">{deviceInfo.model}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Koneksi</p>
                <div className="flex items-center gap-2">
                  <Wifi className={`h-4 w-4 ${deviceInfo.isConnected ? 'text-green-500' : 'text-red-500'}`} />
                  <span className="text-sm text-gray-600">
                    {deviceInfo.isConnected ? 'Terhubung' : 'Tidak Terhubung'}
                  </span>
                </div>
              </div>
            </div>
            
            {deviceInfo.batteryLevel !== undefined && (
              <div className="flex items-center gap-2">
                <Battery className={`h-4 w-4 ${deviceInfo.isCharging ? 'text-green-500' : 'text-gray-500'}`} />
                <span className="text-sm text-gray-600">
                  Baterai: {Math.round(deviceInfo.batteryLevel * 100)}%
                  {deviceInfo.isCharging && ' (Charging)'}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Monitor className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{devices.length}</div>
            <div className="text-sm text-gray-600">Total Perangkat</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Wifi className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{onlineDevices.length}</div>
            <div className="text-sm text-gray-600">Online</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Smartphone className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{currentUserDevices.length}</div>
            <div className="text-sm text-gray-600">Perangkat Saya</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{activities.length}</div>
            <div className="text-sm text-gray-600">Aktivitas</div>
          </CardContent>
        </Card>
      </div>

      {/* Devices List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Semua Perangkat
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {devices.length > 0 ? (
            devices.map((device) => {
              const isOnline = device.status === 'online' && 
                new Date(device.last_seen || '') > new Date(Date.now() - 5 * 60 * 1000);
              
              return (
                <div key={device.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <div>
                      <p className="font-medium">{device.device_name}</p>
                      <p className="text-sm text-gray-600">
                        {device.profiles?.full_name || 'Unknown User'} • {device.device_type}
                      </p>
                      {device.current_app && (
                        <p className="text-xs text-gray-500">Menggunakan: {device.current_app}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={isOnline ? "default" : "secondary"}>
                      {isOnline ? 'Online' : 'Offline'}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {new Date(device.last_seen || '').toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 py-4">Belum ada perangkat terdaftar</p>
          )}
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Aktivitas Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activities.length > 0 ? (
            activities.slice(0, 10).map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                  {activity.profiles?.full_name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.profiles?.full_name || 'Unknown User'}</p>
                  <p className="text-sm text-gray-600">{activity.app_name} - {activity.activity_type}</p>
                  {activity.duration_minutes && (
                    <p className="text-xs text-gray-500">Durasi: {activity.duration_minutes} menit</p>
                  )}
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(activity.timestamp || '').toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">Belum ada aktivitas</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedMonitoringView;
