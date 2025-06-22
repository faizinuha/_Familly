import { useState, useEffect } from "react";
import { Users, Home, MessageSquare, Settings, Monitor, Plus, Bell, Wifi, Smartphone, LogOut, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useFamilyGroups } from "@/hooks/useFamilyGroups";
import { useGroupMessages } from "@/hooks/useGroupMessages";
import { useDeviceMonitoring } from "@/hooks/useDeviceMonitoring";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [newMessage, setNewMessage] = useState("");
  
  const { user, signOut } = useAuth();
  const { profile, isHeadOfFamily } = useProfile();
  const { groups, createGroup, joinGroup } = useFamilyGroups();
  const { messages, sendMessage, sendSystemNotification } = useGroupMessages(selectedGroupId);
  const { devices, activities } = useDeviceMonitoring();
  const { toast } = useToast();

  // Auto-select first group
  useEffect(() => {
    if (groups.length > 0 && !selectedGroupId) {
      setSelectedGroupId(groups[0].id);
    }
  }, [groups, selectedGroupId]);

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    
    try {
      const group = await createGroup(newGroupName);
      if (group) {
        toast({
          title: "Berhasil!",
          description: `Grup "${newGroupName}" berhasil dibuat`,
        });
        setNewGroupName("");
        setSelectedGroupId(group.id);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal membuat grup",
        variant: "destructive"
      });
    }
  };

  const handleJoinGroup = async () => {
    if (!inviteCode.trim()) return;
    
    try {
      const group = await joinGroup(inviteCode);
      if (group) {
        toast({
          title: "Berhasil!",
          description: `Berhasil bergabung dengan grup "${group.name}"`,
        });
        setInviteCode("");
        setSelectedGroupId(group.id);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal bergabung ke grup",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      await sendMessage(newMessage);
      setNewMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengirim pesan",
        variant: "destructive"
      });
    }
  };

  const handleSendNotification = async (message: string) => {
    try {
      await sendSystemNotification(message);
      toast({
        title: "Notifikasi terkirim",
        description: message,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengirim notifikasi",
        variant: "destructive"
      });
    }
  };

  const renderHome = () => (
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
      <div className="grid grid-cols-2 gap-4">
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
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Aktivitas Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activities.slice(0, 5).map((activity, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm">{activity.profile?.full_name || 'Unknown'} menggunakan {activity.app_name}</p>
                <p className="text-xs text-gray-500">
                  {new Date(activity.timestamp).toLocaleString('id-ID')}
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

  const renderGroups = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Grup Keluarga</h2>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                <Plus className="h-4 w-4 mr-1" />
                Buat
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Buat Grup Baru</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="groupName">Nama Grup</Label>
                  <Input
                    id="groupName"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Keluarga Bahagia"
                  />
                </div>
                <Button onClick={handleCreateGroup} className="w-full">
                  Buat Grup
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <UserPlus className="h-4 w-4 mr-1" />
                Gabung
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Gabung ke Grup</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="inviteCode">Kode Undangan</Label>
                  <Input
                    id="inviteCode"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="Masukkan kode undangan"
                  />
                </div>
                <Button onClick={handleJoinGroup} className="w-full">
                  Gabung
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Groups List */}
      <div className="space-y-4">
        {groups.map((group) => (
          <Card key={group.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {group.name}
                </div>
                {group.head_of_family_id === user?.id && (
                  <Badge variant="secondary">Kepala Keluarga</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Kode Undangan:</span>
                  <Badge variant="outline" className="font-mono">
                    {group.invite_code}
                  </Badge>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedGroupId(group.id)}
                  className="w-full"
                >
                  Lihat Detail
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {groups.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Belum ada grup. Buat atau gabung ke grup untuk memulai!</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderMonitoring = () => (
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
                    onClick={() => handleSendNotification(`${device.profile?.full_name || 'Unknown User'}, mohon perhatikan penggunaan device!`)}
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

  const renderChat = () => {
    const selectedGroup = groups.find(g => g.id === selectedGroupId);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Chat Grup</h2>
          {selectedGroup && (
            <Badge variant="secondary">{selectedGroup.name}</Badge>
          )}
        </div>

        {selectedGroup ? (
          <Card className="h-96">
            <CardHeader>
              <CardTitle className="text-lg">{selectedGroup.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
              <div className="flex-1 space-y-3 mb-4 overflow-y-auto">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`p-3 rounded-lg ${
                      message.is_system_notification 
                        ? 'bg-yellow-50 border border-yellow-200' 
                        : message.sender_id === user?.id 
                          ? 'bg-blue-50 ml-8' 
                          : 'bg-gray-50'
                    }`}
                  >
                    <p className="text-sm font-medium">
                      {message.is_system_notification ? '🔔 Sistem' : message.sender?.full_name || 'Unknown'}
                    </p>
                    <p className="text-sm">{message.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(message.created_at).toLocaleString('id-ID')}
                    </p>
                  </div>
                ))}
                {messages.length === 0 && (
                  <p className="text-sm text-gray-500 text-center">Belum ada pesan</p>
                )}
              </div>
              <div className="border-t pt-3">
                <div className="flex gap-2">
                  <Input 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Ketik pesan..." 
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button size="sm" onClick={handleSendMessage}>
                    Kirim
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Pilih grup untuk mulai chat</p>
          </div>
        )}
      </div>
    );
  };

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
              <Label>Nama</Label>
              <p className="text-sm font-medium">{profile?.full_name}</p>
            </div>
            <div>
              <Label>Email</Label>
              <p className="text-sm font-medium">{user?.email}</p>
            </div>
            <div>
              <Label>Role</Label>
              <Badge className={isHeadOfFamily ? "bg-blue-500" : "bg-gray-500"}>
                {isHeadOfFamily ? "Kepala Keluarga" : "Anggota"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aksi</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              variant="destructive"
              onClick={signOut}
              className="w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Button>
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
