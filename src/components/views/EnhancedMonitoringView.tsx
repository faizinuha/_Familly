
import React from 'react';
import { Monitor, Smartphone, Activity, Clock, Wifi, Battery } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEnhancedDeviceMonitoring } from "@/hooks/useEnhancedDeviceMonitoring";

const EnhancedMonitoringView: React.FC = () => {
  const { devices, activities, loading, deviceInfo } = useEnhancedDeviceMonitoring();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const onlineDevices = devices.filter(device => 
    device.status === 'online' && 
    new Date(device.last_seen || '') > new Date(Date.now() - 5 * 60 * 1000)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Monitoring Keluarga</h2>
        <p className="text-gray-600">Pantau aktivitas dan perangkat anggota keluarga</p>
      </div>

      {/* Current Device Info */}
      {deviceInfo && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Smartphone className="h-5 w-5" />
              Perangkat Saya
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Nama:</span> {deviceInfo.deviceName}
              </div>
              <div>
                <span className="font-medium">Platform:</span> {deviceInfo.platform}
              </div>
              <div>
                <span className="font-medium">Model:</span> {deviceInfo.model}
              </div>
              <div>
                <span className="font-medium">Koneksi:</span> 
                <Badge variant={deviceInfo.isConnected ? "default" : "destructive"} className="ml-1">
                  {deviceInfo.isConnected ? "Online" : "Offline"}
                </Badge>
              </div>
            </div>
            {deviceInfo.batteryLevel && (
              <div className="flex items-center gap-2">
                <Battery className="h-4 w-4" />
                <span className="text-sm">Baterai: {Math.round(deviceInfo.batteryLevel * 100)}%</span>
                {deviceInfo.isCharging && (
                  <Badge variant="outline" className="text-xs">Charging</Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Monitor className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{onlineDevices.length}</div>
            <div className="text-sm text-gray-600">Device Online</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Smartphone className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{devices.length}</div>
            <div className="text-sm text-gray-600">Total Perangkat</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{activities.length}</div>
            <div className="text-sm text-gray-600">Aktivitas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {activities.reduce((sum, act) => sum + (act.duration_minutes || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Total Menit</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Devices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Perangkat Aktif
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {onlineDevices.length > 0 ? (
              onlineDevices.map((device) => (
                <div key={device.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Smartphone className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">{device.device_name}</div>
                      <div className="text-sm text-gray-600">
                        {device.profiles?.full_name || 'Unknown User'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {device.current_app || 'Tidak ada aplikasi aktif'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="default" className="bg-green-500">
                      Online
                    </Badge>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(device.last_seen || '').toLocaleTimeString('id-ID')}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                Tidak ada perangkat yang online
              </div>
            )}
          </div>
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
        <CardContent>
          <div className="space-y-3">
            {activities.length > 0 ? (
              activities.slice(0, 10).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-700 font-bold text-xs">
                        {activity.profiles?.full_name?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">{activity.profiles?.full_name || 'Unknown'}</div>
                      <div className="text-sm text-gray-600">{activity.app_name}</div>
                      <div className="text-xs text-gray-500">
                        {activity.activity_type} • {activity.duration_minutes || 0} menit
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(activity.timestamp || '').toLocaleString('id-ID')}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                Belum ada aktivitas
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedMonitoringView;
