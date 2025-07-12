
import React from 'react';
import { Badge } from "@/components/ui/badge";

const Header: React.FC = () => {
  return (
    <div className="bg-white shadow-sm border-b shrink-0 safe-area-top">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-blue-600">Good Family</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
              Online
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
