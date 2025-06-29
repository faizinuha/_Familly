import { Badge } from '@/components/ui/badge';
import { ChevronDown, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ChatHeaderProps {
  selectedGroup: { id: string; name: string };
  memberCount: number;
  membersLoading: boolean;
  groups: { id: string; name: string }[];
  onSelectGroup: (groupId: string) => void;
}

export default function ChatHeader({
  selectedGroup,
  memberCount,
  membersLoading,
  groups,
  onSelectGroup,
}: ChatHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <div className="flex items-center gap-3 p-4 border-b bg-gradient-to-r from-white to-blue-50 shadow-sm relative">
      <div
        className="flex items-center gap-3 flex-1 relative"
        ref={dropdownRef}
      >
        {/* Dropdown trigger: avatar + nama + icon */}
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg font-bold min-w-[120px]"
          onClick={() => setDropdownOpen((v) => !v)}
        >
          <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
            {selectedGroup.name?.[0]?.toUpperCase() || 'G'}
          </span>
          <span className="truncate max-w-[100px]">
            {selectedGroup.name || 'Unnamed Group'}
          </span>
          <ChevronDown
            className={`ml-1 h-5 w-5 transition-transform ${
              dropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
        {/* Dropdown menu */}
        {dropdownOpen && (
          <div className="absolute left-0 top-14 z-30 bg-white border border-blue-100 rounded-xl shadow-2xl min-w-[220px] max-h-72 overflow-y-auto animate-fadeIn">
            {groups.map((g) => (
              <button
                key={g.id}
                className={`w-full flex items-center gap-2 px-4 py-3 text-base hover:bg-blue-50 transition-all text-gray-700 ${
                  g.id === selectedGroup.id
                    ? 'bg-blue-100 font-bold text-blue-700'
                    : ''
                }`}
                onClick={() => {
                  setDropdownOpen(false);
                  if (g.id !== selectedGroup.id) onSelectGroup(g.id);
                }}
              >
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                  {g.name?.[0]?.toUpperCase() || 'G'}
                </span>
                <span className="truncate">{g.name || 'Unnamed Group'}</span>
                {g.id === selectedGroup.id && (
                  <span className="ml-auto text-xs bg-blue-200 text-blue-700 rounded px-2 py-0.5">
                    Aktif
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
        <div className="ml-2">
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
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.18s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
