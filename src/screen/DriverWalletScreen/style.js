import { StyleSheet } from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.slate[50],
    },

    // Top Header
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: colors.slate[50],
      gap: 14,
    },
    menuBtn: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.black,
      shadowOpacity: 0.06,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '900',
      color: colors.slate[900],
    },

    scrollContent: {
      paddingBottom: 110,
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
      right: -35,
      top: -15,
      width: 170,
      height: 170,
      borderRadius: 85,
      backgroundColor: colors.alpha.white08,
    },
    navyKicker: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.navy[350],
      letterSpacing: 1.0,
      textTransform: 'uppercase',
    },
    navyAmount: {
      fontSize: 42,
      fontWeight: '900',
      color: colors.white,
      marginTop: 8,
      marginBottom: 8,
      letterSpacing: -1,
    },
    navySub: {
      fontSize: 13.5,
      fontWeight: '500',
      color: colors.navy[350],
      letterSpacing: 0.1,
    },

    // Withdraw Form Card (White)
    card: {
      backgroundColor: colors.white,
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
      fontSize: 11.5,
      fontWeight: '700',
      color: colors.slate[500],
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      marginBottom: 12,
    },

    // Amount Input Box
    inputBox: {
      borderWidth: 1.5,
      borderColor: colors.primary,
      borderRadius: 16,
      backgroundColor: colors.white,
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
      fontSize: 24,
      fontWeight: '900',
      color: colors.slate[900],
      marginRight: 2,
    },
    amountInput: {
      flex: 1,
      fontSize: 24,
      fontWeight: '900',
      color: colors.slate[900],
      paddingVertical: 0,
      paddingHorizontal: 0,
      margin: 0,
      letterSpacing: -0.5,
    },
    minLabel: {
      fontSize: 12.5,
      fontWeight: '600',
      color: colors.slate[400],
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
      backgroundColor: colors.slate[50],
      borderWidth: 1,
      borderColor: colors.slate[200],
      alignItems: 'center',
      justifyContent: 'center',
    },
    pillActive: {
      backgroundColor: colors.orange[175],
      borderWidth: 1.5,
      borderColor: colors.primary,
    },
    pillText: {
      fontSize: 13.5,
      fontWeight: '700',
      color: colors.slate[700],
    },
    pillTextActive: {
      color: colors.primary,
      fontWeight: '800',
    },

    // Bank Row
    bankRow: {
      backgroundColor: colors.slate[50],
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
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.slate[200],
      alignItems: 'center',
      justifyContent: 'center',
    },
    bankInfo: {
      flex: 1,
    },
    bankName: {
      fontSize: 14.5,
      fontWeight: '800',
      color: colors.slate[900],
    },
    bankVerified: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.green[600],
      marginTop: 2,
    },
    changeBtn: {
      paddingVertical: 6,
      paddingHorizontal: 8,
    },
    changeText: {
      fontSize: 13.5,
      fontWeight: '800',
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
      color: colors.white,
      fontSize: 15.5,
      fontWeight: '800',
    },

    // Payout History Section
    sectionTitle: {
      fontSize: 11.5,
      fontWeight: '700',
      color: colors.slate[500],
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      marginHorizontal: 16,
      marginTop: 22,
      marginBottom: 10,
    },
    historyCard: {
      backgroundColor: colors.white,
      borderRadius: 24,
      marginHorizontal: 16,
      paddingHorizontal: 16,
      shadowColor: colors.black,
      shadowOpacity: 0.04,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    historyItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 14,
    },
    historyItemBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.slate[100],
    },
    historyLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    historyIcon: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: 'center',
      justifyContent: 'center',
    },
    historyIconPaid: {
      backgroundColor: colors.green[200],
    },
    historyIconProcessing: {
      backgroundColor: colors.blue[50],
    },
    historyIconRefunded: {
      backgroundColor: colors.red[200],
    },
    historyTextCol: {
      flex: 1,
    },
    historyTitle: {
      fontSize: 14,
      fontWeight: '800',
      color: colors.slate[900],
    },
    historySubPaid: {
      fontSize: 12.5,
      fontWeight: '500',
      color: colors.slate[500],
      marginTop: 2,
    },
    historySubProcessing: {
      fontSize: 12.5,
      fontWeight: '500',
      color: colors.blue[550],
      marginTop: 2,
    },
    historySubRefunded: {
      fontSize: 12.5,
      fontWeight: '500',
      color: colors.red[600],
      marginTop: 2,
    },
    historyRight: {
      alignItems: 'flex-end',
      gap: 4,
    },
    historyAmount: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.slate[900],
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 12,
    },
    statusBadgePaid: {
      backgroundColor: colors.green[200],
    },
    statusBadgeProcessing: {
      backgroundColor: colors.blue[50],
    },
    statusBadgeRefunded: {
      backgroundColor: colors.red[200],
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    statusDotPaid: {
      backgroundColor: colors.green[600],
    },
    statusDotProcessing: {
      backgroundColor: colors.blue[550],
    },
    statusDotRefunded: {
      backgroundColor: colors.red[600],
    },
    statusTextPaid: {
      fontSize: 11.5,
      fontWeight: '800',
      color: colors.green[700],
    },
    statusTextProcessing: {
      fontSize: 11.5,
      fontWeight: '800',
      color: colors.blue[550],
    },
    statusTextRefunded: {
      fontSize: 11.5,
      fontWeight: '800',
      color: colors.red[600],
    },
  });
}
