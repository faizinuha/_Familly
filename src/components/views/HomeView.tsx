
import React from 'react';
import { Users, Monitor, Bell, Smartphone, Sparkles, Activity } from "lucide-react";
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
      {/* Modern Header Welcome */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white p-8 rounded-2xl shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Selamat Datang di Good Family!</h1>
              <p className="opacity-90 text-indigo-100">Halo, {profile?.full_name || user?.email} 👋</p>
            </div>
          </div>
          {isHeadOfFamily && (
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 font-semibold border-0 shadow-lg">
              ✨ Kepala Keluarga
            </Badge>
          )}
        </div>
        <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-blue-700 mb-1">{groups.length}</div>
            <div className="text-sm font-medium text-blue-600">Grup Keluarga</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Monitor className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-emerald-700 mb-1">{onlineDevices.length}</div>
            <div className="text-sm font-medium text-emerald-600">Device Online</div>
            <div className="text-xs text-emerald-500 mt-1">Semua keluarga</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-violet-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-purple-700 mb-1">{currentUserDevices.length}</div>
            <div className="text-sm font-medium text-purple-600">Perangkat Saya</div>
            <div className="text-xs text-purple-500 mt-1">Milik Anda</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-orange-700 mb-1">{activities.length}</div>
            <div className="text-sm font-medium text-orange-600">Aktivitas</div>
          </CardContent>
        </Card>
      </div>

      {/* Info Card with Modern Design */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-white text-sm font-bold">💡</span>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2 text-lg">Perbedaan Device Online & Perangkat Saya</h4>
              <div className="space-y-2 text-sm text-blue-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span><strong>Device Online:</strong> Total semua perangkat keluarga yang sedang aktif/online</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span><strong>Perangkat Saya:</strong> Hanya perangkat yang terdaftar atas nama Anda</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modern Activities Section */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-100 rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-gray-800">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl">Aktivitas Terbaru</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.slice(0, 5).map((activity: any, index: number) => (
                <div key={activity.id || index} className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0">
                    {activity.profiles?.full_name?.[0]?.toUpperCase() || activity.user_id?.slice(0, 1)?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 mb-1">{activity.profiles?.full_name || 'Pengguna'}</p>
                    <p className="text-sm text-gray-600 mb-2">Menggunakan {activity.app_name}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      {new Date(activity.timestamp || '').toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">Belum ada aktivitas</p>
                <p className="text-sm text-gray-400 mt-1">Aktivitas keluarga akan muncul di sini</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeView;
