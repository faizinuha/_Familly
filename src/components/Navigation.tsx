
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
    <div className="bg-white border-t shadow-lg mt-auto">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around py-2 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all duration-200 shadow-sm border border-transparent hover:border-blue-200 hover:bg-blue-50/60 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                activeTab === tab.id 
                  ? "text-blue-600 bg-gradient-to-t from-blue-100 to-white border-blue-400 shadow-md scale-105" 
                  : "text-gray-600 hover:text-blue-600"
              }`}
              style={{ minWidth: 60 }}
            >
              <span className="flex items-center justify-center w-8 h-8 mb-1 rounded-full bg-blue-50 group-hover:bg-blue-100">
                <tab.icon className="h-5 w-5" />
              </span>
              <span className="text-xs font-semibold tracking-wide">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
