
import React from 'react';
import { Users, Monitor, Bell, Smartphone, Sparkles, Activity, Calendar, Wifi } from "lucide-react";
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
  
  // Mengambil semua anggota dari semua grup
  const allGroupMembers = React.useMemo(() => {
    const allMembers: any[] = [];
    groups.forEach(group => {
      // Hook akan dipanggil untuk setiap grup, tapi kita perlu menggunakan conditional rendering
      // untuk menghindari hook call yang tidak konsisten
    });
    return allMembers;
  }, [groups]);

  // Menggunakan hook untuk grup pertama sebagai contoh, tapi kita akan mengambil data secara berbeda
  const [allMembers, setAllMembers] = React.useState<any[]>([]);
  const [totalOnlineDevices, setTotalOnlineDevices] = React.useState(0);
  const [totalActivities, setTotalActivities] = React.useState(0);

  React.useEffect(() => {
    const fetchAllGroupsData = async () => {
      if (!user?.id || groups.length === 0) return;

      try {
        // Ambil semua anggota dari semua grup
        const { data: allGroupMembers } = await import('@/integrations/supabase/client').then(
          ({ supabase }) =>
            supabase
              .from('group_members')
              .select(`
                user_id,
                group_id,
                profiles!inner(*)
              `)
              .in('group_id', groups.map(g => g.id))
        );

        setAllMembers(allGroupMembers || []);

        // Ambil semua device online dari grup
        const memberIds = (allGroupMembers || []).map(member => member.user_id);
        const { data: allDevices } = await import('@/integrations/supabase/client').then(
          ({ supabase }) =>
            supabase
              .from('devices')
              .select('*')
              .in('user_id', memberIds)
              .eq('status', 'online')
        );

        setTotalOnlineDevices(allDevices?.length || 0);

        // Ambil semua aktivitas dari grup
        const { data: allActivities } = await import('@/integrations/supabase/client').then(
          ({ supabase }) =>
            supabase
              .from('activity_logs')
              .select('*, profiles(*)')
              .in('user_id', memberIds)
              .order('timestamp', { ascending: false })
              .limit(10)
        );

        setTotalActivities(allActivities?.length || 0);
      } catch (error) {
        console.error('Error fetching groups data:', error);
      }
    };

    fetchAllGroupsData();
  }, [user?.id, groups]);

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
            <p className="opacity-90">Halo, {profile?.full_name || user?.email?.split('@')[0]} 👋</p>
          </div>
        </div>
        {isHeadOfFamily && (
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 font-semibold border-0">
            ✨ Kepala Keluarga
          </Badge>
        )}
      </div>

      {/* Stats Grid - Lebih Akurat */}
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
            <div className="text-2xl font-bold text-green-700">{totalOnlineDevices}</div>
            <div className="text-sm text-green-600">Device Online</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-md transition-all">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Smartphone className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-purple-700">{allMembers.length}</div>
            <div className="text-sm text-purple-600">Total Anggota</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-md transition-all">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-orange-700">{totalActivities}</div>
            <div className="text-sm text-orange-600">Aktivitas Terbaru</div>
          </CardContent>
        </Card>
      </div>

      {/* System Status - Lebih Detail */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Wifi className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg">Status System Real-time</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              Live
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <span className="text-green-700 font-medium">Device Online</span>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div className="text-2xl font-bold text-green-800">{totalOnlineDevices}</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-blue-700 font-medium">Anggota Aktif</span>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
              <div className="text-2xl font-bold text-blue-800">{allMembers.length}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            {groups.map((group, index) => (
              <div key={group.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {group.name[0]?.toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-700">{group.name}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  Aktif
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeView;
