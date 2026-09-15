import {StyleSheet} from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.white,
    },
    hero: {
      backgroundColor: colors.navy[900],
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
    logo: {
      width: 44,
      height: 44,
      marginBottom: 18,
    },
    badge: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: 'rgba(255, 140, 60, 0.12)',
      borderWidth: 1,
      borderColor: 'rgba(255, 140, 60, 0.32)',
      marginBottom: 16,
    },
    badgeLabel: {
      color: colors.orange[400],
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 0.8,
    },
    title: {
      color: colors.white,
      fontSize: 32,
      fontWeight: '800',
      lineHeight: 38,
      letterSpacing: -0.4,
    },
    subtitle: {
      color: 'rgba(195, 207, 223, 0.92)',
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
    },
    phoneField: {
      height: 60,
      minHeight: 60,
      borderRadius: 18,
      paddingHorizontal: 8,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: colors.navy[200],
    },
    phoneInput: {
      fontSize: 18,
      paddingVertical: 0,
      color: colors.navy[900],
    },
    prefix: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    dial: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 44,
      backgroundColor: colors.navy[50],
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
      color: colors.navy[900],
      fontSize: 16,
      fontWeight: '800',
    },
    dialDivider: {
      width: 1,
      height: 24,
      backgroundColor: colors.navy[200],
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
      backgroundColor: '#FDECEC',
    },
    bannerCooldown: {
      backgroundColor: '#FFF6E5',
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
      fontSize: 14,
      fontWeight: '700',
      marginBottom: 4,
    },
    bannerTitleBlocked: {
      color: colors.red[600],
    },
    bannerTitleCooldown: {
      color: '#C17A1A',
    },
    bannerBody: {
      fontSize: 13,
      lineHeight: 20,
      fontWeight: '400',
    },
    bannerBodyBlocked: {
      color: colors.red[500],
    },
    bannerBodyCooldown: {
      color: '#C17A1A',
    },
    cooldownHint: {
      fontSize: 14,
      lineHeight: 20,
      color: '#8B95A6',
    },
    support: {
      marginTop: 10,
      color: colors.navy[900],
      fontSize: 13,
      fontWeight: '700',
    },
    actions: {
      paddingTop: 24,
      paddingBottom: 8,
    },
    terms: {
      marginTop: 16,
      color: '#8B95A6',
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400',
      letterSpacing: 0,
      textAlign: 'center',
    },
    termsBrand: {
      color: colors.navy[700],
      fontSize: 14,
      lineHeight: 14,
      fontWeight: '600',
      letterSpacing: 0,
    },
    termsLink: {
      color: colors.primary,
      fontSize: 14,
      lineHeight: 14,
      fontWeight: '600',
    },
  });
}
