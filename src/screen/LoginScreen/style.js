import { StyleSheet } from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    hero: {
      backgroundColor: colors.inputText,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      paddingHorizontal: 24,
      paddingBottom: 28,
      overflow: 'hidden',
    },
    glow: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 200,
      height: 240,
    },
    logoContainer: {
      width: 44,
      height: 44,
      borderRadius: 12,
      // backgroundColor: colors.navy[850] || '#0F1E36',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      marginBottom: 18,
    },
    logoImage: {
      width: 40,
      height: 40,
    },
    badge: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingTop: 6,
      paddingBottom: 6,
      paddingLeft: 12,
      paddingRight: 14,
      borderRadius: 999,
      backgroundColor: colors.alpha.orange18,
      marginBottom: 16,
    },
    badgeLabel: {
      fontFamily: colors.fonts.sora.semiBold,
      color: colors.orange[425],
      fontSize: 11,
      lineHeight: 14,
      letterSpacing: 0.88,
    },
    title: {
      fontFamily: colors.fonts.sora.bold,
      color: colors.white,
      fontSize: 28,
      lineHeight: 34,
      letterSpacing: -0.28,
    },
    subtitle: {
      fontFamily: colors.fonts.sora.regular,
      color: colors.alpha.slateAlpha92,
      fontSize: 14,
      lineHeight: 21,
      marginTop: 10,
      maxWidth: 320,
    },
    body: {
      flex: 1,
    },
    scroll: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingTop: 28,
    },
    form: {
      flexGrow: 1,
      marginTop: 10,
    },
    phoneField: {
      height: 60,
      minHeight: 60,
      borderRadius: 18,
      paddingHorizontal: 8,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    phoneInput: {
      fontFamily: colors.fonts.sora.semiBold,
      fontSize: 18,
      lineHeight: 22,
      letterSpacing: 0,
      paddingVertical: 0,
      color: colors.text,
    },
    prefix: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    dial: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 44,
      backgroundColor: colors.isDark ? colors.surface : colors.gray[100],
      borderWidth: colors.isDark ? 1 : 0,
      borderColor: colors.border,
      borderRadius: 16,
      paddingHorizontal: 12,
      gap: 8,
    },
    flag: {
      width: 26,
      height: 18,
      borderRadius: 4,
    },
    dialCode: {
      fontFamily: colors.fonts.sora.extraBold,
      color: colors.text,
      fontSize: 16,
    },
    dialDivider: {
      width: 1,
      height: 24,
      backgroundColor: colors.border,
      marginLeft: 10,
      marginRight: 8,
    },
    lockIcon: {
      width: 22,
      height: 22,
    },
    banner: {
      borderRadius: 18,
      padding: 16,
      marginTop: 14,
    },
    bannerBlocked: {
      backgroundColor: colors.isDark ? colors.alpha.red18 : colors.red[100],
    },
    bannerCooldown: {
      backgroundColor: colors.isDark ? colors.alpha.amber18 : colors.orange.warningBg,
    },
    bannerRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },
    bannerCopy: {
      flex: 1,
    },
    bannerTitle: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 14,
      marginBottom: 4,
    },
    bannerTitleBlocked: {
      color: colors.isDark ? colors.red[350] : colors.red[600],
    },
    bannerTitleCooldown: {
      color: colors.isDark ? colors.amber[200] : colors.orange.amberText,
    },
    bannerBody: {
      fontFamily: colors.fonts.sora.regular,
      fontSize: 13,
      lineHeight: 20,
    },
    bannerBodyBlocked: {
      color: colors.isDark ? colors.red[350] : colors.red[500],
    },
    bannerBodyCooldown: {
      color: colors.isDark ? colors.amber[200] : colors.orange.amberText,
    },
    cooldownHint: {
      fontFamily: colors.fonts.sora.regular,
      fontSize: 14,
      lineHeight: 20,
      color: colors.muted,
    },
    support: {
      fontFamily: colors.fonts.sora.bold,
      marginTop: 10,
      color: colors.text,
      fontSize: 13,
    },
    actions: {
      paddingTop: 20,
      paddingBottom: 4,
    },
    terms: {
      fontFamily: colors.fonts.sora.regular,
      marginTop: 14,
      color: colors.muted,
      fontSize: 12,
      lineHeight: 18,
      letterSpacing: 0,
      textAlign: 'center',
    },
    termsBrand: {
      fontFamily: colors.fonts.sora.semiBold,
      color: colors.text,
      fontSize: 12,
    },
    termsLink: {
      fontFamily: colors.fonts.sora.semiBold,
      color: colors.orange[500],
      fontSize: 12,
    },
  });
}
