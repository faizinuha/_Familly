import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users } from 'lucide-react';

interface ChatHeaderProps {
  selectedGroup: { id: string; name: string };
  memberCount: number;
  membersLoading: boolean;
  onBackClick: () => void;
}

export default function ChatHeader({
  selectedGroup,
  memberCount,
  membersLoading,
  onBackClick,
}: ChatHeaderProps) {
  return (
    <div className="flex items-center gap-3 p-4 border-b bg-gradient-to-r from-white to-blue-50 shadow-sm">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          if (!membersLoading) onBackClick();
        }}
        className={`hover:bg-blue-100${membersLoading ? ' opacity-50 cursor-not-allowed' : ''}`}
        disabled={membersLoading}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div className="flex items-center gap-3 flex-1">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-sm">
            {selectedGroup.name?.[0]?.toUpperCase() || 'G'}
          </span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">
            {selectedGroup.name || 'Unnamed Group'}
          </h3>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Users className="h-3 w-3" />
            {membersLoading ? (
              <span>Memuat anggota...</span>
            ) : (
              <span>{memberCount} anggota</span>
            )}
          </div>
        </div>
      </div>
      <Badge
        variant="secondary"
        className="bg-blue-100 text-blue-700 border-blue-200"
      >
        {membersLoading ? '...' : `${memberCount} anggota`}
      </Badge>
    </div>
  );
}
