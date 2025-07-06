import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

interface OnlineStatus {
  userId: string;
  isOnline: boolean;
  lastSeen: string;
}

export function useSocketConnection() {
  const { user } = useAuth();
  const [socket, setSocket] = useState<any>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineStatus[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Completely disable socket connection in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Socket connection disabled in development mode');
      setIsConnected(false);
      setSocket(null);
      return;
    }

    // Only attempt connection in production with a real domain
    // For now, we'll keep it disabled until a real production domain is configured
    console.log('Socket connection disabled - no production domain configured');
    setIsConnected(false);
    setSocket(null);
    
    return () => {
      // No cleanup needed since no connection is made
    };
  }, [user]);

  const getGroupOnlineStatus = (groupMembers: any[]) => {
    if (!groupMembers) return { online: 0, offline: 0 };
    
    // Always simulate online status since socket is disabled
    const totalMembers = groupMembers.length;
    const simulatedOnline = Math.min(Math.ceil(totalMembers * 0.6), totalMembers);
    return {
      online: simulatedOnline,
      offline: totalMembers - simulatedOnline
    };
  };

  return {
    socket: null,
    isConnected: false,
    onlineUsers: [],
    getGroupOnlineStatus
  };
}
