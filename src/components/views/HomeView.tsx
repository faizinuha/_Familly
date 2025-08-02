
import React from 'react';
import { Users, Monitor, Bell, Smartphone, Sparkles, Activity, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEnhancedDeviceMonitoring } from "@/hooks/useEnhancedDeviceMonitoring";
import { useGroupMembers } from "@/hooks/useGroupMembers";

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
  
  // Get all group members from all groups
  const allGroupIds = groups.map(group => group.id);
  const { members: allGroupMembers } = useGroupMembers(allGroupIds[0]); // Using first group for now
  
  // Get real data instead of dummy data
  const groupMemberIds = allGroupMembers?.map(member => member.user_id) || [user?.id].filter(Boolean);
  
  // Filter activities to show real user activities
  const recentActivities = activities
    .filter(activity => groupMemberIds.includes(activity.user_id))
    .slice(0, 5); // Show only 5 most recent

  const onlineDevices = getOnlineDevices();
  const currentUserDevices = getCurrentUserDevices();

  return (
    <div className="space-y-6 pb-4">
      {/* Header Welcome */}
      <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Good Family</h1>
            <p className="opacity-90">Halo, {profile?.full_name || user?.email} 👋</p>
          </div>
        </div>
        {isHeadOfFamily && (
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 font-semibold border-0">
            ✨ Ketua
          </Badge>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800 hover:shadow-md transition-all">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{groups.length}</div>
            <div className="text-sm text-blue-600 dark:text-blue-400">Grup Aktif</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800 hover:shadow-md transition-all">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Monitor className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">{onlineDevices.length}</div>
            <div className="text-sm text-green-600 dark:text-green-400">Device Online</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800 hover:shadow-md transition-all">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Smartphone className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{currentUserDevices.length}</div>
            <div className="text-sm text-purple-600 dark:text-purple-400">Device Saya</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800 hover:shadow-md transition-all">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">{recentActivities.length}</div>
            <div className="text-sm text-orange-600 dark:text-orange-400">Aktivitas Terbaru</div>
          </CardContent>
        </Card>
      </div>

      {/* Aktivitas Anggota Grup */}
      <Card className="shadow-lg dark:bg-gray-800">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-t-lg pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg dark:text-white">Aktivitas Anggota Grup</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {recentActivities.length} aktivitas
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity: any, index: number) => (
                <div key={activity.id || index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                    {activity.profiles?.full_name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {activity.profiles?.full_name || 'Anggota Grup'}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3 w-3" />
                        {new Date(activity.timestamp || '').toLocaleString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Menggunakan <span className="font-medium text-blue-600 dark:text-blue-400">{activity.app_name}</span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Activity className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Belum ada aktivitas terbaru</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Aktivitas akan muncul saat ada interaksi dengan aplikasi</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeView;
