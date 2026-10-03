/**
 * @format
 */
import React from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { AppProvider } from './src/context/AppContext';
import { SocketProvider } from './src/context/SocketContext';
import { ToastProvider } from './src/components';
// import { TourGuideProvider, TourGuideOverlay } from '@wrack/react-native-tour-guide';
import { RootNavigator } from './src/navigation';
import store from './src/redux/store';
import colors from './src/config/color';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.white }}>
      <Provider store={store}>
        <SafeAreaProvider style={{ flex: 1, backgroundColor: colors.white }}>
          <AppProvider>
            <SocketProvider>
              <ToastProvider>
                {/* <TourGuideProvider> */}
                <View style={{ flex: 1, backgroundColor: colors.white }}>
                  <RootNavigator />
                  {/* <TourGuideOverlay /> */}
                </View>
                {/* </TourGuideProvider> */}
              </ToastProvider>
            </SocketProvider>
          </AppProvider>
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
