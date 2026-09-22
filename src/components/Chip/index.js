import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import useThemedStyles from '../useThemedStyles';
import createStyles from './style';

export default function Chip({
  label,
  selected = false,
  disabled = false,
  onPress,
}) {
  const styles = useThemedStyles(createStyles);

  return (
    <TouchableOpacity activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{disabled, selected}}
      onPress={onPress}
      disabled={disabled}
      style={({pressed}) => [
        styles.base,
        disabled
          ? styles.disabled
          : selected
            ? [styles.selected, pressed && styles.selectedPressed]
            : [styles.idle, pressed && styles.idlePressed],
      ]}>
      <Text
        style={[
          styles.label,
          disabled
            ? styles.labelDisabled
            : selected
              ? styles.labelSelected
              : styles.labelIdle,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
