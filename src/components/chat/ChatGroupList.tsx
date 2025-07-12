
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
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 shadow-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari grup..."
            className="pl-10 bg-white/20 border-white/30 text-white placeholder-white/70 focus:bg-white/30 rounded-xl h-12"
          />
        </div>
      </div>

      {/* Group List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {filteredGroups.map((group) => (
          <Card
            key={group.id}
            className={`cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-0 shadow-sm bg-white ${
              lastOpenedGroupId === group.id ? 'ring-2 ring-blue-400 shadow-lg' : 'hover:shadow-md'
            }`}
            onClick={() => onSelectGroup(group.id)}
          >
            <CardHeader className="p-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">
                      {group.name?.[0]?.toUpperCase() || 'G'}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-base text-gray-900">
                      {group.name || 'Unnamed Group'}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>Ketuk untuk chat</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Badge variant="secondary" className="text-xs px-2 py-1 bg-blue-100 text-blue-700">
                    {group.memberCount
                      ? `${group.memberCount} anggota`
                      : 'Chat'}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
        
        {filteredGroups.length === 0 && (
          <div className="flex-1 flex items-center justify-center p-8">
            <EmptyState
              icon={Users}
              title={searchTerm ? "Grup tidak ditemukan" : "Belum ada grup untuk chat"}
              description={searchTerm ? `Tidak ada grup yang cocok dengan "${searchTerm}"` : "Buat atau join grup terlebih dahulu"}
            />
          </div>
        )}
      </div>
    </div>
  );
}
