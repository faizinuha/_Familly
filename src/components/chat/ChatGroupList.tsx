import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import EmptyState from '@/components/ui/EmptyState';
import { Users } from 'lucide-react';

// ChatGroupList.tsx
// Komponen untuk menampilkan daftar grup chat
interface ChatGroupListProps {
  groups: any[];
  onSelectGroup: (groupId: string) => void;
  lastOpenedGroupId?: string | null;
}

// Komponen utama untuk menampilkan daftar grup chat

export default function ChatGroupList({
  groups,
  onSelectGroup,
  lastOpenedGroupId,
}: ChatGroupListProps) {
  // Handler untuk pin grup (dummy, bisa dihubungkan ke backend)
  const handlePinGroup = (groupId: string) => {
    alert('Fitur pin grup coming soon! (groupId: ' + groupId + ')');
  };
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-2">Chat Keluarga</h2>
        <p className="opacity-90">Pilih grup untuk memulai percakapan</p>
      </div>
      <div className="grid gap-4">
        {groups.map((group) => (
          <Card
            key={group.id}
            className={`cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-blue-200 ${
              lastOpenedGroupId === group.id ? 'ring-2 ring-blue-400' : ''
            }`}
            onClick={() => onSelectGroup(group.id)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {group.name?.[0]?.toUpperCase() || 'G'}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-lg">
                      {group.name || 'Unnamed Group'}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>Tap untuk mulai chat</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Users className="h-6 w-6 text-blue-500 mb-1" />
                  <Badge variant="secondary" className="text-xs">
                    {group.memberCount
                      ? `${group.memberCount} anggota`
                      : 'Chat'}
                  </Badge>
                  {/* Tombol titik tiga untuk pin */}
                  <button
                    className="mt-1 text-gray-400 hover:text-blue-600 text-xl px-1"
                    title="Pin Grup"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePinGroup(group.id);
                    }}
                  >
                    &#8942;
                  </button>
                </div>
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
      {groups.length === 0 && (
        <EmptyState
          icon={Users}
          title="Belum ada grup untuk chat"
          description="Buat atau join grup terlebih dahulu"
        />
      )}
    </div>
  );
}
