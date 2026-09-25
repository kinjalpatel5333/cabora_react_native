/**
 * @format
 */

import 'react-native-gesture-handler';
import {AppRegistry, Text, TextInput} from 'react-native';
import {enableScreens} from 'react-native-screens';
import App from './App';
import {name as appName} from './app.json';

// Global default font fallback for Text and TextInput
if (Text.defaultProps == null) {
  Text.defaultProps = {};
}
Text.defaultProps.style = {fontFamily: 'Sora-Regular', ...Text.defaultProps.style};

if (TextInput.defaultProps == null) {
  TextInput.defaultProps = {};
}
TextInput.defaultProps.style = {fontFamily: 'Sora-Regular', ...TextInput.defaultProps.style};

enableScreens();
AppRegistry.registerComponent(appName, () => App);

