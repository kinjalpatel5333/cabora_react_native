import { StyleSheet } from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },

    // Top Header
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: colors.background,
      gap: 14,
    },
    menuBtn: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.black,
      shadowOpacity: 0.06,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    headerTitle: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 28,
      color: colors.text,
    },

    scrollContent: {
      paddingBottom: 150,
    },

    // Available to Withdraw Card (Navy)
    navyCard: {
      backgroundColor: colors.navy[850],
      borderRadius: 24,
      padding: 22,
      marginHorizontal: 16,
      marginTop: 8,
      position: 'relative',
      overflow: 'hidden',
    },
    navyDecoration: {
      position: 'absolute',
      right: -40,
      top: -40,
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: 'rgba(255, 112, 6, 0.18)',
    },
    navyKicker: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 12,
      color: colors.navy[350],
      letterSpacing: 1.0,
      textTransform: 'uppercase',
    },
    navyAmount: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 42,
      color: colors.white,
      marginTop: 8,
      marginBottom: 8,
      letterSpacing: -1,
    },
    navySub: {
      fontFamily: colors.fonts.sora.medium,
      fontSize: 13.5,
      color: colors.navy[350],
      letterSpacing: 0.1,
    },

    // Withdraw Form Card (White)
    card: {
      backgroundColor: colors.surface,
      borderRadius: 24,
      padding: 20,
      marginHorizontal: 16,
      marginTop: 14,
      shadowColor: colors.black,
      shadowOpacity: 0.04,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    cardKicker: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 11.5,
      color: colors.textMuted,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      marginBottom: 12,
    },

    // Amount Input Box
    inputBox: {
      borderWidth: 1.5,
      borderColor: colors.primary,
      borderRadius: 16,
      backgroundColor: colors.surface,
      paddingHorizontal: 16,
      paddingVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    amountDisplay: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginRight: 10,
    },
    currencySymbol: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 24,
      color: colors.text,
      marginRight: 2,
    },
    amountInput: {
      fontFamily: colors.fonts.sora.extraBold,
      flex: 1,
      fontSize: 24,
      color: colors.text,
      paddingVertical: 0,
      paddingHorizontal: 0,
      margin: 0,
      letterSpacing: -0.5,
    },
    minLabel: {
      fontFamily: colors.fonts.sora.semiBold,
      fontSize: 12.5,
      color: colors.textMuted,
    },

    // Quick Amount Pills
    pillsRow: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 14,
    },
    pill: {
      flex: 1,
      height: 42,
      borderRadius: 14,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pillActive: {
      backgroundColor: colors.orange[175],
      borderWidth: 1.5,
      borderColor: colors.primary,
    },
    pillText: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 13.5,
      color: colors.textSecondary,
    },
    pillTextActive: {
      fontFamily: colors.fonts.sora.extraBold,
      color: colors.primary,
    },

    // Bank Row
    bankRow: {
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 14,
      marginTop: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    bankLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    bankIconBox: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bankInfo: {
      flex: 1,
    },
    bankName: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 14.5,
      color: colors.text,
    },
    bankVerified: {
      fontFamily: colors.fonts.sora.semiBold,
      fontSize: 12,
      color: colors.green[600],
      marginTop: 2,
    },
    changeBtn: {
      paddingVertical: 6,
      paddingHorizontal: 8,
    },
    changeText: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 13.5,
      color: colors.primary,
    },

    // Withdraw Action Button
    withdrawBtn: {
      backgroundColor: colors.primary,
      height: 52,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 18,
      shadowColor: colors.primary,
      shadowOpacity: 0.2,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    withdrawBtnText: {
      fontFamily: colors.fonts.sora.extraBold,
      color: colors.white,
      fontSize: 15.5,
    },

    // Payout History Section
    sectionTitle: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 12,
      color: colors.textMuted,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      marginHorizontal: 16,
      marginTop: 22,
      marginBottom: 10,
    },
    historyCard: {
      backgroundColor: colors.surface,
      borderRadius: 24,
      marginHorizontal: 16,
      paddingHorizontal: 16,
      paddingVertical: 4,
      shadowColor: colors.black,
      shadowOpacity: 0.04,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    historyItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 14,
    },
    historyItemBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    historyLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
      marginRight: 10,
    },
    historyIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    historyIconPaid: {
      backgroundColor: 'rgba(0, 168, 107, 0.12)',
    },
    historyIconProcessing: {
      backgroundColor: 'rgba(41, 114, 250, 0.12)',
    },
    historyIconRefunded: {
      backgroundColor: 'rgba(239, 68, 68, 0.12)',
    },
    historyTextCol: {
      flex: 1,
    },
    historyTitle: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 14,
      color: colors.text,
      lineHeight: 19,
    },
    historySub: {
      fontFamily: colors.fonts.sora.medium,
      fontSize: 12.5,
      marginTop: 3,
    },
    historySubPaid: {
      color: '#00A86B',
    },
    historySubProcessing: {
      color: '#2972FA',
    },
    historySubRefunded: {
      color: '#EF4444',
    },
    historyRight: {
      alignItems: 'flex-end',
      justifyContent: 'center',
      gap: 6,
    },
    historyAmount: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 15.5,
      color: colors.text,
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
    },
    statusBadgePaid: {
      backgroundColor: 'rgba(0, 168, 107, 0.12)',
    },
    statusBadgeProcessing: {
      backgroundColor: 'rgba(41, 114, 250, 0.12)',
    },
    statusBadgeRefunded: {
      backgroundColor: 'rgba(239, 68, 68, 0.12)',
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    statusDotPaid: {
      backgroundColor: '#00A86B',
    },
    statusDotProcessing: {
      backgroundColor: '#2972FA',
    },
    statusDotRefunded: {
      backgroundColor: '#EF4444',
    },
    statusText: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 12,
    },
    statusTextPaid: {
      color: '#00A86B',
    },
    statusTextProcessing: {
      color: '#2972FA',
    },
    statusTextRefunded: {
      color: '#EF4444',
    },
  });
}
