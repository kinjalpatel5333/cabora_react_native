import {StyleSheet, Dimensions} from 'react-native';

const {width: SCREEN_W} = Dimensions.get('window');
const CIRCLE_SIZE = SCREEN_W * 0.82;

export default function createStyles(colors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    hero: {
      backgroundColor: colors.isDark ? colors.navy.darkBg2 : colors.green.soft,
      borderBottomLeftRadius: 36,
      borderBottomRightRadius: 36,
      overflow: 'hidden',
      alignItems: 'center',
      paddingHorizontal: 28,
      paddingBottom: 28,
      position: 'relative',
    },
    heroDomeCircle: {
      position: 'absolute',
      top: -CIRCLE_SIZE * 0.36,
      width: CIRCLE_SIZE,
      height: CIRCLE_SIZE,
      borderRadius: CIRCLE_SIZE / 2,
      backgroundColor: colors.isDark ? colors.alpha.green15 : '#D1FAE5',
      alignSelf: 'center',
      zIndex: 0,
    },
    heroInnerContent: {
      alignItems: 'center',
      zIndex: 1,
      width: '100%',
    },
    checkOuter: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.isDark ? colors.alpha.green25 : '#D1FAE5',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    checkInner: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.green[800],
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontFamily: colors.fonts.sora.extraBold,
      color: colors.isDark ? colors.green[400] : colors.green[800],
      fontSize: 28,
      textAlign: 'center',
      marginBottom: 8,
      letterSpacing: -0.3,
    },
    subtitle: {
      fontFamily: colors.fonts.sora.medium,
      color: colors.isDark ? colors.green.bright : colors.green[700],
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 20,
      paddingHorizontal: 8,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 22,
    },
    starsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginBottom: 22,
    },
    receiptCard: {
      backgroundColor: colors.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 14,
    },
    receiptHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
      marginBottom: 14,
    },
    receiptIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    receiptCopy: {
      flex: 1,
      minWidth: 0,
    },
    receiptTitle: {
      fontFamily: colors.fonts.sora.extraBold,
      color: colors.text,
      fontSize: 15,
      marginBottom: 3,
    },
    receiptSub: {
      fontFamily: colors.fonts.sora.medium,
      color: colors.muted,
      fontSize: 12,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
      marginBottom: 10,
    },
    fareRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
    },
    fareLabel: {
      fontFamily: colors.fonts.sora.medium,
      color: colors.muted,
      fontSize: 14,
    },
    fareValue: {
      fontFamily: colors.fonts.sora.bold,
      color: colors.text,
      fontSize: 14,
    },
    totalRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 10,
      paddingBottom: 6,
    },
    totalLabel: {
      fontFamily: colors.fonts.sora.extraBold,
      color: colors.text,
      fontSize: 16,
    },
    totalValue: {
      fontFamily: colors.fonts.sora.extraBold,
      color: colors.text,
      fontSize: 16,
    },
    actionRow: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 12,
    },
    actionBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingVertical: 11,
      paddingHorizontal: 6,
    },
    actionText: {
      fontFamily: colors.fonts.sora.bold,
      color: colors.text,
      fontSize: 12,
    },
    footer: {
      paddingHorizontal: 20,
      paddingTop: 12,
      backgroundColor: colors.background,
    },
    homeBtn: {
      backgroundColor: colors.orange[500],
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14,
    },
    homeText: {
      fontFamily: colors.fonts.sora.extraBold,
      color: colors.white,
      fontSize: 16,
    },
    rebookBtn: {
      alignItems: 'center',
      paddingVertical: 6,
    },
    rebookText: {
      fontFamily: colors.fonts.sora.bold,
      color: colors.orange[500],
      fontSize: 15,
    },
  });
}

