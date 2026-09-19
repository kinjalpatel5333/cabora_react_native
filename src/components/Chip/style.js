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
      borderColor: colors.gray[300],
    },
    idlePressed: {
      backgroundColor: colors.gray[50],
    },
    selected: {
      backgroundColor: colors.orange[50],
      borderColor: colors.primary,
    },
    selectedPressed: {
      backgroundColor: colors.orange[100],
    },
    disabled: {
      backgroundColor: colors.disabledBg,
      borderColor: colors.disabledBg,
    },
    label: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 14,
      fontWeight: '700',
    },
    labelIdle: {
      color: colors.navy[800],
    },
    labelSelected: {
      color: colors.primary,
    },
    labelDisabled: {
      color: colors.disabledText,
    },
  });
}
