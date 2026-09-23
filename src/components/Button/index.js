import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { useApp } from '../../context/AppContext';
import Icon from '../Icon';
import useThemedStyles from '../useThemedStyles';
import createStyles from './style';


export default function Button({
  title,
  children,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'md',
  fullWidth = true,
  icon,
  style,
  textStyle,
  activeOpacity = 0.7,
}) {
  const { colors } = useApp();
  const styles = useThemedStyles(createStyles);
  const isDisabled = disabled && !loading;
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';
  const isDanger = variant === 'danger';
  const isInverse = variant === 'inverse';

  const spinnerColor = isDisabled
    ? colors.disabledText
    : isOutline
      ? colors.navy[900]
      : isGhost
        ? colors.primary
        : colors.white;

  const iconColor = spinnerColor;

  const row = [styles.base, size === 'sm' ? styles.sm : styles.md];
  if (fullWidth) {
    row.push(styles.fullWidth);
  }
  if (isDisabled) {
    if (isGhost) {
      row.push(styles.disabledGhost);
    } else if (isOutline) {
      row.push(styles.disabledOutline);
    } else {
      row.push(styles.disabledFill);
    }
  } else if (isOutline) {
    row.push(styles.outline);
  } else if (isGhost) {
    row.push(styles.ghost);
  } else if (isDanger) {
    row.push(styles.danger);
  } else if (isInverse) {
    row.push(styles.inverse);
  } else {
    row.push(styles.primary);
  }
  if (style) {
    row.push(style);
  }

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      onPress={onPress}
      disabled={disabled || loading}
      style={row}>
      {loading ? (
        <ActivityIndicator color={spinnerColor} size="small" />
      ) : children ? (
        children
      ) : (
        <>
          {icon ? (
            typeof icon === 'string' ? (
              <Icon name={icon} color={iconColor} size={size === 'sm' ? 16 : 18} />
            ) : (
              icon
            )
          ) : null}
          {title ? (
            <Text
              style={[
                styles.label,
                size === 'sm' && styles.labelSm,
                isDisabled
                  ? styles.labelDisabled
                  : isOutline
                    ? styles.labelOutline
                    : isGhost
                      ? styles.labelGhost
                      : isInverse
                        ? styles.labelInverse
                        : styles.labelOnFill,
                textStyle,
              ]}>
              {title}
            </Text>
          ) : null}
        </>
      )}
    </TouchableOpacity>
  );
}
