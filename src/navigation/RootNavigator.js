import React, {useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import WalkthroughScreen from '../screen/WalkthroughScreen';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {bootstrapApp} from '../redux/slices/appSlice';
import {bootstrapAuth} from '../redux/slices/authSlice';
import colors from '../config/color';

export default function RootNavigator() {
  const dispatch = useAppDispatch();
  const {token, bootstrapped: authReady} = useAppSelector(state => state.auth);
  const {walkthroughSeen, bootstrapped: appReady} = useAppSelector(
    state => state.app,
  );

  useEffect(() => {
    dispatch(bootstrapAuth());
    dispatch(bootstrapApp());
  }, [dispatch]);

  if (!authReady || !appReady) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background,
        }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!walkthroughSeen ? (
        <WalkthroughScreen />
      ) : token ? (
        <AppStack />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}
