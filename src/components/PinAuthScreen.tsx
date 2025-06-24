
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Fingerprint } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface PinAuthScreenProps {
  onAuthenticated: () => void;
  onBack?: () => void;
}

const PinAuthScreen: React.FC<PinAuthScreenProps> = ({ onAuthenticated, onBack }) => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if biometric is enabled
    const settings = localStorage.getItem('securitySettings');
    if (settings) {
      const securitySettings = JSON.parse(settings);
      setBiometricEnabled(securitySettings.fingerprintEnabled || securitySettings.faceIdEnabled);
    }
  }, []);

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
    const savedPin = localStorage.getItem('userPin');
    
    if (savedPin === inputPin) {
      toast({
        title: "Berhasil",
        description: "PIN benar, mengakses aplikasi...",
      });
      setTimeout(() => {
        onAuthenticated();
      }, 500);
    } else {
      toast({
        title: "PIN Salah",
        description: "PIN yang Anda masukkan salah",
        variant: "destructive"
      });
      setPin('');
    }
    setLoading(false);
  };

  const handleBiometricAuth = async () => {
    try {
      setLoading(true);
      
      // Check if we're in Capacitor environment
      if (window.Capacitor?.isNativePlatform()) {
        // For real implementation, use @capacitor/biometric-auth
        const confirmed = await simulateBiometricAuth();
        if (confirmed) {
          toast({
            title: "Berhasil",
            description: "Autentikasi biometrik berhasil",
          });
          onAuthenticated();
        }
      } else {
        // Web fallback - simulate biometric
        const confirmed = await simulateBiometricAuth();
        if (confirmed) {
          toast({
            title: "Berhasil",
            description: "Autentikasi biometrik berhasil",
          });
          onAuthenticated();
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengautentikasi dengan biometrik",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const simulateBiometricAuth = (): Promise<boolean> => {
    return new Promise((resolve) => {
      // Generate random success/failure for demo
      // In real app, this would call native biometric APIs
      const isSuccess = Math.random() > 0.2; // 80% success rate for demo
      setTimeout(() => {
        if (isSuccess) {
          resolve(true);
        } else {
          toast({
            title: "Autentikasi Gagal",
            description: "Silakan coba lagi atau gunakan PIN",
            variant: "destructive"
          });
          resolve(false);
        }
      }, 1500);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md mx-auto bg-white/95 backdrop-blur">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle>Masukkan PIN Keamanan</CardTitle>
          <p className="text-sm text-gray-600">Aplikasi terkunci untuk keamanan</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* PIN Input Display */}
          <div className="flex justify-center gap-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center text-xl font-bold ${
                  pin.length > i ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
              >
                {pin[i] ? '•' : ''}
              </div>
            ))}
          </div>
          
          {/* Hidden input for mobile keyboards */}
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={pin}
            onChange={(e) => handlePinInput(e.target.value)}
            className="opacity-0 absolute -z-10"
            autoFocus
            maxLength={6}
          />

          {/* Biometric Auth Button */}
          {biometricEnabled && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={handleBiometricAuth}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Fingerprint className="h-4 w-4" />
                {loading ? "Memverifikasi..." : "Gunakan Sidik Jari"}
              </Button>
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
