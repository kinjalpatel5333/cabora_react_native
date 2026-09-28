import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { checkInternet } from '../utils/network';
import { AppStatusModal } from '../components';

const NetworkContext = createContext({
  isConnected: true,
  checkConnection: async () => true,
});

export function NetworkProvider({ children, enableGlobalModal = true }) {
  const [isConnected, setIsConnected] = useState(true);

  const checkConnection = useCallback(async () => {
    try {
      const state = await NetInfo.fetch();
      if (state && typeof state.isConnected === 'boolean') {
        setIsConnected(state.isConnected);
        return state.isConnected;
      }
    } catch {
      // fallback
    }
    const reachable = await checkInternet(4000);
    setIsConnected(reachable);
    return reachable;
  }, []);

  useEffect(() => {
    // Initial fetch to sync state
    NetInfo.fetch()
      .then(state => {
        if (state && state.isConnected === false) {
          setIsConnected(false);
        } else {
          setIsConnected(true);
        }
      })
      .catch(() => {
        setIsConnected(true);
      });

    // Listen for live connection changes
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state && state.isConnected === false) {
        setIsConnected(false);
      } else if (state && state.isConnected === true) {
        setIsConnected(true);
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  return (
    <NetworkContext.Provider value={{ isConnected, checkConnection }}>
      {children}
      {enableGlobalModal && (
        <AppStatusModal
          visible={isConnected === false}
          type="offline"
          onRetry={checkConnection}
        />
      )}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  return useContext(NetworkContext);
}
