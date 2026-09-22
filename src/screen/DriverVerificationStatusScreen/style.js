import { StyleSheet } from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.card,
    },
    headerBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
    },

    scroll: {
      padding: 20,
    },

    // Mode Toggle Bar (For easy testing of In Progress vs Rejected state)
    toggleBar: {
      flexDirection: 'row',
      backgroundColor: colors.gray[100],
      borderRadius: 20,
      padding: 4,
      marginBottom: 16,
    },
    toggleTab: {
      flex: 1,
      paddingVertical: 8,
      alignItems: 'center',
      borderRadius: 16,
    },
    toggleTabActive: {
      backgroundColor: colors.card,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    toggleTabText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.gray[600],
    },
    toggleTabTextActive: {
      fontWeight: '800',
      color: colors.orange[600],
    },

    // Status Banner Cards
    statusCardInProgress: {
      backgroundColor: colors.orange.subtleBg,
      borderRadius: 18,
      padding: 18,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.amber[200],
    },
    statusCardRejected: {
      backgroundColor: '#FFF1F2',
      borderRadius: 18,
      padding: 18,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: '#FECDD3',
    },
    statusTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    statusIconWrapProgress: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    },
    statusIconWrapRejected: {
      width: 48,
      height: 48,
      borderRadius: 16,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    },
    statusTitleProgress: {
      fontSize: 17,
      fontWeight: '800',
      color: colors.amber[900],
    },
    statusTitleRejected: {
      fontSize: 17,
      fontWeight: '800',
      color: '#991B1B',
    },
    statusSubtextProgress: {
      fontSize: 12,
      color: colors.amber[800],
      marginTop: 2,
    },
    statusSubtextRejected: {
      fontSize: 12,
      color: '#9F1239',
      marginTop: 2,
    },
    statusDividerProgress: {
      height: 1,
      backgroundColor: colors.amber[200],
      marginBottom: 14,
    },
    statusDividerRejected: {
      height: 1,
      backgroundColor: '#FECDD3',
      marginBottom: 14,
    },
    pillsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    pillCol: {
      flex: 1,
    },
    pillLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.gray[500],
      marginBottom: 4,
    },
    pillValueReview: {
      alignSelf: 'flex-start',
      backgroundColor: colors.orange.accentBg,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    pillValueReviewText: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.amber[800],
    },
    pillValueRejected: {
      alignSelf: 'flex-start',
      backgroundColor: colors.red.badge,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    pillValueRejectedText: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.danger,
    },
    pillValueGray: {
      alignSelf: 'flex-start',
      backgroundColor: colors.gray[200],
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    pillValueGrayText: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.gray[700],
    },

    // Timeline Card
    sectionCard: {
      backgroundColor: colors.card,
      borderRadius: 18,
      padding: 18,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sectionHeader: {
      fontSize: 11,
      fontWeight: '800',
      color: colors.gray[500],
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      marginBottom: 14,
    },
    sectionHeaderRed: {
      fontSize: 11,
      fontWeight: '800',
      color: colors.danger,
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      marginBottom: 14,
    },

    // Timeline Row
    timelineRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 16,
      position: 'relative',
    },
    timelineIndicatorWrap: {
      alignItems: 'center',
      marginRight: 14,
      width: 20,
    },
    timelineDotDone: {
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: '#16A34A',
    },
    timelineDotActive: {
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: 3.5,
      borderColor: '#EA580C',
      backgroundColor: '#FFFFFF',
    },
    timelineDotPending: {
      width: 16,
      height: 16,
      borderRadius: 8,
      borderWidth: 2.5,
      borderColor: '#CBD5E1',
      backgroundColor: '#FFFFFF',
    },
    timelineLine: {
      width: 2,
      height: 26,
      backgroundColor: '#E2E8F0',
      marginTop: 4,
    },
    timelineLineDone: {
      backgroundColor: '#16A34A',
    },
    timelineCopy: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    timelineTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
    },
    timelineTitlePending: {
      fontSize: 14,
      fontWeight: '500',
      color: '#64748B',
    },
    timelineTime: {
      fontSize: 12.5,
      color: '#64748B',
    },
    timelineTimeActive: {
      fontSize: 12.5,
      fontWeight: '700',
      color: '#EA580C',
    },
    timelineTimePending: {
      fontSize: 12.5,
      color: '#94A3B8',
    },

    // Checking List Rows
    checkItemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
      gap: 10,
    },
    checkItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      marginLeft: 10,
    },
    checkItemTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginLeft: 10,
    },

    // Status Pills
    pillGreen: {
      backgroundColor: colors.green.mint,
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 10,
    },
    pillGreenText: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.green[700],
    },
    pillOrange: {
      backgroundColor: colors.orange.subtleBg,
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 10,
    },
    pillOrangeText: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.amber[800],
    },

    // Rejection Fix Cards
    fixItemCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: colors.red.light,
      borderRadius: 14,
      padding: 14,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.red.badge,
    },
    fixItemIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#FEE2E2',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
      marginTop: 2,
    },
    fixItemContent: {
      flex: 1,
    },
    fixItemTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 2,
    },
    fixItemReason: {
      fontSize: 12.5,
      color: colors.gray[600],
      lineHeight: 17,
      marginBottom: 10,
    },
    fixBtn: {
      alignSelf: 'flex-end',
      backgroundColor: colors.orange.accentBg,
      paddingHorizontal: 14,
      paddingVertical: 5,
      borderRadius: 12,
    },
    fixBtnText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.orange[700],
    },

    // Accepted Banner (Green)
    everythingElseAcceptedBox: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: colors.green.mint,
      borderRadius: 14,
      padding: 14,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.green[200],
    },
    everythingElseTitle: {
      fontSize: 13,
      fontWeight: '800',
      color: colors.green[900],
      marginBottom: 2,
    },
    everythingElseText: {
      fontSize: 12,
      color: colors.green[800],
      lineHeight: 16,
    },

    // What happens next list
    nextStepsList: {
      gap: 10,
    },
    nextStepRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    nextStepText: {
      fontSize: 13,
      color: colors.gray[700],
    },

    // Appeal Box
    appealBox: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 14,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    appealText: {
      fontSize: 13,
      color: colors.gray[600],
    },
    appealBtnText: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.orange[600],
    },

    // SMS / Push notification card
    infoCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      marginTop: 4,
      marginBottom: 20,
    },
    infoCardText: {
      flex: 1,
      fontSize: 13.5,
      color: colors.gray[600],
      lineHeight: 19,
      fontWeight: '400',
    },

    // Bottom Navigation Bar
    footer: {
      paddingHorizontal: 20,
      paddingTop: 14,
      backgroundColor: colors.card,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    footerTwoBtns: {
      flexDirection: 'row',
      gap: 12,
      justifyContent: 'space-between'
    },
    btnBack: {
      flex: 1,
      height: 52,
      paddingHorizontal: 20,
      borderRadius: 26,
      borderWidth: 1.5,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.card,
    },
    btnBackText: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.text,
    },
    btnSupportOutline: {
      width: '100%',
      height: 52,
      borderRadius: 26,
      borderWidth: 1.5,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.card,
    },
    btnSupportText: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.text,
    },
    btnFixSubmit: {
      flex: 1.8,
      height: 52,
      borderRadius: 26,
      backgroundColor: colors.orange[500],
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnFixSubmitText: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.white,
    },
  });
}
