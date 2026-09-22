import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import useThemedStyles from '../useThemedStyles';
import createStyles from './style';

export default function Toggle({
  value = false,
  onValueChange,
  disabled = false,
  locked = false,
  tone = 'primary',
  size = 'md',
}) {
  const styles = useThemedStyles(createStyles);
  const success = tone === 'success';
  const large = size === 'lg';
  const isDisabled = disabled || locked;

  return (
    <TouchableOpacity activeOpacity={0.7}
      accessibilityRole="switch"
      accessibilityState={{checked: value, disabled: isDisabled}}
      disabled={isDisabled}
      onPress={() => {
        if (isDisabled) {
          return;
        }
        onValueChange?.(!value);
      }}
      style={({pressed}) => [
        styles.track,
        large && styles.trackLg,
        value ? (success ? styles.successOn : styles.on) : styles.off,
        locked && styles.locked,
        !locked && disabled && (value ? styles.disabledOn : styles.disabledOff),
        !isDisabled &&
          pressed &&
          (value
            ? success
              ? styles.successOnPressed
              : styles.onPressed
            : styles.offPressed),
      ]}>
      <View
        style={[
          styles.thumb,
          large && styles.thumbLg,
          locked && styles.thumbLocked,
          !locked && disabled && styles.thumbDisabled,
        ]}
      />
      {locked ? (
        <View
          pointerEvents="none"
          style={[styles.lockDash, large && styles.lockDashLg]}
        />
      ) : null}
    </TouchableOpacity>
  );
}
