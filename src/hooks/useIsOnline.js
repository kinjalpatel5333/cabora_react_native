import {useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useIsOnline() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    NetInfo.fetch()
      .then(state => {
        if (state && typeof state.isConnected === 'boolean') {
          setOnline(state.isConnected);
        }
      })
      .catch(() => {});

    const unsubscribe = NetInfo.addEventListener(state => {
      if (state && typeof state.isConnected === 'boolean') {
        setOnline(state.isConnected);
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  return online;
}
