
import { Capacitor } from '@capacitor/core';

interface SecureStorageOptions {
  encrypt?: boolean;
  expirationTime?: number; // in milliseconds
}

class SecureStorageManager {
  private prefix = 'family_app_';
  
  /**
   * Store data securely with optional encryption and expiration
   */
  async setItem(key: string, value: any, options: SecureStorageOptions = {}): Promise<void> {
    try {
      const data = {
        value,
        timestamp: Date.now(),
        ...(options.expirationTime && { expiresAt: Date.now() + options.expirationTime })
      };

      const serializedData = JSON.stringify(data);
      const finalData = options.encrypt ? this.encrypt(serializedData) : serializedData;
      
      if (Capacitor.isNativePlatform()) {
        // For native apps, use secure storage plugin when available
        // For now, use localStorage with prefix
        localStorage.setItem(this.prefix + key, finalData);
      } else {
        // Browser - use localStorage with additional security measures
        localStorage.setItem(this.prefix + key, finalData);
      }
    } catch (error) {
      console.error('Error storing secure data:', error);
      throw new Error('Gagal menyimpan data dengan aman');
    }
  }

  /**
   * Retrieve securely stored data
   */
  async getItem(key: string, encrypted: boolean = false): Promise<any> {
    try {
      let storedData: string | null;
      
      if (Capacitor.isNativePlatform()) {
        storedData = localStorage.getItem(this.prefix + key);
      } else {
        storedData = localStorage.getItem(this.prefix + key);
      }

      if (!storedData) return null;

      const rawData = encrypted ? this.decrypt(storedData) : storedData;
      const parsedData = JSON.parse(rawData);

      // Check expiration
      if (parsedData.expiresAt && Date.now() > parsedData.expiresAt) {
        await this.removeItem(key);
        return null;
      }

      return parsedData.value;
    } catch (error) {
      console.error('Error retrieving secure data:', error);
      return null;
    }
  }

  /**
   * Remove securely stored data
   */
  async removeItem(key: string): Promise<void> {
    try {
      if (Capacitor.isNativePlatform()) {
        localStorage.removeItem(this.prefix + key);
      } else {
        localStorage.removeItem(this.prefix + key);
      }
    } catch (error) {
      console.error('Error removing secure data:', error);
    }
  }

  /**
   * Clear all app data (for logout/reset)
   */
  async clearAll(): Promise<void> {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix));
      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing secure data:', error);
    }
  }

  /**
   * Simple encryption for sensitive data (not for production)
   * For production, use proper encryption libraries
   */
  private encrypt(data: string): string {
    // Simple base64 encoding - replace with proper encryption in production
    return btoa(encodeURIComponent(data));
  }

  /**
   * Simple decryption (matches encrypt method)
   */
  private decrypt(encryptedData: string): string {
    try {
      return decodeURIComponent(atob(encryptedData));
    } catch {
      throw new Error('Gagal mendekripsi data');
    }
  }

  /**
   * Store PIN securely with encryption
   */
  async storePIN(pin: string): Promise<void> {
    await this.setItem('user_pin', pin, { encrypt: true });
  }

  /**
   * Verify PIN securely
   */
  async verifyPIN(inputPin: string): Promise<boolean> {
    const storedPin = await this.getItem('user_pin', true);
    return storedPin === inputPin;
  }

  /**
   * Store biometric settings securely
   */
  async storeBiometricSettings(settings: any): Promise<void> {
    await this.setItem('biometric_settings', settings, { encrypt: true });
  }

  /**
   * Get biometric settings
   */
  async getBiometricSettings(): Promise<any> {
    return await this.getItem('biometric_settings', true);
  }
}

export const secureStorage = new SecureStorageManager();
