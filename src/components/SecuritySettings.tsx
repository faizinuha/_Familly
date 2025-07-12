
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Shield, Lock, Fingerprint, Eye, Smartphone } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useBiometricAuth } from "@/hooks/useBiometricAuth";
import { secureStorage } from "@/utils/secureStorage";
import PinSetupProcess from "./PinSetupProcess";

interface SecuritySettingsProps {
  onBack: () => void;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ onBack }) => {
  const [pinEnabled, setPinEnabled] = useState(false);
  const [faceIdEnabled, setFaceIdEnabled] = useState(false);
  const [fingerprintEnabled, setFingerprintEnabled] = useState(false);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const { toast } = useToast();
  const { biometricSupport, authenticateWithBiometric, isNativePlatform } = useBiometricAuth();

  useEffect(() => {
    loadSecuritySettings();
  }, []);

  const loadSecuritySettings = async () => {
    try {
      // Load PIN settings
      const pinExists = await secureStorage.getItem('user_pin', true);
      setPinEnabled(!!pinExists);

      // Load biometric settings
      const biometricSettings = await secureStorage.getBiometricSettings();
      if (biometricSettings) {
        setFaceIdEnabled(biometricSettings.faceIdEnabled || false);
        setFingerprintEnabled(biometricSettings.fingerprintEnabled || false);
      }
    } catch (error) {
      console.error('Error loading security settings:', error);
    }
  };

  const saveBiometricSettings = async (settings: any) => {
    try {
      await secureStorage.storeBiometricSettings(settings);
    } catch (error) {
      console.error('Error saving biometric settings:', error);
    }
  };

  const handlePinToggle = async (enabled: boolean) => {
    if (enabled && !await secureStorage.getItem('user_pin', true)) {
      setShowPinSetup(true);
    } else if (!enabled) {
      try {
        await secureStorage.removeItem('user_pin');
        setPinEnabled(false);
        toast({
          title: "PIN Dinonaktifkan",
          description: "PIN berhasil dinonaktifkan",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Gagal menonaktifkan PIN",
          variant: "destructive"
        });
      }
    } else {
      setPinEnabled(enabled);
    }
  };

  const handlePinSetupComplete = async () => {
    setPinEnabled(true);
    setShowPinSetup(false);
    toast({
      title: "PIN Berhasil Diatur",
      description: "PIN keamanan telah diaktifkan",
    });
  };

  const handleFaceIdToggle = async (enabled: boolean) => {
    if (!isNativePlatform) {
      toast({
        title: "Face ID Tidak Tersedia",
        description: "Face ID hanya tersedia di aplikasi mobile. Silakan gunakan aplikasi yang dibangun dengan Capacitor.",
        variant: "destructive"
      });
      return;
    }

    if (enabled && !biometricSupport.faceId) {
      toast({
        title: "Face ID Tidak Tersedia",
        description: biometricSupport.reason || "Perangkat Anda tidak mendukung Face ID",
        variant: "destructive"
      });
      return;
    }

    if (enabled) {
      try {
        const result = await authenticateWithBiometric();
        if (result.success) {
          setFaceIdEnabled(true);
          await saveBiometricSettings({ faceIdEnabled: true, fingerprintEnabled });
          toast({
            title: "Face ID Diaktifkan",
            description: "Face ID berhasil diaktifkan",
          });
        } else {
          toast({
            title: "Gagal Mengaktifkan Face ID",
            description: result.error || "Autentikasi biometrik gagal",
            variant: "destructive"
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
      await saveBiometricSettings({ faceIdEnabled: false, fingerprintEnabled });
      toast({
        title: "Face ID Dinonaktifkan",
        description: "Face ID berhasil dinonaktifkan",
      });
    }
  };

  const handleFingerprintToggle = async (enabled: boolean) => {
    if (!isNativePlatform) {
      toast({
        title: "Fingerprint Tidak Tersedia",
        description: "Fingerprint hanya tersedia di aplikasi mobile. Silakan gunakan aplikasi yang dibangun dengan Capacitor.",
        variant: "destructive"
      });
      return;
    }

    if (enabled && !biometricSupport.fingerprint) {
      toast({
        title: "Fingerprint Tidak Tersedia",
        description: biometricSupport.reason || "Perangkat Anda tidak mendukung fingerprint",
        variant: "destructive"
      });
      return;
    }

    if (enabled) {
      try {
        const result = await authenticateWithBiometric();
        if (result.success) {
          setFingerprintEnabled(true);
          await saveBiometricSettings({ faceIdEnabled, fingerprintEnabled: true });
          toast({
            title: "Fingerprint Diaktifkan",
            description: "Fingerprint berhasil diaktifkan",
          });
        } else {
          toast({
            title: "Gagal Mengaktifkan Fingerprint",
            description: result.error || "Autentikasi biometrik gagal",
            variant: "destructive"
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
      await saveBiometricSettings({ faceIdEnabled, fingerprintEnabled: false });
      toast({
        title: "Fingerprint Dinonaktifkan",
        description: "Fingerprint berhasil dinonaktifkan",
      });
    }
  };

  if (showPinSetup) {
    return (
      <PinSetupProcess
        onComplete={handlePinSetupComplete}
        onBack={() => setShowPinSetup(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 pb-4 border-b">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-bold">Keamanan</h2>
      </div>

      <div className="space-y-6">
        {/* Platform Info */}
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <Smartphone className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Status Platform</h3>
          </div>
          <p className="text-sm text-blue-800">
            {isNativePlatform 
              ? "Aplikasi mobile - Semua fitur keamanan tersedia" 
              : "Browser - Fitur biometrik tidak tersedia. Gunakan aplikasi Capacitor untuk akses penuh."}
          </p>
        </div>

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
                <p className="text-xs text-green-600 mt-1">PIN aktif - Data tersimpan aman</p>
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
              <p className={`text-xs mt-1 ${
                biometricSupport.faceId && isNativePlatform ? 'text-green-600' : 'text-red-600'
              }`}>
                {isNativePlatform 
                  ? (biometricSupport.faceId ? 'Tersedia' : biometricSupport.reason || 'Tidak tersedia')
                  : 'Hanya tersedia di aplikasi mobile'}
              </p>
            </div>
            <Switch
              checked={faceIdEnabled}
              onCheckedChange={handleFaceIdToggle}
              disabled={!biometricSupport.faceId || !isNativePlatform}
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
              <p className={`text-xs mt-1 ${
                biometricSupport.fingerprint && isNativePlatform ? 'text-green-600' : 'text-red-600'
              }`}>
                {isNativePlatform 
                  ? (biometricSupport.fingerprint ? 'Tersedia' : biometricSupport.reason || 'Tidak tersedia')
                  : 'Hanya tersedia di aplikasi mobile'}
              </p>
            </div>
            <Switch
              checked={fingerprintEnabled}
              onCheckedChange={handleFingerprintToggle}
              disabled={!biometricSupport.fingerprint || !isNativePlatform}
            />
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-blue-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Tips Keamanan Data</h3>
          </div>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Data PIN disimpan dengan enkripsi lokal</li>
            <li>• Fitur biometrik hanya berfungsi di aplikasi native</li>
            <li>• Gunakan Capacitor build untuk fitur keamanan penuh</li>
            <li>• Data tidak disimpan di server tanpa enkripsi</li>
            <li>• Backup otomatis menggunakan enkripsi end-to-end</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
