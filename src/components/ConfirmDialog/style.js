import {StyleSheet} from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 28,
      backgroundColor: 'rgba(0, 0, 0, 0.58)',
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
    },
    card: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: colors.card,
      borderRadius: 28,
      paddingHorizontal: 22,
      paddingTop: 28,
      paddingBottom: 22,
      alignItems: 'center',
      zIndex: 2,
      elevation: 24,
      shadowColor: colors.navy[900],
      shadowOpacity: 0.22,
      shadowRadius: 24,
      shadowOffset: {width: 0, height: 10},
    },
    iconWrap: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    iconWrapDefault: {
      backgroundColor: colors.isDark ? 'rgba(255, 112, 6, 0.18)' : colors.orange[100],
    },
    iconWrapDanger: {
      backgroundColor: colors.isDark ? 'rgba(239, 68, 68, 0.18)' : colors.red[100],
    },
    title: {
      fontFamily: colors.fonts.sora.extraBold,
      color: colors.navy[900],
      fontSize: 22,
      fontWeight: '800',
      textAlign: 'center',
      marginBottom: 10,
    },
    message: {
      fontFamily: colors.fonts.sora.medium,
      color: colors.gray[500],
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 21,
      textAlign: 'center',
      marginBottom: 22,
    },
    primaryBtn: {
      width: '100%',
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14,
    },
    primaryBtnDefault: {
      backgroundColor: colors.orange[500],
    },
    primaryBtnDanger: {
      backgroundColor: colors.red[500],
    },
    primaryText: {
      fontFamily: colors.fonts.sora.extraBold,
      color: colors.white,
      fontSize: 16,
      fontWeight: '800',
    },
    secondaryBtn: {
      paddingVertical: 6,
      paddingHorizontal: 8,
    },
    secondaryText: {
      fontFamily: colors.fonts.sora.bold,
      color: colors.orange[600],
      fontSize: 15,
      fontWeight: '700',
    },
  });
}

