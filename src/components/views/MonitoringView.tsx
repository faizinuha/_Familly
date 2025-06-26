
import React from 'react';
import { Smartphone, Bell, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MonitoringViewProps {
  devices: any[];
  isHeadOfFamily: boolean;
  onSendNotification: (message: string) => void;
}

const MonitoringView: React.FC<MonitoringViewProps> = ({
  devices,
  isHeadOfFamily,
  onSendNotification
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Monitoring Device</h2>
        {isHeadOfFamily && (
          <Badge className="bg-orange-500">Kepala Keluarga</Badge>
        )}
      </div>

      {/* Device List */}
      <div className="space-y-4">
        {devices.map((device) => (
          <Card key={device.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  {device.profile?.full_name || 'Unknown User'}
                </div>
                <div className={`w-3 h-3 rounded-full ${device.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Device:</p>
                  <p className="font-medium">{device.device_name}</p>
                </div>
                <div>
                  <p className="text-gray-600">WiFi:</p>
                  <p className="font-medium flex items-center gap-1">
                    <Wifi className="h-4 w-4" />
                    {device.wifi_name || 'Unknown'}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Aplikasi Saat Ini:</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-blue-600">
                    {device.current_app || 'Tidak diketahui'}
                  </Badge>
                  {device.status === 'online' && (
                    <Badge className="bg-green-500">Aktif</Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                {isHeadOfFamily && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onSendNotification(`${device.profile?.full_name || 'Unknown User'}, mohon perhatikan penggunaan device!`)}
                  >
                    <Bell className="h-4 w-4 mr-1" />
                    Kirim Notifikasi
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {devices.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Belum ada device yang terpantau</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonitoringView;
