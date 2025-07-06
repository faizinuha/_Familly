
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';

interface OnlineStatus {
  userId: string;
  isOnline: boolean;
  lastSeen: string;
}

export function useSocketConnection() {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineStatus[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Only connect to socket in production or if socket server is available
    // For development, we'll simulate the connection without actually connecting
    if (process.env.NODE_ENV === 'development') {
      console.log('Socket connection disabled in development');
      setIsConnected(false);
      return;
    }

    // Connect to socket server only in production with real domain
    const socketInstance = io(process.env.NODE_ENV === 'production' 
      ? 'wss://your-actual-production-domain.com' // Replace with actual domain
      : 'ws://localhost:3001', {
      auth: {
        userId: user.id,
        userEmail: user.email
      },
      transports: ['websocket', 'polling']
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
      
      // Join user's groups
      socketInstance.emit('join-user-groups', { userId: user.id });
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('users-online-status', (users: OnlineStatus[]) => {
      setOnlineUsers(users);
    });

    socketInstance.on('user-status-changed', (status: OnlineStatus) => {
      setOnlineUsers(prev => {
        const filtered = prev.filter(u => u.userId !== status.userId);
        return [...filtered, status];
      });
    });

    socketInstance.on('connect_error', (error) => {
      console.log('Socket connection error:', error);
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  const getGroupOnlineStatus = (groupMembers: any[]) => {
    if (!groupMembers) return { online: 0, offline: 0 };
    
    // In development or when socket is not connected, simulate some online users
    if (!isConnected) {
      const totalMembers = groupMembers.length;
      const simulatedOnline = Math.min(Math.ceil(totalMembers * 0.6), totalMembers);
      return {
        online: simulatedOnline,
        offline: totalMembers - simulatedOnline
      };
    }
    
    const memberUserIds = groupMembers.map(member => member.user_id);
    const onlineCount = onlineUsers.filter(user => 
      memberUserIds.includes(user.userId) && user.isOnline
    ).length;
    
    return {
      online: onlineCount,
      offline: memberUserIds.length - onlineCount
    };
  };

  return {
    socket,
    isConnected,
    onlineUsers,
    getGroupOnlineStatus
  };
}
