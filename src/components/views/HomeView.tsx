
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
  
  // Get the first group's members to avoid conditional hook calls
  const firstGroupId = groups.length > 0 ? groups[0].id : null;
  const { members: firstGroupMembers } = useGroupMembers(firstGroupId);
  
  // For now, we'll use the first group's members as a sample
  // In a real implementation, you might want to get all group members differently
  const groupMemberIds = firstGroupMembers?.map(member => member.user_id) || [];
  
  // Filter activities to only show from group members
  const filteredActivities = activities.filter(activity => 
    groupMemberIds.includes(activity.user_id)
  );

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
            ✨ Kepala Keluarga
          </Badge>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-md transition-all">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-blue-700">{groups.length}</div>
            <div className="text-sm text-blue-600">Grup Aktif</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-md transition-all">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Monitor className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-green-700">{onlineDevices.length}</div>
            <div className="text-sm text-green-600">Device Online</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-md transition-all">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Smartphone className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-purple-700">{currentUserDevices.length}</div>
            <div className="text-sm text-purple-600">Device Saya</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-md transition-all">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-orange-700">{filteredActivities.length}</div>
            <div className="text-sm text-orange-600">Aktivitas Grup</div>
          </CardContent>
        </Card>
      </div>

      {/* Aktivitas Anggota Grup */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg">Aktivitas Anggota Grup</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {filteredActivities.length} aktivitas
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            {filteredActivities.length > 0 ? (
              filteredActivities.slice(0, 5).map((activity: any, index: number) => (
                <div key={activity.id || index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                    {activity.profiles?.full_name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 text-sm">
                        {activity.profiles?.full_name || 'Anggota Grup'}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {new Date(activity.timestamp || '').toLocaleString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Menggunakan <span className="font-medium text-blue-600">{activity.app_name}</span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Activity className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">Belum ada aktivitas anggota grup</p>
                <p className="text-xs text-gray-400 mt-1">Aktivitas akan muncul ketika anggota grup menggunakan aplikasi</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeView;
