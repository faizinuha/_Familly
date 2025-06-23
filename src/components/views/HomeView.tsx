
import React from 'react';
import { Users, Monitor, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface HomeViewProps {
  profile: any;
  user: any;
  isHeadOfFamily: boolean;
  groups: any[];
  devices: any[];
  activities: any[];
  onlineUsers: any[];
}

const HomeView: React.FC<HomeViewProps> = ({
  profile,
  user,
  isHeadOfFamily,
  groups,
  devices,
  activities,
  onlineUsers
}) => {
  return (
    <div className="space-y-6">
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
            <div className="text-2xl font-bold">{devices.filter(d => d.status === 'online').length}</div>
            <div className="text-sm text-gray-600">Device Online</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
            <div className="text-2xl font-bold">{onlineUsers.length}</div>
            <div className="text-sm text-gray-600">User Online</div>
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

      {/* Online Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            User Online ({onlineUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {onlineUsers.map((userStatus: any) => (
              <div key={userStatus.id} className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-full">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                  {userStatus.profile?.full_name?.[0]?.toUpperCase() || '?'}
                </div>
                <span className="text-sm font-medium">{userStatus.profile?.full_name || 'Unknown'}</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            ))}
            {onlineUsers.length === 0 && (
              <p className="text-sm text-gray-500">Tidak ada user online</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Aktivitas Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activities.slice(0, 5).map((activity: any, index: number) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                {activity.profile?.full_name?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.profile?.full_name || 'Unknown'}</p>
                <p className="text-sm text-gray-600">Menggunakan {activity.app_name}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <span>🕐</span>
                  {new Date(activity.timestamp || '').toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <p className="text-sm text-gray-500 text-center">Belum ada aktivitas</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeView;
