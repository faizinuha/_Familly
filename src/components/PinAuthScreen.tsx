import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useBiometricAuth } from '@/hooks/useBiometricAuth';
import { secureStorage } from '@/utils/secureStorage';
import { Fingerprint, Shield } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';

interface PinAuthScreenProps {
  onAuthenticated: () => void;
  onBack?: () => void;
}

const PinAuthScreen: React.FC<PinAuthScreenProps> = ({
  onAuthenticated,
  onBack,
}) => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [focused, setFocused] = useState(false);
  const { toast } = useToast();
  const { authenticateWithBiometric, biometricSupport, isNativePlatform } = useBiometricAuth();
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkBiometricAvailability();
    // Focus the hidden input immediately
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }

    // Handle keyboard events for desktop
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handlePinInput(pin + e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handlePinInput(pin.slice(0, -1));
      } else if (e.key === 'Enter' && pin.length === 6) {
        e.preventDefault();
        validatePin(pin);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [pin]);

  const checkBiometricAvailability = async () => {
    try {
      const biometricSettings = await secureStorage.getBiometricSettings();
      setBiometricEnabled(
        isNativePlatform && 
        biometricSupport.available &&
        biometricSettings && 
        (biometricSettings.fingerprintEnabled || biometricSettings.faceIdEnabled)
      );
    } catch (error) {
      console.error('Error checking biometric availability:', error);
    }
  };

  const handlePinInput = (value: string) => {
    if (value.length <= 6 && /^\d*$/.test(value)) {
      setPin(value);
      if (value.length === 6) {
        validatePin(value);
      }
    }
  };

  const validatePin = async (inputPin: string) => {
    setLoading(true);
    try {
      const isValid = await secureStorage.verifyPIN(inputPin);
      
      if (isValid) {
        toast({
          title: 'Berhasil',
          description: 'PIN benar, mengakses aplikasi...',
        });
        setTimeout(() => {
          onAuthenticated();
        }, 500);
      } else {
        toast({
          title: 'PIN Salah',
          description: 'PIN yang Anda masukkan salah',
          variant: 'destructive',
        });
        setPin('');
        setTimeout(() => {
          if (hiddenInputRef.current) {
            hiddenInputRef.current.focus();
          }
        }, 100);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal memverifikasi PIN',
        variant: 'destructive',
      });
      setPin('');
    }
    setLoading(false);
  };

  const handleBiometricAuth = async () => {
    if (!isNativePlatform) {
      toast({
        title: "Biometrik Tidak Tersedia",
        description: "Autentikasi biometrik hanya tersedia di aplikasi mobile",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const result = await authenticateWithBiometric();
      
      if (result.success) {
        toast({
          title: 'Berhasil',
          description: 'Autentikasi biometrik berhasil',
        });
        onAuthenticated();
      } else {
        toast({
          title: 'Autentikasi Gagal',
          description: result.error || 'Silakan coba lagi atau gunakan PIN',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal mengautentikasi dengan biometrik',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePinBoxClick = () => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  };

  const handleDeletePin = () => {
    setPin(pin.slice(0, -1));
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md mx-auto bg-white/95 backdrop-blur">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle>Masukkan PIN Keamanan</CardTitle>
          <p className="text-sm text-gray-600">
            Aplikasi terkunci untuk keamanan
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* PIN Input Display */}
          <div className="flex justify-center gap-2" onClick={handlePinBoxClick}>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center text-xl font-bold cursor-pointer transition-colors ${
                  pin.length > i
                    ? 'border-blue-500 bg-blue-50'
                    : focused
                    ? 'border-blue-300 bg-blue-25'
                    : 'border-gray-300'
                }`}
              >
                {pin[i] ? '•' : ''}
              </div>
            ))}
          </div>

          {/* Hidden input for all keyboards */}
          <input
            ref={hiddenInputRef}
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            value={pin}
            onChange={(e) => handlePinInput(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="absolute left-[-9999px] top-[-9999px] opacity-0 pointer-events-none"
            autoFocus
            maxLength={6}
            tabIndex={0}
          />

          {/* Mobile keyboard hint */}
          <div className="text-center text-sm text-gray-500">
            {pin.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeletePin}
                className="mr-2"
              >
                Hapus
              </Button>
            )}
            Ketik PIN Anda
          </div>

          {/* Biometric Auth Button */}
          {biometricEnabled && isNativePlatform && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={handleBiometricAuth}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Fingerprint className="h-4 w-4" />
                {loading ? 'Memverifikasi...' : 'Gunakan Biometrik'}
              </Button>
            </div>
          )}

          {!isNativePlatform && (
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Untuk fitur biometrik penuh, gunakan aplikasi yang dibangun dengan Capacitor
              </p>
            </div>
          )}

          {/* Back button if provided */}
          {onBack && (
            <Button variant="ghost" onClick={onBack} className="w-full">
              Kembali
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PinAuthScreen;
