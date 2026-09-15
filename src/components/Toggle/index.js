import React from 'react';
import {Pressable, View} from 'react-native';
import useThemedStyles from '../useThemedStyles';
import createStyles from './style';

export default function Toggle({value = false, onValueChange, disabled = false}) {
  const styles = useThemedStyles(createStyles);

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{checked: value, disabled}}
      disabled={disabled}
      onPress={() => onValueChange?.(!value)}
      style={({pressed}) => [
        styles.track,
        value ? styles.on : styles.off,
        disabled && (value ? styles.disabledOn : styles.disabledOff),
        !disabled && pressed && (value ? styles.onPressed : styles.offPressed),
      ]}>
      <View style={[styles.thumb, disabled && styles.thumbDisabled]} />
    </Pressable>
  );
}
