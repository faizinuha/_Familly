
import React from 'react';
import { Smartphone, Bell, Wifi, Users, Activity, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MonitoringViewProps {
  devices: any[];
  isHeadOfFamily: boolean;
  onSendNotification: (message: string) => void;
  groups: any[];
  selectedGroupId: string | null;
}

const MonitoringView: React.FC<MonitoringViewProps> = ({
  devices,
  isHeadOfFamily,
  onSendNotification,
  groups
}) => {
  const [allDevices, setAllDevices] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAllDevices = async () => {
      if (groups.length === 0) {
        setLoading(false);
        return;
      }

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

        if (allGroupMembers) {
          const memberIds = allGroupMembers.map(member => member.user_id);
          
          // Ambil semua device dari anggota grup
          const { data: allDevicesData } = await import('@/integrations/supabase/client').then(
            ({ supabase }) =>
              supabase
                .from('devices')
                .select(`
                  *,
                  profiles!inner(*)
                `)
                .in('user_id', memberIds)
                .order('last_seen', { ascending: false })
          );

          // Filter unique devices dan tambah info grup
          const uniqueDevices = new Map();
          (allDevicesData || []).forEach(device => {
            const key = `${device.user_id}_${device.device_name}`;
            const existing = uniqueDevices.get(key);
            
            if (!existing || new Date(device.last_seen || '') > new Date(existing.last_seen || '')) {
              // Tambah info grup untuk device ini
              const userGroups = groups.filter(group => 
                allGroupMembers.some(member => 
                  member.user_id === device.user_id && member.group_id === group.id
                )
              );
              uniqueDevices.set(key, { ...device, userGroups });
            }
          });

          setAllDevices(Array.from(uniqueDevices.values()));
        }
      } catch (error) {
        console.error('Error fetching devices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDevices();
  }, [groups]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold mb-2">Monitoring Device</h2>
          <p className="opacity-90">Memuat data device...</p>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">Monitoring Device</h2>
          {isHeadOfFamily && (
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 font-semibold border-0">
              ✨ Kepala Keluarga
            </Badge>
          )}
        </div>
        <p className="opacity-90 mb-4">Pantau semua device anggota grup secara real-time</p>
        
        <div className="flex items-center gap-4 text-sm opacity-90">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{groups.length} Grup Aktif</span>
          </div>
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            <span>{allDevices.length} Device Terpantau</span>
          </div>
        </div>
      </div>

      {/* Device List dari Semua Grup */}
      <div className="space-y-4">
        {allDevices.length > 0 ? (
          allDevices.map((device) => {
            const isOnline = device.status === 'online' && 
              new Date(device.last_seen || '') > new Date(Date.now() - 5 * 60 * 1000);
            
            return (
              <Card key={`${device.user_id}_${device.device_name}`} className="shadow-lg border-2 hover:border-blue-200 transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-lg">
                        <Smartphone className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {device.profiles?.full_name || 'Unknown User'}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <span>{device.device_name}</span>
                          <Badge variant={isOnline ? "default" : "secondary"} className="text-xs">
                            {isOnline ? "Online" : "Offline"}
                          </Badge>
                        </div>
                        {/* Tampilkan grup tempat user ini berada */}
                        <div className="flex gap-1 mt-1">
                          {device.userGroups?.map((group: any) => (
                            <Badge key={group.id} variant="outline" className="text-xs">
                              {group.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-4 space-y-4">
                  {/* Device Info */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-600 font-medium mb-1">Aplikasi Aktif:</p>
                      <p className="font-semibold text-gray-900">{device.current_app || 'Tidak diketahui'}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-600 font-medium mb-1">Terakhir Dilihat:</p>
                      <p className="font-semibold text-gray-900 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(device.last_seen || '').toLocaleString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {device.wifi_name && (
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2">
                        <Wifi className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">WiFi: {device.wifi_name}</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {isHeadOfFamily && (
                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        className="w-full hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 transition-colors"
                        onClick={() => onSendNotification(`${device.profiles?.full_name || 'Anggota keluarga'}, perhatikan penggunaan device Anda!`)}
                      >
                        <Bell className="h-4 w-4 mr-2" />
                        Kirim Peringatan
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="shadow-lg">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-lg text-gray-700 mb-2">
                Belum Ada Device Terpantau
              </h3>
              <p className="text-gray-500">
                Device akan muncul ketika anggota grup online dan menggunakan aplikasi
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MonitoringView;
