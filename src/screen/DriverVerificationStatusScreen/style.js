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
      fontFamily: colors.fonts.sora.bold,
      fontSize: 18,
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
      fontFamily: colors.fonts.sora.semiBold,
      fontSize: 12,
      color: colors.gray[600],
    },
    toggleTabTextActive: {
      fontFamily: colors.fonts.sora.extraBold,
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
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 17,
      color: colors.amber[900],
    },
    statusTitleRejected: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 17,
      color: '#991B1B',
    },
    statusSubtextProgress: {
      fontFamily: colors.fonts.sora.regular,
      fontSize: 12,
      color: colors.amber[800],
      marginTop: 2,
    },
    statusSubtextRejected: {
      fontFamily: colors.fonts.sora.regular,
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
      fontFamily: colors.fonts.sora.bold,
      fontSize: 11,
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
      fontFamily: colors.fonts.sora.bold,
      fontSize: 11,
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
      fontFamily: colors.fonts.sora.bold,
      fontSize: 11,
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
      fontFamily: colors.fonts.sora.bold,
      fontSize: 11,
      color: colors.gray[700],
    },

    // Timeline Card
    sectionCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sectionHeader: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 12,
      color: '#64748B',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      marginBottom: 18,
    },
    sectionHeaderRed: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 12,
      color: colors.danger,
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      marginBottom: 18,
    },

    // Timeline Section
    timelineContainer: {
      marginTop: 6,
    },
    timelineRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      position: 'relative',
    },
    timelineIndicatorWrap: {
      width: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
      position: 'relative',
      height: 20,
    },
    timelineDotDone: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: '#22C55E',
      zIndex: 2,
    },
    timelineDotActive: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2.5,
      borderColor: '#F97316',
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2,
    },
    timelineDotActiveInner: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#F97316',
    },
    timelineDotPending: {
      width: 16,
      height: 16,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: '#CBD5E1',
      backgroundColor: '#FFFFFF',
      zIndex: 2,
    },
    timelineLine: {
      position: 'absolute',
      top: 10,
      bottom: -22,
      width: 2.5,
      backgroundColor: '#E2E8F0',
      left: 10.75,
      zIndex: 1,
    },
    timelineLineDone: {
      backgroundColor: '#22C55E',
    },
    timelineCopy: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    timelineTitle: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 15,
      color: colors.text,
    },
    timelineTitlePending: {
      fontFamily: colors.fonts.sora.medium,
      fontSize: 15,
      color: '#64748B',
    },
    timelineTime: {
      fontFamily: colors.fonts.sora.regular,
      fontSize: 13.5,
      color: '#64748B',
    },
    timelineTimeActive: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 13.5,
      color: '#EA580C',
    },
    timelineTimePending: {
      fontFamily: colors.fonts.sora.regular,
      fontSize: 13.5,
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
      fontFamily: colors.fonts.sora.semiBold,
      fontSize: 14,
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
      fontFamily: colors.fonts.sora.bold,
      fontSize: 11,
      color: colors.green[700],
    },
    pillOrange: {
      backgroundColor: colors.orange.subtleBg,
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 10,
    },
    pillOrangeText: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 11,
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
      fontFamily: colors.fonts.sora.bold,
      fontSize: 14,
      color: colors.text,
      marginBottom: 2,
    },
    fixItemReason: {
      fontFamily: colors.fonts.sora.regular,
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
      fontFamily: colors.fonts.sora.bold,
      fontSize: 12,
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
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 13,
      color: colors.green[900],
      marginBottom: 2,
    },
    everythingElseText: {
      fontFamily: colors.fonts.sora.regular,
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
      fontFamily: colors.fonts.sora.regular,
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
      fontFamily: colors.fonts.sora.regular,
      fontSize: 13,
      color: colors.gray[600],
    },
    appealBtnText: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 13,
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
      fontFamily: colors.fonts.sora.regular,
      flex: 1,
      fontSize: 13.5,
      color: colors.gray[600],
      lineHeight: 19,
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
    },
    btnBackText: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 15,
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
      fontFamily: colors.fonts.sora.bold,
      fontSize: 15,
      color: colors.text,
    },
    btnFixSubmit: {
      flex: 1.8,
      height: 52,
    },
    btnFixSubmitText: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 15,
      color: colors.white,
    },
  });
}
