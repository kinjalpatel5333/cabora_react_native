import { fonts } from '../../config/typography';
import { StyleSheet } from 'react-native';
import colors from '../../config/color';

export default function createStyles(colors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    profile: {
      paddingHorizontal: 20,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginBottom: 10,
    },
    name: {
      fontFamily: fonts.sora.extraBold,
      color: colors.text,
      fontSize: 18,
      fontWeight: '800',
    },
    email: {
      fontFamily: fonts.sora.regular,
      color: colors.textMuted,
      fontSize: 13,
      marginTop: 2,
    },
    scrollItems: {
      paddingTop: 10,
      paddingHorizontal: 12,
      paddingBottom: 16,
    },
    scrollView: {
      flex: 1,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 14,
      paddingVertical: 10,
      paddingHorizontal: 10,
      marginBottom: 4,
    },
    itemActive: {
      backgroundColor: colors.isDark ? colors.alpha.orange22 : colors.orange[175],
    },
    iconBox: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.isDark ? colors.navy[800] : colors.slate[50],
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconBoxActive: {
      backgroundColor: colors.isDark ? colors.alpha.orange30 : colors.orange[250],
    },
    itemLabel: {
      fontFamily: fonts.sora.bold,
      marginLeft: 12,
      color: colors.text,
      fontSize: 15,
      fontWeight: '700',
    },
    itemLabelActive: {
      fontFamily: fonts.sora.extraBold,
      color: colors.primary,
      fontWeight: '800',
    },
    footer: {
      paddingHorizontal: 16,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
    },
    themeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
      paddingHorizontal: 2,
      marginBottom: 10,
    },
    themeLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    themeIconBox: {
      width: 34,
      height: 34,
      borderRadius: 10,
      backgroundColor: colors.isDark ? colors.navy[800] : colors.slate[50],
      alignItems: 'center',
      justifyContent: 'center',
    },
    themeTextWrap: {
      marginLeft: 12,
    },
    themeLabel: {
      fontFamily: fonts.sora.bold,
      color: colors.text,
      fontSize: 14,
      fontWeight: '700',
    },
    themeSub: {
      fontFamily: fonts.sora.regular,
      color: colors.textMuted,
      fontSize: 12,
      marginTop: 1,
    },
    logoutBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.isDark ? colors.alpha.red18 : colors.red[50],
      borderRadius: 14,
      paddingVertical: 12,
      paddingHorizontal: 14,
    },
    logoutIconBox: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: colors.isDark ? colors.alpha.red25 : colors.red[100],
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    logoutText: {
      fontFamily: fonts.sora.bold,
      color: colors.isDark ? colors.red[400] : colors.red[600],
      fontSize: 15,
      fontWeight: '700',
    },
  });
}
