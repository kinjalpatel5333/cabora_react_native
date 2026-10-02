/**
 * @format
 */

import 'react-native-gesture-handler';
import React from 'react';
import {AppRegistry, Image, Text, TextInput} from 'react-native';
import {enableScreens} from 'react-native-screens';
import * as jsxRuntime from 'react/jsx-runtime';
import * as jsxDevRuntime from 'react/jsx-dev-runtime';
import App from './App';
import {name as appName} from './app.json';

// Global font scaling prevention helper
const patchFontScalingProps = (type, props) => {
  const isTextOrInput =
    type === Text ||
    type === TextInput ||
    type?.displayName === 'Text' ||
    type?.displayName === 'TextInput' ||
    type?.name === 'Text' ||
    type?.name === 'TextInput' ||
    type?.render?.displayName === 'Text' ||
    type?.render?.displayName === 'TextInput' ||
    type?.render?.name === 'Text' ||
    type?.render?.name === 'TextInput';

  if (isTextOrInput) {
    return {
      ...(props || {}),
      allowFontScaling: false,
      maxFontSizeMultiplier: 1,
    };
  }
  return props;
};

// Patch Text.render and TextInput.render if present
if (Text && Text.render) {
  const origTextRender = Text.render;
  Text.render = function (props, ref) {
    return origTextRender.call(
      this,
      {...(props || {}), allowFontScaling: false, maxFontSizeMultiplier: 1},
      ref,
    );
  };
}

if (TextInput && TextInput.render) {
  const origInputRender = TextInput.render;
  TextInput.render = function (props, ref) {
    return origInputRender.call(
      this,
      {...(props || {}), allowFontScaling: false, maxFontSizeMultiplier: 1},
      ref,
    );
  };
}

// 1. Patch React.createElement
const originalCreateElement = React.createElement;
React.createElement = function (type, props, ...children) {
  const newProps = patchFontScalingProps(type, props);
  return originalCreateElement.call(this, type, newProps, ...children);
};

// 2. Patch jsxRuntime (Production JSX)
if (jsxRuntime.jsx) {
  const originalJsx = jsxRuntime.jsx;
  jsxRuntime.jsx = function (type, props, key) {
    const newProps = patchFontScalingProps(type, props);
    return originalJsx.call(this, type, newProps, key);
  };
}
if (jsxRuntime.jsxs) {
  const originalJsxs = jsxRuntime.jsxs;
  jsxRuntime.jsxs = function (type, props, key) {
    const newProps = patchFontScalingProps(type, props);
    return originalJsxs.call(this, type, newProps, key);
  };
}

// 3. Patch jsxDevRuntime (Development JSX)
if (jsxDevRuntime.jsxDEV) {
  const originalJsxDEV = jsxDevRuntime.jsxDEV;
  jsxDevRuntime.jsxDEV = function (type, props, key, isStaticChildren, source, self) {
    const newProps = patchFontScalingProps(type, props);
    return originalJsxDEV.call(this, type, newProps, key, isStaticChildren, source, self);
  };
}

// Legacy defaultProps fallback
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


