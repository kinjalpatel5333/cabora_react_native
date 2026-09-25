import { StyleSheet } from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },

    // Header Bar
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.slate[100],
    },
    headerIconBtn: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 18,
      color: colors.text,
    },

    scrollContent: {
      paddingBottom: 40,
    },

    // Navy Earned Card
    navyCard: {
      backgroundColor: colors.navy[850],
      borderRadius: 24,
      padding: 22,
      marginHorizontal: 16,
      marginTop: 14,
      position: 'relative',
      overflow: 'hidden',
    },
    navyDeco: {
      position: 'absolute',
      right: -40,
      top: -15,
      width: 190,
      height: 190,
      borderRadius: 95,
      backgroundColor: colors.alpha.white08,
    },
    navyKicker: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 11,
      color: colors.navy[350],
      letterSpacing: 0.8,
      textTransform: 'uppercase',
    },
    navyAmount: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 38,
      color: colors.white,
      marginTop: 8,
      marginBottom: 6,
      letterSpacing: -0.5,
    },
    navySub: {
      fontFamily: colors.fonts.sora.medium,
      fontSize: 13,
      color: colors.navy[350],
    },

    // Section Titles
    sectionTitle: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 11.5,
      color: colors.textMuted,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      marginHorizontal: 16,
      marginTop: 22,
      marginBottom: 12,
    },

    // Active Card
    activeCard: {
      backgroundColor: colors.surface,
      borderRadius: 22,
      padding: 18,
      marginHorizontal: 16,
      marginBottom: 14,
      shadowColor: colors.black,
      shadowOpacity: 0.04,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    activeHead: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14,
    },
    activeLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    iconBox: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.orange[175],
      alignItems: 'center',
      justifyContent: 'center',
    },
    activeInfo: {
      flex: 1,
    },
    activeTitle: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 15,
      color: colors.text,
    },
    activeSub: {
      fontFamily: colors.fonts.sora.medium,
      fontSize: 12.5,
      color: colors.textMuted,
      marginTop: 2,
    },
    amberPill: {
      backgroundColor: colors.amber[100],
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    amberDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.amber[600],
    },
    amberText: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 11.5,
      color: colors.amber[700],
    },
    progressMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    progressCount: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 17,
      color: colors.text,
    },
    rewardText: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 13.5,
      color: colors.primary,
    },
    track: {
      height: 8,
      backgroundColor: colors.background,
      borderRadius: 4,
      marginVertical: 10,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 4,
    },
    cardBottomHint: {
      fontFamily: colors.fonts.sora.medium,
      fontSize: 12.5,
      color: colors.textMuted,
    },

    // Completed List Card
    completedCard: {
      backgroundColor: colors.surface,
      borderRadius: 22,
      marginHorizontal: 16,
      paddingHorizontal: 16,
      shadowColor: colors.black,
      shadowOpacity: 0.04,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    completedItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 14,
    },
    itemBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.slate[100],
    },
    itemLeft: {
      flex: 1,
    },
    itemTitle: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 14.5,
      color: colors.text,
    },
    itemDate: {
      fontFamily: colors.fonts.sora.medium,
      fontSize: 12.5,
      color: colors.textMuted,
      marginTop: 2,
    },
    itemRight: {
      alignItems: 'flex-end',
      gap: 4,
    },
    itemAmount: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 14.5,
      color: colors.green[700],
    },
    itemAmountPending: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 14.5,
      color: colors.text,
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 12,
    },
    badgePaid: {
      backgroundColor: colors.green[200],
    },
    badgeProcessing: {
      backgroundColor: colors.blue[50],
    },
    statusDotPaid: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.green[600],
    },
    statusDotProcessing: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.blue[550],
    },
    statusTextPaid: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 11.5,
      color: colors.green[700],
    },
    statusTextProcessing: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 11.5,
      color: colors.blue[550],
    },
  });
}
