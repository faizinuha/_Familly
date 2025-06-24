
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Calendar, User } from "lucide-react";
import { useGroupMembers } from "@/hooks/useGroupMembers";
import AddContactDialog from "./AddContactDialog";

interface ContactSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGroup: any;
}

const ContactSidebar: React.FC<ContactSidebarProps> = ({
  isOpen,
  onClose,
  selectedGroup
}) => {
  const { members, refreshMembers } = useGroupMembers(selectedGroup?.id);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-80 bg-white border-r shadow-lg md:relative md:z-auto">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">Kontak Grup</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto h-full">
        {selectedGroup && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Info Grup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-medium">{selectedGroup.name}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Dibuat: {new Date(selectedGroup.created_at).toLocaleDateString('id-ID')}
                </p>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <AddContactDialog 
                groupId={selectedGroup.id} 
                onContactAdded={refreshMembers}
              />
            </div>
          </>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Anggota ({members?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {members?.map((member: any) => (
              <div key={member.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                  {member.profiles?.full_name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{member.profiles?.full_name || 'Pengguna'}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Bergabung: {new Date(member.joined_at).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
            )) || (
              <p className="text-sm text-gray-500 text-center">Tidak ada anggota</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactSidebar;
