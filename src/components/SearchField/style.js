import {StyleSheet} from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    field: {
      minHeight: 48,
      borderRadius: 24,
      paddingHorizontal: 16,
      borderWidth: 1.5,
      borderColor: 'transparent',
      backgroundColor: colors.gray[100],
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    fieldFocused: {
      backgroundColor: colors.surface,
      borderColor: colors.focus,
    },
    fieldFilled: {
      backgroundColor: colors.surface,
      borderColor: colors.gray[200],
    },
    fieldDisabled: {
      backgroundColor: colors.disabledBg,
      borderColor: 'transparent',
    },
    input: {
      fontFamily: colors.fonts.sora.regular,
      flex: 1,
      color: colors.text,
      fontSize: 16,
      paddingVertical: 10,
    },
    inputDisabled: {
      color: colors.disabledText,
    },
    clearBtn: {
      width: 22,
      height: 22,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
