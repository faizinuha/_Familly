
import { useState } from "react";
import { Users, Home, MessageSquare, Settings, Monitor, Plus, Bell, Wifi, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");

  // Mock data untuk demo
  const familyMembers = [
    { 
      name: "Riska", 
      device: "Redmi 8A", 
      wifi: "TYZ", 
      activity: "Chrome (Instagram)", 
      status: "online",
      lastSeen: "Sekarang"
    },
    { 
      name: "Ahmad", 
      device: "Samsung A32", 
      wifi: "TYZ", 
      activity: "YouTube", 
      status: "online",
      lastSeen: "2 menit lalu"
    },
    { 
      name: "Siti", 
      device: "iPhone 12", 
      wifi: "TYZ", 
      activity: "WhatsApp", 
      status: "offline",
      lastSeen: "1 jam lalu"
    }
  ];

  const notifications = [
    { type: "activity", message: "Riska sedang menggunakan Instagram", time: "Baru saja" },
    { type: "join", message: "Ahmad bergabung ke grup keluarga", time: "5 menit lalu" },
    { type: "alert", message: "Siti tidak aktif selama 1 jam", time: "1 jam lalu" }
  ];

  const renderHome = () => (
    <div className="space-y-6">
      {/* Header Welcome */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Selamat Datang di Good Family! 👨‍👩‍👧‍👦</h1>
        <p className="opacity-90">Pantau dan jaga keluarga Anda dengan mudah</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{familyMembers.length}</div>
            <div className="text-sm text-gray-600">Anggota Keluarga</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Monitor className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{familyMembers.filter(m => m.status === 'online').length}</div>
            <div className="text-sm text-gray-600">Sedang Online</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifikasi Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {notifications.map((notif, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm">{notif.message}</p>
                <p className="text-xs text-gray-500">{notif.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderGroups = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Grup Keluarga</h2>
        <Button className="bg-blue-500 hover:bg-blue-600">
          <Plus className="h-4 w-4 mr-2" />
          Buat Grup Baru
        </Button>
      </div>

      {/* Main Family Group */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Keluarga Utama
            </div>
            <Badge variant="secondary">Kepala Keluarga</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Anggota Keluarga:</p>
            {familyMembers.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${member.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.lastSeen}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Monitor</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMonitoring = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Monitoring Keluarga</h2>
        <Badge className="bg-orange-500">Kepala Keluarga</Badge>
      </div>

      {/* Device Monitoring */}
      <div className="space-y-4">
        {familyMembers.map((member, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  {member.name}
                </div>
                <div className={`w-3 h-3 rounded-full ${member.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Device:</p>
                  <p className="font-medium">{member.device}</p>
                </div>
                <div>
                  <p className="text-gray-600">WiFi:</p>
                  <p className="font-medium flex items-center gap-1">
                    <Wifi className="h-4 w-4" />
                    {member.wifi}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Aktivitas Saat Ini:</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-blue-600">
                    {member.activity}
                  </Badge>
                  {member.status === 'online' && (
                    <Badge className="bg-green-500">Aktif</Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-1" />
                  Kirim Notifikasi
                </Button>
                <Button variant="outline" size="sm">Detail</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Chat Keluarga</h2>
        <Badge variant="secondary">3 Online</Badge>
      </div>

      <Card className="h-96">
        <CardHeader>
          <CardTitle className="text-lg">Grup Keluarga Utama</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-full">
          <div className="flex-1 space-y-3 mb-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm font-medium">Ahmad</p>
              <p className="text-sm">Halo semua! Hari ini bagaimana?</p>
              <p className="text-xs text-gray-500">10:30</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg ml-8">
              <p className="text-sm font-medium">Saya</p>
              <p className="text-sm">Alhamdulillah baik. @Riska sudah makan siang?</p>
              <p className="text-xs text-gray-500">10:32</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-sm font-medium">Riska</p>
              <p className="text-sm">Sudah ayah! Terima kasih 😊</p>
              <p className="text-xs text-gray-500">10:35</p>
            </div>
          </div>
          <div className="border-t pt-3">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Ketik pesan..." 
                className="flex-1 border rounded-lg px-3 py-2 text-sm"
              />
              <Button size="sm">Kirim</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Pengaturan</h2>
      
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Profil Pengguna</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nama</label>
              <input type="text" defaultValue="Kepala Keluarga" className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <Badge className="bg-blue-500">Kepala Keluarga</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Monitoring</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Notifikasi Real-time</span>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Monitoring Aktivitas</span>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Alert Offline</span>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-blue-600">Good Family</h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                Online
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {activeTab === "home" && renderHome()}
        {activeTab === "groups" && renderGroups()}
        {activeTab === "monitoring" && renderMonitoring()}
        {activeTab === "chat" && renderChat()}
        {activeTab === "settings" && renderSettings()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-around py-2">
            {[
              { id: "home", icon: Home, label: "Home" },
              { id: "groups", icon: Users, label: "Grup" },
              { id: "monitoring", icon: Monitor, label: "Monitor" },
              { id: "chat", icon: MessageSquare, label: "Chat" },
              { id: "settings", icon: Settings, label: "Setting" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  activeTab === tab.id 
                    ? "text-blue-600 bg-blue-50" 
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                <tab.icon className="h-5 w-5 mb-1" />
                <span className="text-xs">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Spacing for bottom nav */}
      <div className="h-20"></div>
    </div>
  );
};

export default Index;
