
import { useState, useEffect } from 'react';

export function usePinAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [pinEnabled, setPinEnabled] = useState(false);

  useEffect(() => {
    checkPinStatus();
    
    // Listen for app visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && pinEnabled) {
        // App became visible again, require PIN
        setIsAuthenticated(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pinEnabled]);

  const checkPinStatus = () => {
    const settings = localStorage.getItem('securitySettings');
    const userPin = localStorage.getItem('userPin');
    
    if (settings && userPin) {
      const securitySettings = JSON.parse(settings);
      if (securitySettings.pinEnabled) {
        setPinEnabled(true);
        // On app start, if PIN is enabled, require authentication
        setIsAuthenticated(false);
      }
    }
  };

  const authenticate = () => {
    setIsAuthenticated(true);
  };

  const requireAuth = () => {
    if (pinEnabled) {
      setIsAuthenticated(false);
    }
  };

  return {
    isAuthenticated,
    pinEnabled,
    authenticate,
    requireAuth,
    checkPinStatus
  };
}
