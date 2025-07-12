
import React from 'react';
import { ArrowLeft, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ChatHeaderProps {
  selectedGroup: {
    id: string;
    name: string;
  };
  memberCount: number;
  membersLoading: boolean;
  onBackClick: () => void;
  groups: any[];
  onSelectGroup: (groupId: string) => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  selectedGroup,
  memberCount,
  membersLoading,
  onBackClick,
  groups,
  onSelectGroup
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackClick}
          className="text-white hover:bg-white/20 p-2 rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-sm">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">{selectedGroup.name}</h2>
            <div className="flex items-center gap-2 text-sm opacity-90 mt-0.5">
              <Users className="h-3 w-3" />
              <span>
                {membersLoading ? 'Loading...' : `${memberCount} anggota`}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        className="text-white hover:bg-white/20 p-2 rounded-full"
      >
        <Settings className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ChatHeader;
