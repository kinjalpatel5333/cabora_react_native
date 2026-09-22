import React from 'react';
import {ActivityIndicator, Pressable, Text} from 'react-native';
import {useApp} from '../../context/AppContext';
import Icon from '../Icon';
import useThemedStyles from '../useThemedStyles';
import createStyles from './style';
import colors from '../../config/color';

export default function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'md',
  fullWidth = true,
  icon,
  style,
}) {
  const {colors} = useApp();
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

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{disabled: disabled || loading, busy: loading}}
      onPress={onPress}
      disabled={disabled || loading}
      style={({pressed}) => {
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
          row.push(styles.outline, pressed && styles.outlinePressed);
        } else if (isGhost) {
          row.push(styles.ghost, pressed && styles.ghostPressed);
        } else if (isDanger) {
          row.push(styles.danger, pressed && styles.dangerPressed);
        } else if (isInverse) {
          row.push(styles.inverse, pressed && styles.inversePressed);
        } else {
          row.push(styles.primary, pressed && styles.primaryPressed);
        }
        if (style) {
          row.push(style);
        }
        return row;
      }}>
      {loading ? (
        <ActivityIndicator color={spinnerColor} size="small" />
      ) : icon ? (
        typeof icon === 'string' ? (
          <Icon name={icon} color={iconColor} size={size === 'sm' ? 16 : 18} />
        ) : (
          icon
        )
      ) : null}
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
        ]}>
        {title}
      </Text>
    </Pressable>
  );
}
