import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useApp } from '../../context/AppContext';

export default function Toggle({
  value = false,
  onValueChange,
  disabled = false,
  locked = false,
  tone = 'primary',
  size = 'md',
  style,
}) {
  const { colors, isDark } = useApp();
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, animatedValue]);

  const isDisabled = disabled || locked;

  // Sizes
  const dimensions = {
    sm: { trackW: 42, trackH: 24, thumbSize: 18, pad: 3, travel: 18 },
    md: { trackW: 50, trackH: 28, thumbSize: 22, pad: 3, travel: 22 },
    lg: { trackW: 58, trackH: 32, thumbSize: 26, pad: 3, travel: 26 },
  }[size] || { trackW: 50, trackH: 28, thumbSize: 22, pad: 3, travel: 22 };

  const onColor = tone === 'success' ? '#10B981' : '#FF7A00';
  const offColor = isDark ? (colors.navy?.[600] || '#334155') : '#BAC7D5';

  const backgroundColor = locked
    ? (isDark ? colors.navy?.[700] || '#1E293B' : '#F1F5F9')
    : animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [offColor, onColor],
      });

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, dimensions.travel],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled: isDisabled }}
      disabled={isDisabled}
      onPress={() => {
        if (!isDisabled && onValueChange) {
          onValueChange(!value);
        }
      }}
      style={style}>
      <Animated.View
        style={[
          styles.track,
          {
            width: dimensions.trackW,
            height: dimensions.trackH,
            borderRadius: dimensions.trackH / 2,
            padding: dimensions.pad,
            backgroundColor,
            opacity: disabled && !locked ? 0.6 : 1,
            borderWidth: locked ? 1.5 : 0,
            borderColor: isDark ? colors.navy?.[500] || '#475569' : '#CBD5E1',
          },
        ]}>
        <Animated.View
          style={[
            styles.thumb,
            {
              width: dimensions.thumbSize,
              height: dimensions.thumbSize,
              borderRadius: dimensions.thumbSize / 2,
              transform: [{ translateX }],
              backgroundColor: '#FFFFFF',
            },
          ]}
        />
        {locked ? (
          <View
            pointerEvents="none"
            style={[
              styles.lockDash,
              {
                width: dimensions.thumbSize * 0.6,
                backgroundColor: colors.red?.[600] || '#DC2626',
              },
            ]}
          />
        ) : null}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
    position: 'relative',
  },
  thumb: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 2.5,
    elevation: 3,
  },
  lockDash: {
    position: 'absolute',
    alignSelf: 'center',
    height: 2,
    borderRadius: 1,
    zIndex: 2,
  },
});
