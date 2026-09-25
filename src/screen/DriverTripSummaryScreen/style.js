import { StyleSheet } from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 24,
    },

    // Top Mint/Green Hero Area
    heroArea: {
      position: 'relative',
      backgroundColor: colors.green[250],
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingBottom: 28,
      overflow: 'hidden',
    },
    heroCircleBg: {
      position: 'absolute',
      top: -120,
      width: 320,
      height: 320,
      borderRadius: 160,
      backgroundColor: colors.green[350],
    },
    checkCircle: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: colors.green[450],
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14,
      marginTop: 6,
      zIndex: 2,
    },
    heroTitle: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 28,
      color: colors.green[900],
      marginBottom: 8,
      textAlign: 'center',
      zIndex: 2,
    },
    heroSub: {
      fontFamily: colors.fonts.sora.medium,
      fontSize: 14,
      color: colors.green[750],
      textAlign: 'center',
      lineHeight: 20,
      paddingHorizontal: 16,
      zIndex: 2,
    },

    // Trip route brief pill
    tripPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: colors.background,
      borderRadius: 14,
      paddingVertical: 11,
      paddingHorizontal: 14,
      marginHorizontal: 16,
      marginTop: 16,
    },
    tripPillText: {
      fontFamily: colors.fonts.sora.semiBold,
      flex: 1,
      fontSize: 13,
      color: colors.textSecondary,
    },

    // Passenger Pays Card
    card: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      marginHorizontal: 16,
      marginTop: 12,
    },
    cardHeader: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 11,
      color: colors.textMuted,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      marginBottom: 12,
    },
    cardRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    cardRowLabel: {
      fontFamily: colors.fonts.sora.medium,
      fontSize: 14,
      color: colors.textSecondary,
    },
    cardRowValue: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 15,
      color: colors.text,
    },
    promoLabel: {
      fontFamily: colors.fonts.sora.semiBold,
      fontSize: 14,
      color: colors.green[600],
    },
    promoValue: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 15,
      color: colors.green[600],
    },
    cardDivider: {
      height: 1,
      backgroundColor: colors.background,
      marginVertical: 6,
    },
    totalLabel: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 15,
      color: colors.text,
    },
    totalValue: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 18,
      color: colors.text,
    },

    // Your Earning Card (Navy)
    earningCard: {
      backgroundColor: colors.navy[850],
      borderRadius: 18,
      padding: 16,
      marginHorizontal: 16,
      marginTop: 12,
    },
    earningHeader: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 11,
      color: colors.navy[350],
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      marginBottom: 12,
    },
    earningLabel: {
      fontFamily: colors.fonts.sora.medium,
      fontSize: 14,
      color: colors.alpha.white75,
    },
    earningValue: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 15,
      color: colors.white,
    },
    commissionValue: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 15,
      color: colors.orange[425],
    },
    walletValue: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 15,
      color: colors.green[400],
    },
    earningDivider: {
      height: 1,
      backgroundColor: colors.alpha.white12,
      marginVertical: 8,
    },
    keepLabel: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 16,
      color: colors.white,
    },
    keepValue: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 22,
      color: colors.green[350] || colors.green[400],
    },

    // Fixed Bottom Action Section with top border and shadow
    actionSection: {
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.navy[150],
      paddingHorizontal: 16,
      paddingTop: 14,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 10,
    },
    confirmBtn: {
      minHeight: 54,
      borderRadius: 16,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.primary,
      shadowOpacity: 0.3,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 6,
      marginBottom: 12,
    },
    confirmBtnText: {
      fontFamily: colors.fonts.sora.extraBold,
      color: colors.white,
      fontSize: 16.5,
    },
    reportLink: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 4,
      marginBottom: 4,
    },
    reportLinkText: {
      fontFamily: colors.fonts.sora.semiBold,
      color: colors.textMuted,
      fontSize: 14,
    },
  });
}
