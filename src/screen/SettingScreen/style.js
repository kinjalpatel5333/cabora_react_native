import {StyleSheet} from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    kicker: {
      fontFamily: colors.fonts.sora.extraBold,
      color: colors.primary,
      fontSize: 12,
      letterSpacing: 1.4,
      marginTop: 8,
      marginBottom: 8,
    },
    title: {
      fontFamily: colors.fonts.sora.extraBold,
      color: colors.text,
      fontSize: 28,
      marginBottom: 18,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 20,
    },
    row: {
      minHeight: 64,
      paddingHorizontal: 18,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    rowLast: {
      borderBottomWidth: 0,
    },
    rowText: {
      flex: 1,
      paddingRight: 12,
    },
    label: {
      fontFamily: colors.fonts.sora.bold,
      color: colors.text,
      fontSize: 16,
    },
    hint: {
      fontFamily: colors.fonts.sora.regular,
      color: colors.textMuted,
      fontSize: 13,
      marginTop: 4,
    },
  });
}
