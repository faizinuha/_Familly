
import React from 'react';
import { Users, Monitor, Bell, Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEnhancedDeviceMonitoring } from "@/hooks/useEnhancedDeviceMonitoring";

interface HomeViewProps {
  profile: any;
  user: any;
  isHeadOfFamily: boolean;
  groups: any[];
}

const HomeView: React.FC<HomeViewProps> = ({
  profile,
  user,
  isHeadOfFamily,
  groups
}) => {
  const { getOnlineDevices, activities, getCurrentUserDevices } = useEnhancedDeviceMonitoring();
  
  const onlineDevices = getOnlineDevices();
  const currentUserDevices = getCurrentUserDevices();

  return (
    <div className="space-y-6 pb-4">
      {/* Header Welcome */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Selamat Datang di Good Family! 👨‍👩‍👧‍👦</h1>
        <p className="opacity-90">Halo {profile?.full_name || user?.email}</p>
        {isHeadOfFamily && (
          <Badge className="mt-2 bg-yellow-500">Kepala Keluarga</Badge>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{groups.length}</div>
            <div className="text-sm text-gray-600">Grup Keluarga</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Monitor className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{onlineDevices.length}</div>
            <div className="text-sm text-gray-600">Device Online</div>
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
            <Bell className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{activities.length}</div>
            <div className="text-sm text-gray-600">Aktivitas</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Aktivitas Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activities.length > 0 ? (
            activities.slice(0, 5).map((activity: any, index: number) => (
              <div key={activity.id || index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                  {activity.profiles?.full_name?.[0]?.toUpperCase() || activity.user_id?.slice(0, 1)?.toUpperCase() || '?'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.profiles?.full_name || 'Pengguna'}</p>
                  <p className="text-sm text-gray-600">Menggunakan {activity.app_name}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <span>🕐</span>
                    {new Date(activity.timestamp || '').toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center">Belum ada aktivitas</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeView;
