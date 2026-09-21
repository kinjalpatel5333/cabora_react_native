import { StyleSheet } from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.slate[50],
    },

    // Header Bar
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.white,
      borderBottomWidth: 1,
      borderBottomColor: colors.navy[150],
    },
    headerBtn: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 18,
      fontWeight: '800',
      color: colors.slate[900],
    },

    scrollContent: {
      paddingBottom: 24,
    },

    // Top Earning Navy Card
    earningCard: {
      backgroundColor: colors.navy[850],
      borderRadius: 20,
      padding: 20,
      marginHorizontal: 16,
      marginTop: 14,
      position: 'relative',
      overflow: 'hidden',
    },
    earningCircleBg: {
      position: 'absolute',
      top: -40,
      right: -30,
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: colors.alpha.orange22,
    },
    earningLabel: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 11,
      fontWeight: '700',
      color: colors.navy[350],
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      marginBottom: 6,
      zIndex: 2,
    },
    earningAmount: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 36,
      fontWeight: '900',
      color: colors.white,
      marginBottom: 6,
      zIndex: 2,
    },
    earningSub: {
      fontFamily: colors.fonts.sora.medium,
      fontSize: 13,
      fontWeight: '500',
      color: colors.slate[300],
      zIndex: 2,
    },

    // Route Card
    routeCard: {
      backgroundColor: colors.white,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.slate[200],
      padding: 16,
      marginHorizontal: 16,
      marginTop: 12,
    },
    routeTopRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },
    routeIconWrap: {
      width: 32,
      height: 32,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    routeTextWrap: {
      flex: 1,
    },
    routeTitle: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 14.5,
      fontWeight: '800',
      color: colors.slate[900],
    },
    routeSub: {
      fontFamily: colors.fonts.sora.medium,
      fontSize: 12.5,
      fontWeight: '500',
      color: colors.slate[500],
      marginTop: 2,
    },
    cardDivider: {
      height: 1,
      backgroundColor: colors.slate[100],
      marginVertical: 12,
    },
    routeBottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    completedText: {
      fontFamily: colors.fonts.sora.medium,
      fontSize: 13,
      fontWeight: '500',
      color: colors.slate[500],
    },
    paidOnlineBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: colors.green[150],
      borderRadius: 20,
      paddingVertical: 4,
      paddingHorizontal: 10,
    },
    paidDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.green[600],
    },
    paidText: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 12,
      fontWeight: '700',
      color: colors.green[700],
    },

    // Section Header
    sectionHeader: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 11.5,
      fontWeight: '700',
      color: colors.slate[500],
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      marginHorizontal: 16,
      marginTop: 18,
      marginBottom: 8,
    },

    // Charges Breakdown Card
    chargesCard: {
      backgroundColor: colors.white,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.slate[200],
      padding: 16,
      marginHorizontal: 16,
    },
    chargeItem: {
      paddingVertical: 2,
    },
    chargeItemSpaced: {
      marginTop: 14,
    },
    chargeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    chargeName: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 14,
      fontWeight: '700',
      color: colors.slate[900],
    },
    chargeValue: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 15,
      fontWeight: '800',
      color: colors.slate[900],
    },
    chargeSub: {
      fontFamily: colors.fonts.sora.medium,
      fontSize: 12,
      fontWeight: '500',
      color: colors.slate[500],
      marginTop: 2,
    },

    // Added to Earnings Banner
    addedBanner: {
      backgroundColor: colors.orange[50],
      borderColor: colors.amber[300],
      borderWidth: 1,
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 16,
      marginTop: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    addedLeft: {
      flex: 1,
    },
    addedTitle: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 14,
      fontWeight: '800',
      color: colors.orange[850],
    },
    addedSub: {
      fontFamily: colors.fonts.sora.medium,
      fontSize: 12.5,
      fontWeight: '500',
      color: colors.orange[950],
      marginTop: 2,
    },
    addedAmount: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 22,
      fontWeight: '900',
      color: colors.orange[850],
    },

    // Tip Box
    tipBox: {
      backgroundColor: colors.white,
      borderColor: colors.slate[200],
      borderWidth: 1,
      borderRadius: 16,
      padding: 14,
      marginHorizontal: 16,
      marginTop: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    tipText: {
      fontFamily: colors.fonts.sora.medium,
      fontSize: 12.5,
      fontWeight: '500',
      color: colors.slate[500],
      flex: 1,
      lineHeight: 17,
    },

    // Fixed Footer
    footer: {
      backgroundColor: colors.white,
      borderTopWidth: 1,
      borderTopColor: colors.navy[150],
      paddingHorizontal: 16,
      paddingTop: 12,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 10,
    },
    doneBtn: {
      minHeight: 54,
      borderRadius: 16,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.primary,
      shadowOpacity: 0.3,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 5,
    },
    doneBtnText: {
      fontFamily: colors.fonts.sora.extraBold,
      color: colors.white,
      fontSize: 16,
      fontWeight: '800',
    },
  });
}
