
import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

interface BiometricSupport {
  faceId: boolean;
  fingerprint: boolean;
  touchId: boolean;
  available: boolean;
  reason?: string;
}

export function useBiometricAuth() {
  const [biometricSupport, setBiometricSupport] = useState<BiometricSupport>({
    faceId: false,
    fingerprint: false,
    touchId: false,
    available: false
  });

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    const isNative = Capacitor.isNativePlatform();
    
    if (!isNative) {
      // Browser environment - disable biometric features
      setBiometricSupport({
        faceId: false,
        fingerprint: false,
        touchId: false,
        available: false,
        reason: 'Fitur biometrik hanya tersedia di aplikasi mobile'
      });
      return;
    }

    // Native environment - check actual biometric capabilities
    try {
      const platform = Capacitor.getPlatform();
      
      if (platform === 'ios') {
        // For iOS - check for Face ID/Touch ID availability
        // In real implementation, you would use @capacitor/biometric-auth
        const support = {
          faceId: true, // Will be determined by actual biometric check
          fingerprint: false,
          touchId: true,
          available: true,
          reason: 'Biometrik tersedia untuk iOS'
        };
        setBiometricSupport(support);
      } else if (platform === 'android') {
        // For Android - check for fingerprint
        const support = {
          faceId: false,
          fingerprint: true,
          touchId: false,
          available: true,
          reason: 'Biometrik tersedia untuk Android'  
        };
        setBiometricSupport(support);
      } else {
        setBiometricSupport({
          faceId: false,
          fingerprint: false,
          touchId: false,
          available: false,
          reason: 'Platform tidak mendukung biometrik'
        });
      }
    } catch (error) {
      console.error('Error checking biometric support:', error);
      setBiometricSupport({
        faceId: false,
        fingerprint: false,
        touchId: false,
        available: false,
        reason: 'Error saat mengecek dukungan biometrik'
      });
    }
  };

  const authenticateWithBiometric = async (): Promise<{ success: boolean; error?: string }> => {
    if (!biometricSupport.available) {
      return {
        success: false,
        error: biometricSupport.reason || 'Biometrik tidak tersedia'
      };
    }

    try {
      // For native platforms, implement actual biometric authentication
      if (Capacitor.isNativePlatform()) {
        // This would use @capacitor/biometric-auth in real implementation
        // For now, we'll simulate the authentication
        const result = await simulateBiometricAuth();
        return { success: result };
      } else {
        return {
          success: false,
          error: 'Biometrik hanya tersedia di aplikasi mobile'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Gagal melakukan autentikasi biometrik'
      };
    }
  };

  const simulateBiometricAuth = (): Promise<boolean> => {
    return new Promise((resolve) => {
      // Simulate biometric authentication process
      setTimeout(() => {
        const success = Math.random() > 0.2; // 80% success rate for testing
        resolve(success);
      }, 2000);
    });
  };

  return {
    biometricSupport,
    authenticateWithBiometric,
    isNativePlatform: Capacitor.isNativePlatform()
  };
}
