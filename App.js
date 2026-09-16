/**
 * @format
 */
import React from 'react';
import {StatusBar, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {AppProvider} from './src/context/AppContext';
import {ToastProvider} from './src/components';
import {RootNavigator} from './src/navigation';
import store from './src/redux/store';
import colors from './src/config/color';

export default function App() {
  return (
    <GestureHandlerRootView style={{flex: 1, backgroundColor: colors.white}}>
      <Provider store={store}>
        <SafeAreaProvider style={{flex: 1, backgroundColor: colors.white}}>
          <AppProvider>
            <ToastProvider>
              <StatusBar
                translucent
                barStyle="dark-content"
                backgroundColor="transparent"
              />
              <View style={{flex: 1, backgroundColor: colors.white}}>
                <RootNavigator />
              </View>
            </ToastProvider>
          </AppProvider>
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
