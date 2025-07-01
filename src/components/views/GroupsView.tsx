
import React from 'react';
import { Plus, UserPlus, Settings, LogOut, Users, Calendar, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface GroupsViewProps {
  groups: any[];
  user: any;
  groupMembers: any[];
  newGroupName: string;
  setNewGroupName: (name: string) => void;
  inviteCode: string;
  setInviteCode: (code: string) => void;
  onCreateGroup: () => void;
  onJoinGroup: () => void;
  onDeleteGroup: (groupId: string) => void;
  onSelectGroup: (groupId: string) => void;
  onLeaveGroup: (groupId: string) => void;
}

const GroupsView: React.FC<GroupsViewProps> = ({
  groups,
  user,
  groupMembers,
  newGroupName,
  setNewGroupName,
  inviteCode,
  setInviteCode,
  onCreateGroup,
  onJoinGroup,
  onDeleteGroup,
  onSelectGroup,
  onLeaveGroup
}) => {
  const { toast } = useToast();

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Tersalin!",
      description: "Kode undangan telah disalin ke clipboard",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header dengan tombol aksi */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-3">Grup Keluarga</h2>
        <p className="opacity-90 mb-4">Kelola grup keluarga Anda dengan mudah</p>
        
        <div className="flex gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0 flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Buat Grup
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
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
                    className="mt-2"
                  />
                </div>
                <Button onClick={onCreateGroup} className="w-full">
                  Buat Grup
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 flex-1">
                <UserPlus className="h-4 w-4 mr-2" />
                Gabung
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
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
                    className="mt-2"
                  />
                </div>
                <Button onClick={onJoinGroup} className="w-full">
                  Gabung Grup
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Daftar Grup */}
      <div className="space-y-4">
        {groups.map((group) => {
          const isHeadOfFamily = group.head_of_family_id === user?.id;
          const members = groupMembers?.filter(m => m.group_id === group.id) || [];
          
          return (
            <Card key={group.id} className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">
                        {group.name[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{group.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {isHeadOfFamily && (
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 text-xs">
                            ✨ Kepala Keluarga
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          {members.length} anggota
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {isHeadOfFamily && (
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => onDeleteGroup(group.id)}
                      className="h-8 w-8 p-0"
                    >
                      ×
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-4 space-y-4">
                {/* Info Grup */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-600 font-medium mb-1">Dibuat:</p>
                    <p className="font-semibold flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(group.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-blue-600 font-medium mb-1">Kode Undangan:</p>
                    <div className="flex items-center gap-2">
                      <code className="font-mono font-bold text-blue-800">{group.invite_code}</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyInviteCode(group.invite_code)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Anggota Grup */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-600 font-medium mb-2">Anggota Grup:</p>
                  <div className="flex flex-wrap gap-2">
                    {members.map((member) => (
                      <div key={member.user_id} className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                          {member.profiles?.full_name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <span className="text-sm font-medium">
                          {member.profiles?.full_name || 'Unknown'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tombol Aksi */}
                <div className="flex gap-2 pt-2">
                  {isHeadOfFamily ? (
                    <Button 
                      onClick={() => onSelectGroup(group.id)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Kelola Grup
                    </Button>
                  ) : (
                    <Button 
                      variant="outline"
                      onClick={() => onLeaveGroup(group.id)}
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Keluar Grup
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {groups.length === 0 && (
          <Card className="shadow-lg">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-lg text-gray-700 mb-2">Belum Ada Grup</h3>
              <p className="text-gray-500 mb-4">Buat grup baru atau gabung dengan grup yang sudah ada</p>
              <div className="flex gap-2 justify-center">
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Grup
                </Button>
                <Button variant="outline">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Gabung Grup
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GroupsView;
