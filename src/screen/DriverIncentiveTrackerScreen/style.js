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
      borderBottomColor: colors.slate[100],
    },
    headerIconBtn: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.slate[900],
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
      fontSize: 11,
      fontWeight: '700',
      color: colors.navy[350],
      letterSpacing: 0.8,
      textTransform: 'uppercase',
    },
    navyAmount: {
      fontSize: 38,
      fontWeight: '900',
      color: colors.white,
      marginTop: 8,
      marginBottom: 6,
      letterSpacing: -0.5,
    },
    navySub: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.navy[350],
    },

    // Section Titles
    sectionTitle: {
      fontSize: 11.5,
      fontWeight: '700',
      color: colors.slate[500],
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      marginHorizontal: 16,
      marginTop: 22,
      marginBottom: 12,
    },

    // Active Card
    activeCard: {
      backgroundColor: colors.white,
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
      fontSize: 15,
      fontWeight: '800',
      color: colors.slate[900],
    },
    activeSub: {
      fontSize: 12.5,
      fontWeight: '500',
      color: colors.slate[500],
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
      fontSize: 11.5,
      fontWeight: '800',
      color: colors.amber[700],
    },
    progressMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    progressCount: {
      fontSize: 17,
      fontWeight: '900',
      color: colors.slate[900],
    },
    rewardText: {
      fontSize: 13.5,
      fontWeight: '800',
      color: colors.primary,
    },
    track: {
      height: 8,
      backgroundColor: colors.slate[100],
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
      fontSize: 12.5,
      fontWeight: '500',
      color: colors.slate[500],
    },

    // Completed List Card
    completedCard: {
      backgroundColor: colors.white,
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
      fontSize: 14.5,
      fontWeight: '800',
      color: colors.slate[900],
    },
    itemDate: {
      fontSize: 12.5,
      fontWeight: '500',
      color: colors.slate[500],
      marginTop: 2,
    },
    itemRight: {
      alignItems: 'flex-end',
      gap: 4,
    },
    itemAmount: {
      fontSize: 14.5,
      fontWeight: '800',
      color: colors.green[700],
    },
    itemAmountPending: {
      fontSize: 14.5,
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
      fontSize: 11.5,
      fontWeight: '800',
      color: colors.green[700],
    },
    statusTextProcessing: {
      fontSize: 11.5,
      fontWeight: '800',
      color: colors.blue[550],
    },
  });
}
