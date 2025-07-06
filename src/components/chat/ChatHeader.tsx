
import { ArrowLeft, MoreVertical, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSocketConnection } from '@/hooks/useSocketConnection';
import { useGroupMembers } from '@/hooks/useGroupMembers';

interface ChatHeaderProps {
  selectedGroup: { id: string; name: string };
  memberCount: number;
  membersLoading: boolean;
  onBackClick: () => void;
  groups: any[];
  onSelectGroup: (groupId: string | null) => void;
}

export default function ChatHeader({
  selectedGroup,
  memberCount,
  membersLoading,
  onBackClick,
}: ChatHeaderProps) {
  const { members } = useGroupMembers(selectedGroup.id);
  const { getGroupOnlineStatus } = useSocketConnection();
  
  const onlineStatus = getGroupOnlineStatus(members || []);

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackClick}
            className="p-2 h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">
                {selectedGroup.name?.[0]?.toUpperCase() || 'G'}
              </span>
            </div>
            
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white text-base">
                {selectedGroup.name}
              </h2>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Users className="h-3 w-3" />
                <span>{memberCount} anggota</span>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-green-100 text-green-800">
                    {onlineStatus.online} online
                  </Badge>
                  <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600">
                    {onlineStatus.offline} offline
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Button variant="ghost" size="sm" className="p-2 h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
