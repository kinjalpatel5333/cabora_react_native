/**
 * @format
 */
import React from 'react';
import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {AppProvider} from './src/context/AppContext';
import {RootNavigator} from './src/navigation';
import store from './src/redux/store';
import colors from './src/config/color';

export default function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <SafeAreaProvider>
          <AppProvider>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
            <RootNavigator />
          </AppProvider>
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
