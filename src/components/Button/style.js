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
      borderColor: colors.navy[800],
    },
    outlinePressed: {
      backgroundColor: colors.navy[25],
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    ghostPressed: {
      backgroundColor: colors.orange[50],
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
      backgroundColor: colors.navy[100],
      borderWidth: 0,
    },
    disabledOutline: {
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.gray[200],
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
      color: colors.navy[900],
    },
    labelGhost: {
      color: colors.primary,
    },
    labelInverse: {
      color: colors.white,
    },
    labelDisabled: {
      color: colors.navy[400],
    },
  });
}
