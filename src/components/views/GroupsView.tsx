
import React from 'react';
import { Plus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

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
  onSelectGroup
}) => {
  return (
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
                <Button onClick={onCreateGroup} className="w-full">
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
                <Button onClick={onJoinGroup} className="w-full">
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
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-700 font-bold text-lg">
                    {group.name[0]?.toUpperCase()}
                  </div>
                  {group.name}
                </div>
                <div className="flex items-center gap-2">
                  {group.head_of_family_id === user?.id && (
                    <Badge variant="secondary">Kepala Keluarga</Badge>
                  )}
                  {group.head_of_family_id === user?.id && (
                    <Button size="icon" variant="destructive" onClick={() => onDeleteGroup(group.id)}>
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </Button>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  {groupMembers && groupMembers.filter(m => m.group_id === group.id).map((member) => (
                    <div key={member.user_id} className="flex flex-col items-center">
                      <div className="h-7 w-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-blue-700">
                        {member.profile?.full_name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <span className="text-[10px] mt-1 text-gray-500 max-w-[40px] truncate">{member.profile?.full_name?.split(" ")[0]}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Kode Undangan:</span>
                  <Badge variant="outline" className="font-mono">
                    {group.invite_code}
                  </Badge>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onSelectGroup(group.id)}
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
};

export default GroupsView;
