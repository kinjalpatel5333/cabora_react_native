import React from 'react';
import {ActivityIndicator, Pressable, Text} from 'react-native';
import colors from '../../config/color';
import styles from './style';

export default function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
}) {
  const isOutline = variant === 'outline';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || loading}
      style={({pressed}) => [
        styles.base,
        isOutline ? styles.outline : styles.primary,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
      ]}>
      {loading ? (
        <ActivityIndicator color={isOutline ? colors.primary : colors.white} />
      ) : (
        <Text style={[styles.label, isOutline && styles.outlineLabel]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}
