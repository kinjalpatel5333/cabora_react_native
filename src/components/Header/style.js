import { StyleSheet } from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    wrap: {
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingHorizontal: 16,
      paddingBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    transparentWrap: {
      backgroundColor: 'transparent',
    },
    noBorderWrap: {
      borderBottomWidth: 0,
    },
    titleWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 8,
    },
    title: {
      fontFamily: colors.fonts.sora.bold,
      color: colors.text,
      fontSize: 18,
      fontWeight: '700',
      textAlign: 'center',
    },
    subtitle: {
      fontFamily: colors.fonts.sora.regular,
      color: colors.muted,
      fontSize: 12,
      marginTop: 2,
      textAlign: 'center',
    },
    iconBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      borderWidth: colors.isDark ? 1 : 0,
      borderColor: colors.border,
    },
    menuIcon: {
      width: 32,
      height: 32,
      borderRadius: 8,
      tintColor: colors.isDark ? colors.white : undefined,
    },
    iconPlaceholder: {
      width: 40,
      height: 40,
    },
  });
}
