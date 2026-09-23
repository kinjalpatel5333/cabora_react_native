import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {checkInternet} from '../utils/network';
import {AppStatusModal} from '../components';

const NetworkContext = createContext({
  isConnected: true,
  checkConnection: async () => true,
});

export function NetworkProvider({children, enableGlobalModal = true}) {
  const [isConnected, setIsConnected] = useState(true);

  const checkConnection = useCallback(async () => {
    try {
      const state = await NetInfo.fetch();
      if (state.isConnected !== null && state.isConnected !== undefined) {
        setIsConnected(state.isConnected);
        return state.isConnected;
      }
    } catch {
      // fallback
    }
    const reachable = await checkInternet(3000);
    setIsConnected(reachable);
    return reachable;
  }, []);

  useEffect(() => {
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
    <NetworkContext.Provider value={{isConnected, checkConnection}}>
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
