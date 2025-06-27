
import React from 'react';
import { Smartphone, Bell, Wifi, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGroupMembers } from "@/hooks/useGroupMembers";
import { useDeviceMonitoring } from "@/hooks/useDeviceMonitoring";

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
  
  // Filter devices to only show devices from current group members
  const filteredDevices = devices.filter(device => {
    if (!groupMembers || groupMembers.length === 0) return false;
    
    // Check if the device belongs to any group member
    return groupMembers.some(member => member.user_id === device.user_id);
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">Monitoring Device</h2>
          {isHeadOfFamily && (
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 font-semibold border-0">
              ✨ Kepala Keluarga
            </Badge>
          )}
        </div>
        <p className="opacity-90">Pantau aktivitas anggota grup keluarga</p>
        
        {selectedGroupId && (
          <div className="mt-4 flex items-center gap-2 text-sm opacity-80">
            <Users className="h-4 w-4" />
            <span>Grup: {groups.find(g => g.id === selectedGroupId)?.name || 'Unknown'}</span>
            <span>•</span>
            <span>{groupMembers?.length || 0} Anggota</span>
          </div>
        )}
      </div>

      {!selectedGroupId && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 text-blue-500 mx-auto mb-3" />
            <p className="text-blue-800 font-medium">Pilih grup terlebih dahulu</p>
            <p className="text-sm text-blue-600 mt-1">Monitoring akan menampilkan device dari anggota grup yang dipilih</p>
          </CardContent>
        </Card>
      )}

      {/* Device List */}
      <div className="space-y-4">
        {filteredDevices.length > 0 ? (
          filteredDevices.map((device) => (
            <Card key={device.id} className="shadow-lg border-2 hover:border-blue-200 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-lg">
                      <Smartphone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {device.profiles?.full_name || 'Unknown User'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {device.device_name}
                      </div>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full shadow-lg ${device.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-600 font-medium mb-1">Device:</p>
                    <p className="font-semibold text-gray-900">{device.device_name}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-600 font-medium mb-1">WiFi:</p>
                    <p className="font-semibold flex items-center gap-2 text-gray-900">
                      <Wifi className="h-4 w-4" />
                      {device.wifi_name || 'Unknown'}
                    </p>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-blue-800 font-medium text-sm mb-2">Aplikasi Saat Ini:</p>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-blue-700 border-blue-300 bg-white">
                      {device.current_app || 'Tidak diketahui'}
                    </Badge>
                    {device.status === 'online' && (
                      <Badge className="bg-green-500 text-white shadow-sm">
                        <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
                        Aktif
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  {isHeadOfFamily && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 transition-colors"
                      onClick={() => onSendNotification(`${device.profiles?.full_name || 'Unknown User'}, mohon perhatikan penggunaan device!`)}
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Kirim Notifikasi
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="shadow-lg">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">
                {selectedGroupId ? 'Belum ada device yang terpantau dari anggota grup ini' : 'Pilih grup untuk melihat device monitoring'}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {selectedGroupId ? 'Device akan muncul ketika anggota grup online' : 'Monitoring hanya menampilkan device dari anggota grup'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MonitoringView;
