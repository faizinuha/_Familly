
import React from 'react';
import { Card } from '@/components/ui/card';

interface Member {
  id: string;
  user_id: string;
  profiles?: {
    full_name: string;
  };
}

interface MentionsListProps {
  members: Member[];
  onMentionSelect: (member: Member) => void;
  visible: boolean;
  searchTerm: string;
}

const MentionsList: React.FC<MentionsListProps> = ({
  members,
  onMentionSelect,
  visible,
  searchTerm
}) => {
  if (!visible || !members.length) return null;

  // Filter members based on search term
  const filteredMembers = members.filter(member => 
    member.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!filteredMembers.length) return null;

  return (
    <Card className="absolute bottom-full left-0 mb-2 w-full max-w-sm bg-white border shadow-lg z-50">
      <div className="max-h-48 overflow-y-auto">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            onClick={() => onMentionSelect(member)}
            className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-700">
                {member.profiles?.full_name?.[0]?.toUpperCase() || '?'}
              </div>
              <span className="text-sm font-medium">
                {member.profiles?.full_name || 'Unknown'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default MentionsList;
