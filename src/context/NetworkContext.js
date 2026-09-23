import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { NativeModules } from 'react-native';
import { checkInternet } from '../utils/network';
import { AppStatusModal } from '../components';

let NetInfo = null;
if (NativeModules.RNCNetInfo) {
  try {
    NetInfo = require('@react-native-community/netinfo').default;
  } catch {
    NetInfo = null;
  }
}

const NetworkContext = createContext({
  isConnected: true,
  checkConnection: async () => true,
});

export function NetworkProvider({ children, enableGlobalModal = true }) {
  const [isConnected, setIsConnected] = useState(true);

  const checkConnection = useCallback(async () => {
    if (NetInfo) {
      try {
        const state = await NetInfo.fetch();
        if (state.isConnected !== null && state.isConnected !== undefined) {
          setIsConnected(state.isConnected);
          return state.isConnected;
        }
      } catch {
        // fallback
      }
    }
    const reachable = await checkInternet(3000);
    setIsConnected(reachable);
    return reachable;
  }, []);

  useEffect(() => {
    if (!NetInfo) {
      return undefined;
    }

    // Initial fetch to sync state
    NetInfo.fetch().then(state => {
      if (state.isConnected !== null && state.isConnected !== undefined) {
        setIsConnected(state.isConnected);
      }
    }).catch(() => {});

    // Listen for live connection changes
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected !== null && state.isConnected !== undefined) {
        setIsConnected(state.isConnected);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <NetworkContext.Provider value={{ isConnected, checkConnection }}>
      {children}
      {enableGlobalModal && (
        <AppStatusModal
          visible={!isConnected}
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
