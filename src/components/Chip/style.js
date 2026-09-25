import {StyleSheet} from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    base: {
      minHeight: 36,
      paddingHorizontal: 16,
      borderRadius: 18,
      borderWidth: 1.5,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-start',
    },
    idle: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    idlePressed: {
      backgroundColor: colors.card,
    },
    selected: {
      backgroundColor: colors.isDark ? colors.alpha.orange15 : colors.orange[50],
      borderColor: colors.primary,
    },
    selectedPressed: {
      backgroundColor: colors.isDark ? colors.alpha.orange25 : colors.orange[100],
    },
    disabled: {
      backgroundColor: colors.disabledBg,
      borderColor: colors.disabledBg,
    },
    label: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 14,
    },
    labelIdle: {
      color: colors.text,
    },
    labelSelected: {
      color: colors.primary,
    },
    labelDisabled: {
      color: colors.disabledText,
    },
  });
}
