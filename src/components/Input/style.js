import {StyleSheet} from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    wrap: {
      marginBottom: 16,
    },
    label: {
      color: colors.text,
      fontSize: 13,
      fontWeight: '600',
      marginBottom: 8,
    },
    labelDisabled: {
      color: colors.disabledText,
    },
    field: {
      minHeight: 52,
      borderRadius: 16,
      paddingHorizontal: 16,
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      flexDirection: 'row',
      alignItems: 'center',
    },
    fieldFocused: {
      borderColor: colors.focus,
    },
    fieldError: {
      borderColor: colors.danger,
    },
    fieldSuccess: {
      borderColor: colors.success,
    },
    fieldDisabled: {
      backgroundColor: colors.disabledBg,
      borderColor: colors.gray[200],
    },
    input: {
      flex: 1,
      color: colors.text,
      fontSize: 16,
      paddingVertical: 12,
    },
    inputDisabled: {
      color: colors.disabledText,
    },
    accessory: {
      marginLeft: 8,
    },
    left: {
      marginRight: 8,
    },
    hint: {
      color: colors.textMuted,
      fontSize: 12,
      flex: 1,
    },
    hintError: {
      color: colors.danger,
    },
    hintSuccess: {
      color: colors.success,
    },
    hintRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 6,
    },
  });
}
