import { StyleSheet } from 'react-native';

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
      width: '100%',
    },
    primary: {
      backgroundColor: colors.primary,
      borderRadius: 16,
    },
    primaryPressed: {
      backgroundColor: colors.primaryDark,
      borderRadius: 16,
    },
    outline: {
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderRadius: 16,
      borderColor: colors.isDark ? colors.border : colors.navy[300],
    },
    outlinePressed: {
      backgroundColor: colors.isDark ? colors.card : colors.navy[25],
      borderRadius: 16,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderRadius: 16,
    },
    ghostPressed: {
      backgroundColor: colors.isDark ? colors.alpha.orange15 : colors.orange[50],
      borderRadius: 16,
    },
    danger: {
      backgroundColor: colors.danger,
      borderRadius: 16,
    },
    dangerPressed: {
      backgroundColor: colors.red[600],
      borderRadius: 16,
    },
    inverse: {
      backgroundColor: colors.alpha.white10,
      borderWidth: 1,
      borderColor: colors.alpha.white22,
      borderRadius: 16,
    },
    inversePressed: {
      backgroundColor: colors.alpha.white16,
      borderRadius: 16,
    },
    disabledFill: {
      backgroundColor: colors.isDark ? colors.navy[850] : colors.gray.lightgray,
      borderWidth: 0,
      borderRadius: 16,
    },
    disabledOutline: {
      backgroundColor: colors.isDark ? colors.navy[850] : colors.gray.lightgray,
      borderWidth: 0,
      borderRadius: 16,
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
      color: colors.isDark ? colors.navy[400] : '#A0ABC0',
    },
  });
}
