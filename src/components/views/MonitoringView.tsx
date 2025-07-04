import React from 'react';
import { Smartphone, Bell, Wifi, Users, Activity, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGroupMembers } from "@/hooks/useGroupMembers";

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
  groups,
  selectedGroupId
}) => {
  const { members: groupMembers } = useGroupMembers(selectedGroupId);
  
  // Filter devices to only show unique devices from current group members
  const filteredDevices = React.useMemo(() => {
    if (!groupMembers || groupMembers.length === 0) return [];
    
    // Get unique devices by device_name and user_id combination
    const uniqueDevices = new Map();
    
    devices.forEach(device => {
      const isMember = groupMembers.some(member => member.user_id === device.user_id);
      if (isMember) {
        const key = `${device.user_id}_${device.device_name}`;
        const existing = uniqueDevices.get(key);
        
        // Keep the most recent device entry
        if (!existing || new Date(device.last_seen || '') > new Date(existing.last_seen || '')) {
          uniqueDevices.set(key, device);
        }
      }
    });
    
    return Array.from(uniqueDevices.values());
  }, [devices, groupMembers]);

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
        <p className="opacity-90 mb-4">Pantau device anggota grup secara real-time</p>
        
        {selectedGroupId && (
          <div className="flex items-center gap-4 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Grup: {groups.find(g => g.id === selectedGroupId)?.name || 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <span>{filteredDevices.length} Device Aktif</span>
            </div>
          </div>
        )}
      </div>

      {!selectedGroupId && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 text-blue-500 mx-auto mb-3" />
            <p className="text-blue-800 font-medium">Pilih grup untuk monitoring</p>
            <p className="text-sm text-blue-600 mt-1">Device monitoring akan menampilkan perangkat dari anggota grup yang dipilih</p>
          </CardContent>
        </Card>
      )}

      {/* Device List */}
      <div className="space-y-4">
        {filteredDevices.length > 0 ? (
          filteredDevices.map((device) => {
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
                {selectedGroupId ? 'Belum Ada Device Terpantau' : 'Pilih Grup untuk Monitoring'}
              </h3>
              <p className="text-gray-500">
                {selectedGroupId ? 'Device akan muncul ketika anggota grup online' : 'Monitoring menampilkan device dari anggota grup'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MonitoringView;
