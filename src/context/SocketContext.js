import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAppSelector } from '../redux/hooks';
import {
  connectSocket,
  disconnectSocket,
  getSocket,
  subscribeSocketEvent,
  syncRideStatus,
} from '../services/socketService';

const SocketContext = createContext({
  socket: null,
  isConnected: false,
  connect: () => {},
  disconnect: () => {},
  syncRide: () => {},
  subscribe: () => () => {},
});

export function SocketProvider({ children }) {
  const token = useAppSelector(state => state.auth?.token);
  const [isConnected, setIsConnected] = useState(false);
  const [socketInstance, setSocketInstance] = useState(null);

  const handleConnect = useCallback((customToken) => {
    const activeToken = customToken || token;
    if (!activeToken) {
      console.log('⚡ [SOCKET CONTEXT] Cannot connect: Token unavailable.');
      return;
    }
    const s = connectSocket(activeToken);
    setSocketInstance(s);
    if (s) {
      setIsConnected(s.connected);

      const onConnect = () => setIsConnected(true);
      const onDisconnect = () => setIsConnected(false);

      s.on('connect', onConnect);
      s.on('disconnect', onDisconnect);

      return () => {
        s.off('connect', onConnect);
        s.off('disconnect', onDisconnect);
      };
    }
  }, [token]);

  const handleDisconnect = useCallback(() => {
    disconnectSocket();
    setIsConnected(false);
    setSocketInstance(null);
  }, []);

  useEffect(() => {
    const cleanup = handleConnect(token);
    return () => {
      cleanup?.();
    };
  }, [token, handleConnect]);

  const value = {
    socket: socketInstance || getSocket(),
    isConnected,
    connect: handleConnect,
    disconnect: handleDisconnect,
    syncRide: syncRideStatus,
    subscribe: subscribeSocketEvent,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
