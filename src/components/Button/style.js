import {StyleSheet} from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    base: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    md: {
      minHeight: 52,
      paddingHorizontal: 20,
      borderRadius: 18,
    },
    sm: {
      minHeight: 20,
      paddingHorizontal: 16,
      borderRadius: 10,
    },
    fullWidth: {
      alignSelf: 'stretch',
    },
    primary: {
      backgroundColor: colors.primary,
    },
    primaryPressed: {
      backgroundColor: colors.primaryDark,
    },
    outline: {
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.isDark ? colors.border : colors.navy[800],
    },
    outlinePressed: {
      backgroundColor: colors.isDark ? colors.card : colors.navy[25],
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    ghostPressed: {
      backgroundColor: colors.isDark ? 'rgba(255,112,6,0.15)' : colors.orange[50],
    },
    danger: {
      backgroundColor: colors.danger,
    },
    dangerPressed: {
      backgroundColor: colors.red[600],
    },
    inverse: {
      backgroundColor: 'rgba(255, 255, 255, 0.10)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.22)',
    },
    inversePressed: {
      backgroundColor: 'rgba(255, 255, 255, 0.16)',
    },
    disabledFill: {
      backgroundColor: colors.disabledBg || colors.gray[100],
      borderWidth: 0,
    },
    disabledOutline: {
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    disabledGhost: {
      backgroundColor: 'transparent',
    },
    label: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 16,
      fontWeight: '700',
    },
    labelSm: {
      fontFamily: colors.fonts.sora.regular,
      fontSize: 14,
    },
    labelOnFill: {
      color: colors.white,
    },
    labelOutline: {
      color: colors.text,
    },
    labelGhost: {
      color: colors.primary,
    },
    labelInverse: {
      color: colors.white,
    },
    labelDisabled: {
      color: colors.disabledText || colors.muted,
    },
  });
}
