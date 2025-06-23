
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Shield, Lock, Fingerprint, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface SecuritySettingsProps {
  onBack: () => void;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ onBack }) => {
  const [pinEnabled, setPinEnabled] = useState(false);
  const [faceIdEnabled, setFaceIdEnabled] = useState(false);
  const [fingerprintEnabled, setFingerprintEnabled] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [biometricSupport, setBiometricSupport] = useState({
    faceId: false,
    fingerprint: false
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load security settings from localStorage
    const savedSettings = localStorage.getItem('securitySettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setPinEnabled(settings.pinEnabled || false);
      setFaceIdEnabled(settings.faceIdEnabled || false);
      setFingerprintEnabled(settings.fingerprintEnabled || false);
    }

    // Check biometric support
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    // Simulate biometric support check
    // In a real app, you would use Web Authentication API or Capacitor plugins
    const support = {
      faceId: window.navigator.userAgent.includes('iPhone') || window.navigator.userAgent.includes('iPad'),
      fingerprint: 'credentials' in navigator
    };
    setBiometricSupport(support);
  };

  const saveSecuritySettings = (settings: any) => {
    localStorage.setItem('securitySettings', JSON.stringify(settings));
  };

  const handlePinToggle = (enabled: boolean) => {
    if (enabled && !localStorage.getItem('userPin')) {
      setShowPinDialog(true);
    } else if (!enabled) {
      setPinEnabled(false);
      localStorage.removeItem('userPin');
      saveSecuritySettings({ pinEnabled: false, faceIdEnabled, fingerprintEnabled });
      toast({
        title: "PIN Dinonaktifkan",
        description: "PIN berhasil dinonaktifkan",
      });
    } else {
      setPinEnabled(enabled);
      saveSecuritySettings({ pinEnabled: enabled, faceIdEnabled, fingerprintEnabled });
    }
  };

  const handleSetPin = () => {
    if (newPin.length !== 6) {
      toast({
        title: "Error",
        description: "PIN harus 6 digit",
        variant: "destructive"
      });
      return;
    }

    if (newPin !== confirmPin) {
      toast({
        title: "Error",
        description: "PIN tidak cocok",
        variant: "destructive"
      });
      return;
    }

    // Save PIN (in real app, this should be hashed)
    localStorage.setItem('userPin', newPin);
    setPinEnabled(true);
    saveSecuritySettings({ pinEnabled: true, faceIdEnabled, fingerprintEnabled });
    setShowPinDialog(false);
    setNewPin('');
    setConfirmPin('');
    
    toast({
      title: "PIN Berhasil Diatur",
      description: "PIN keamanan telah diaktifkan",
    });
  };

  const handleFaceIdToggle = async (enabled: boolean) => {
    if (enabled && !biometricSupport.faceId) {
      toast({
        title: "Face ID Tidak Tersedia",
        description: "Perangkat Anda tidak mendukung Face ID",
        variant: "destructive"
      });
      return;
    }

    if (enabled) {
      try {
        // Simulate Face ID authentication
        const result = await simulateBiometricAuth('Face ID');
        if (result) {
          setFaceIdEnabled(true);
          saveSecuritySettings({ pinEnabled, faceIdEnabled: true, fingerprintEnabled });
          toast({
            title: "Face ID Diaktifkan",
            description: "Face ID berhasil diaktifkan",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Gagal mengaktifkan Face ID",
          variant: "destructive"
        });
      }
    } else {
      setFaceIdEnabled(false);
      saveSecuritySettings({ pinEnabled, faceIdEnabled: false, fingerprintEnabled });
      toast({
        title: "Face ID Dinonaktifkan",
        description: "Face ID berhasil dinonaktifkan",
      });
    }
  };

  const handleFingerprintToggle = async (enabled: boolean) => {
    if (enabled && !biometricSupport.fingerprint) {
      toast({
        title: "Fingerprint Tidak Tersedia",
        description: "Perangkat Anda tidak mendukung fingerprint",
        variant: "destructive"
      });
      return;
    }

    if (enabled) {
      try {
        // Simulate fingerprint authentication
        const result = await simulateBiometricAuth('Fingerprint');
        if (result) {
          setFingerprintEnabled(true);
          saveSecuritySettings({ pinEnabled, faceIdEnabled, fingerprintEnabled: true });
          toast({
            title: "Fingerprint Diaktifkan",
            description: "Fingerprint berhasil diaktifkan",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Gagal mengaktifkan fingerprint",
          variant: "destructive"
        });
      }
    } else {
      setFingerprintEnabled(false);
      saveSecuritySettings({ pinEnabled, faceIdEnabled, fingerprintEnabled: false });
      toast({
        title: "Fingerprint Dinonaktifkan",
        description: "Fingerprint berhasil dinonaktifkan",
      });
    }
  };

  const simulateBiometricAuth = (type: string): Promise<boolean> => {
    return new Promise((resolve) => {
      // Simulate biometric authentication dialog
      const confirmed = window.confirm(`Aktifkan ${type}? Sentuh sensor untuk mengkonfirmasi.`);
      setTimeout(() => resolve(confirmed), 1000);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 pb-4 border-b">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-bold">Keamanan</h2>
      </div>

      <div className="space-y-6">
        {/* PIN Security */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">PIN Keamanan</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Aktifkan PIN 6 digit untuk mengamankan aplikasi
              </p>
              {pinEnabled && (
                <p className="text-xs text-green-600 mt-1">PIN aktif</p>
              )}
            </div>
            <Switch
              checked={pinEnabled}
              onCheckedChange={handlePinToggle}
            />
          </div>
        </div>

        {/* Face ID */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Face ID</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Gunakan Face ID untuk masuk dengan cepat
              </p>
              <p className={`text-xs mt-1 ${biometricSupport.faceId ? 'text-green-600' : 'text-red-600'}`}>
                {biometricSupport.faceId ? 'Tersedia' : 'Tidak tersedia di perangkat ini'}
              </p>
            </div>
            <Switch
              checked={faceIdEnabled}
              onCheckedChange={handleFaceIdToggle}
              disabled={!biometricSupport.faceId}
            />
          </div>
        </div>

        {/* Fingerprint */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <Fingerprint className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Fingerprint</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Gunakan sidik jari untuk autentikasi
              </p>
              <p className={`text-xs mt-1 ${biometricSupport.fingerprint ? 'text-green-600' : 'text-red-600'}`}>
                {biometricSupport.fingerprint ? 'Tersedia' : 'Tidak tersedia di perangkat ini'}
              </p>
            </div>
            <Switch
              checked={fingerprintEnabled}
              onCheckedChange={handleFingerprintToggle}
              disabled={!biometricSupport.fingerprint}
            />
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-blue-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Tips Keamanan</h3>
          </div>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Gunakan PIN yang tidak mudah ditebak</li>
            <li>• Aktifkan lebih dari satu metode autentikasi</li>
            <li>• Jangan bagikan PIN Anda kepada siapa pun</li>
            <li>• Perbarui pengaturan keamanan secara berkala</li>
          </ul>
        </div>
      </div>

      {/* PIN Setup Dialog */}
      <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atur PIN Keamanan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newPin">PIN Baru (6 digit)</Label>
              <Input
                id="newPin"
                type="password"
                maxLength={6}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
              />
            </div>
            <div>
              <Label htmlFor="confirmPin">Konfirmasi PIN</Label>
              <Input
                id="confirmPin"
                type="password"
                maxLength={6}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSetPin} className="flex-1">
                Simpan PIN
              </Button>
              <Button variant="outline" onClick={() => setShowPinDialog(false)} className="flex-1">
                Batal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SecuritySettings;
