import React, {useCallback, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import WalkthroughScreen from '../screen/WalkthroughScreen';
import SplashScreen from '../screen/SplashScreen';
import LocationPermissionScreen from '../screen/LocationPermissionScreen';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {bootstrapApp} from '../redux/slices/appSlice';
import {bootstrapAuth} from '../redux/slices/authSlice';
import {SPLASH} from '../config/setting';
import {wait} from '../utils/network';

const MIN_SPLASH_MS = 1800;

export default function RootNavigator() {
  const dispatch = useAppDispatch();
  const {token, bootstrapped: authReady} = useAppSelector(state => state.auth);
  const {
    walkthroughSeen,
    locationResolved,
    bootstrapped: appReady,
  } = useAppSelector(state => state.app);
  const [phase, setPhase] = useState('loading');

  const runBoot = useCallback(async () => {
    setPhase('loading');
    await Promise.all([
      dispatch(bootstrapAuth()),
      dispatch(bootstrapApp()),
      wait(MIN_SPLASH_MS),
    ]);
    if (SPLASH.maintenance) {
      setPhase('maintenance');
      return;
    }
    if (SPLASH.forceUpdate) {
      setPhase('update');
      return;
    }
    setPhase('ready');
  }, [dispatch]);

  useEffect(() => {
    runBoot();
  }, [runBoot]);

  if (SPLASH.holdOnSplash) {
    return <SplashScreen />;
  }

  if (phase !== 'ready' || !authReady || !appReady) {
    const status =
      phase === 'ready' ? 'loading' : phase === 'loading' ? 'loading' : phase;
    return (
      <SplashScreen
        status={status}
        onRetry={runBoot}
        onCheckAgain={runBoot}
      />
    );
  }

  return (
    <NavigationContainer>
      {!walkthroughSeen ? (
        <WalkthroughScreen />
      ) : !token ? (
        <AuthStack />
      ) : !locationResolved ? (
        <LocationPermissionScreen />
      ) : (
        <AppStack />
      )}
    </NavigationContainer>
  );
}
