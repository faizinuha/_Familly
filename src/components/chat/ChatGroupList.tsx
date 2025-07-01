
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import EmptyState from '@/components/ui/EmptyState';
import { Users, Search } from 'lucide-react';
import { useState } from 'react';

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
  const [searchTerm, setSearchTerm] = useState('');

  // Filter groups berdasarkan pencarian
  const filteredGroups = groups.filter(group =>
    group.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handler untuk pin grup (dummy, bisa dihubungkan ke backend)
  const handlePinGroup = (groupId: string) => {
    alert('Fitur pin grup coming soon! (groupId: ' + groupId + ')');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari grup..."
            className="pl-10 bg-white/20 border-white/30 text-white placeholder-white/70 focus:bg-white/30"
          />
        </div>
      </div>

      {/* Group List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filteredGroups.map((group) => (
          <Card
            key={group.id}
            className={`cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 hover:shadow-md hover:scale-[1.02] border hover:border-blue-200 ${
              lastOpenedGroupId === group.id ? 'ring-2 ring-blue-400' : ''
            }`}
            onClick={() => onSelectGroup(group.id)}
          >
            <CardHeader className="p-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">
                      {group.name?.[0]?.toUpperCase() || 'G'}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-base">
                      {group.name || 'Unnamed Group'}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>Tap untuk chat</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Badge variant="secondary" className="text-xs px-2 py-1">
                    {group.memberCount
                      ? `${group.memberCount} anggota`
                      : 'Chat'}
                  </Badge>
                  {/* Tombol titik tiga untuk pin */}
                  <button
                    className="text-gray-400 hover:text-blue-600 text-lg px-1"
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
        
        {filteredGroups.length === 0 && (
          <EmptyState
            icon={Users}
            title={searchTerm ? "Grup tidak ditemukan" : "Belum ada grup untuk chat"}
            description={searchTerm ? `Tidak ada grup yang cocok dengan "${searchTerm}"` : "Buat atau join grup terlebih dahulu"}
          />
        )}
      </div>
    </div>
  );
}
