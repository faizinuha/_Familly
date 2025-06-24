import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Check, Shield } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface PinSetupProcessProps {
  onComplete: () => void;
  onBack: () => void;
}

const PinSetupProcess: React.FC<PinSetupProcessProps> = ({
  onComplete,
  onBack,
}) => {
  const [step, setStep] = useState(1);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePinInput = (value: string, isConfirm: boolean = false) => {
    if (value.length <= 6 && /^\d*$/.test(value)) {
      if (isConfirm) {
        setConfirmPin(value);
      } else {
        setPin(value);
        if (value.length === 6) {
          setTimeout(() => setStep(2), 300);
        }
      }
    }
  };

  const handleConfirm = async () => {
    if (pin.length !== 6) {
      toast({
        title: 'Error',
        description: 'PIN harus 6 digit',
        variant: 'destructive',
      });
      return;
    }

    if (pin !== confirmPin) {
      toast({
        title: 'Error',
        description: 'PIN tidak cocok, silakan coba lagi',
        variant: 'destructive',
      });
      setConfirmPin('');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Save PIN securely (in real app, this should be encrypted)
      localStorage.setItem('userPin', pin);
      localStorage.setItem(
        'securitySettings',
        JSON.stringify({
          pinEnabled: true,
          faceIdEnabled: false,
          fingerprintEnabled: false,
        })
      );

      setStep(3);

      setTimeout(() => {
        toast({
          title: 'PIN Berhasil Diatur',
          description: 'Keamanan aplikasi telah diaktifkan',
        });
        onComplete();
      }, 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal menyimpan PIN, silakan coba lagi',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderPinInput = (
    value: string,
    onChange: (val: string) => void,
    placeholder: string
  ) => (
    <div className="space-y-4">
      <div className="flex justify-center gap-2">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center text-xl font-bold ${
              value.length > i
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300'
            }`}
          >
            {value[i] ? '•' : ''}
          </div>
        ))}
      </div>
      <input
        id="pin-setup-input"
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute left-0 top-0 w-1 h-1 opacity-0"
        autoFocus
        maxLength={6}
        tabIndex={0}
      />
    </div>
  );

  useEffect(() => {
    // Focus PIN input on mount
    setTimeout(() => {
      const input = document.getElementById('pin-setup-input');
      if (input) (input as HTMLInputElement).focus();
    }, 100);
  }, [step]);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Buat PIN Keamanan</CardTitle>
              <p className="text-sm text-gray-600">
                Masukkan 6 digit PIN untuk mengamankan aplikasi
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderPinInput(
                pin,
                (val) => handlePinInput(val),
                'Masukkan PIN'
              )}
              <div className="flex gap-2">
                <Button variant="outline" onClick={onBack} className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle>Konfirmasi PIN</CardTitle>
              <p className="text-sm text-gray-600">
                Masukkan ulang PIN untuk konfirmasi
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderPinInput(
                confirmPin,
                (val) => handlePinInput(val, true),
                'Konfirmasi PIN'
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Kembali
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={confirmPin.length !== 6 || loading}
                  className="flex-1"
                >
                  {loading ? 'Menyimpan...' : 'Konfirmasi'}
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>PIN Berhasil Dibuat!</CardTitle>
              <p className="text-sm text-gray-600">
                Aplikasi Anda sekarang aman dengan PIN
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="animate-pulse text-green-600 mb-4">
                  <Check className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-sm text-gray-500">
                  Mengalihkan ke pengaturan...
                </p>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {renderStep()}
    </div>
  );
};

export default PinSetupProcess;
