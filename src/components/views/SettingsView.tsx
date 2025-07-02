
import React, { useState } from 'react';
import { Shield, Key } from 'lucide-react';
import ProfileSection from "@/components/ProfileSection";
import SecuritySettings from "@/components/SecuritySettings";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import { Button } from "@/components/ui/button";

const SettingsView: React.FC = () => {
  const [currentView, setCurrentView] = useState<'main' | 'security' | 'change-password'>('main');

  if (currentView === 'security') {
    return <SecuritySettings onBack={() => setCurrentView('main')} />;
  }

  if (currentView === 'change-password') {
    return <ChangePasswordForm onBack={() => setCurrentView('main')} />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Pengaturan</h2>
      
      <ProfileSection />
      
      {/* Security Section */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <Button
          variant="ghost"
          className="w-full justify-start p-0 h-auto"
          onClick={() => setCurrentView('security')}
        >
          <div className="flex items-center gap-4 w-full py-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-gray-900">Keamanan</h3>
              <p className="text-sm text-gray-600">PIN, Face ID, dan Fingerprint</p>
            </div>
            <div className="text-gray-400">›</div>
          </div>
        </Button>
      </div>

      {/* Change Password Section */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <Button
          variant="ghost"
          className="w-full justify-start p-0 h-auto"
          onClick={() => setCurrentView('change-password')}
        >
          <div className="flex items-center gap-4 w-full py-3">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
              <Key className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-gray-900">Ganti Password</h3>
              <p className="text-sm text-gray-600">Ubah password akun Anda</p>
            </div>
            <div className="text-gray-400">›</div>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default SettingsView;
