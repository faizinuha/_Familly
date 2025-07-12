
import React from 'react';
import { Home, Users, Monitor, MessageSquare, Settings } from "lucide-react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isHeadOfFamily: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, isHeadOfFamily }) => {
  const tabs = [
    { id: "home", icon: Home, label: "Home" },
    { id: "groups", icon: Users, label: "Grup" },
    ...(isHeadOfFamily ? [{ id: "monitoring", icon: Monitor, label: "Monitor" }] : []),
    { id: "chat", icon: MessageSquare, label: "Chat" },
    { id: "settings", icon: Settings, label: "Setting" }
  ];

  return (
    <div className="bg-white border-t shadow-lg shrink-0 safe-area-bottom backdrop-blur-lg bg-white/95">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around py-3 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 border border-transparent hover:bg-blue-50/80 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                activeTab === tab.id 
                  ? "text-blue-600 bg-blue-50 border-blue-200 shadow-sm scale-105" 
                  : "text-gray-500 hover:text-blue-600"
              }`}
              style={{ minWidth: 50 }}
            >
              <span className={`flex items-center justify-center w-7 h-7 mb-1 rounded-full transition-colors ${
                activeTab === tab.id 
                  ? "bg-blue-100" 
                  : "bg-gray-100 group-hover:bg-blue-100"
              }`}>
                <tab.icon className={`h-4 w-4 ${
                  activeTab === tab.id ? "text-blue-600" : "text-gray-500"
                }`} />
              </span>
              <span className={`text-xs font-medium tracking-wide ${
                activeTab === tab.id ? "text-blue-600" : "text-gray-500"
              }`}>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
