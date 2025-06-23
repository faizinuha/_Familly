
import React from 'react';
import ProfileSection from "@/components/ProfileSection";

const SettingsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Pengaturan</h2>
      <ProfileSection />
    </div>
  );
};

export default SettingsView;
