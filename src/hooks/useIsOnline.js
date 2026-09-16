import {useCallback, useEffect, useState} from 'react';
import {AppState} from 'react-native';
import {checkInternet} from '../utils/network';

/**
 * JS-only connectivity probe (no native NetInfo module required).
 */
export function useIsOnline() {
  const [online, setOnline] = useState(true);

  const refresh = useCallback(async () => {
    const ok = await checkInternet();
    setOnline(ok);
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 8000);
    const sub = AppState.addEventListener('change', next => {
      if (next === 'active') {
        refresh();
      }
    });
    return () => {
      clearInterval(interval);
      sub.remove();
    };
  }, [refresh]);

  return online;
}
