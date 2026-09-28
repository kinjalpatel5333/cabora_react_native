/**
 * @format
 */

import 'react-native-gesture-handler';
import {AppRegistry, Image, Text, TextInput} from 'react-native';
import {enableScreens} from 'react-native-screens';
import App from './App';
import {name as appName} from './app.json';

// Global default props for Text, TextInput, and Image
if (Text.defaultProps == null) {
  Text.defaultProps = {};
}
Text.defaultProps.style = {fontFamily: 'Sora-Regular', ...Text.defaultProps.style};
Text.defaultProps.allowFontScaling = false;
Text.defaultProps.maxFontSizeMultiplier = 1;

if (TextInput.defaultProps == null) {
  TextInput.defaultProps = {};
}
TextInput.defaultProps.style = {fontFamily: 'Sora-Regular', ...TextInput.defaultProps.style};
TextInput.defaultProps.allowFontScaling = false;
TextInput.defaultProps.maxFontSizeMultiplier = 1;

if (Image.defaultProps == null) {
  Image.defaultProps = {};
}
Image.defaultProps.fadeDuration = 0;

enableScreens();
AppRegistry.registerComponent(appName, () => App);

