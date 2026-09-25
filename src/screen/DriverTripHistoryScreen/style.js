import { StyleSheet } from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.isDark ? colors.navy[950] : colors.slate[50],
    },

    // Header
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: colors.isDark ? colors.navy[950] : colors.slate[50],
      gap: 14,
    },
    menuBtn: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: colors.isDark ? colors.navy[900] : colors.white,
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
      color: colors.isDark ? colors.navy[25] : colors.slate[900],
    },

    scrollContent: {
      paddingBottom: 110,
    },

    // Search Box
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.isDark ? colors.navy[900] : colors.white,
      borderRadius: 16,
      paddingHorizontal: 16,
      height: 48,
      marginHorizontal: 16,
      marginTop: 6,
      marginBottom: 12,
      shadowColor: colors.black,
      shadowOpacity: 0.04,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
      gap: 10,
    },
    searchInput: {
      fontFamily: colors.fonts.sora.medium,
      flex: 1,
      fontSize: 14,
      color: colors.isDark ? colors.navy[25] : colors.slate[900],
      paddingVertical: 0,
    },

    // Period Tabs (Today, Week, Month, Custom)
    periodRow: {
      flexDirection: 'row',
      backgroundColor: colors.isDark ? colors.navy[850] : colors.navy[250],
      borderRadius: 16,
      padding: 4,
      marginHorizontal: 16,
      marginBottom: 10,
    },
    periodTab: {
      flex: 1,
      paddingVertical: 9,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
      flexDirection: 'row',
      gap: 4,
    },
    periodTabActive: {
      backgroundColor: colors.isDark ? colors.navy[700] : colors.white,
      shadowColor: colors.black,
      shadowOpacity: 0.08,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    periodTabText: {
      fontFamily: colors.fonts.sora.semiBold,
      fontSize: 13,
      color: colors.isDark ? colors.navy[300] : colors.slate[500],
    },
    periodTabTextActive: {
      fontFamily: colors.fonts.sora.extraBold,
      color: colors.isDark ? colors.navy[25] : colors.slate[900],
    },

    // Status Filter Row (Completed, Cancelled, All)
    statusFilterRow: {
      flexDirection: 'row',
      backgroundColor: colors.isDark ? colors.navy[850] : colors.navy[250],
      borderRadius: 16,
      padding: 4,
      marginHorizontal: 16,
      marginBottom: 14,
    },
    statusFilterTab: {
      flex: 1,
      paddingVertical: 9,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
    },
    statusFilterTabActive: {
      backgroundColor: colors.isDark ? colors.navy[700] : colors.white,
      shadowColor: colors.black,
      shadowOpacity: 0.08,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    statusFilterTabText: {
      fontFamily: colors.fonts.sora.semiBold,
      fontSize: 13,
      color: colors.isDark ? colors.navy[300] : colors.slate[500],
    },
    statusFilterTabTextActive: {
      fontFamily: colors.fonts.sora.extraBold,
      color: colors.isDark ? colors.navy[25] : colors.slate[900],
    },

    // Navy Stats Summary Card
    navySummary: {
      backgroundColor: colors.isDark ? colors.navy[900] : colors.navy[850],
      borderRadius: 20,
      paddingVertical: 16,
      paddingHorizontal: 20,
      marginHorizontal: 16,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    statCol: {
      flex: 1,
      alignItems: 'center',
    },
    statDivider: {
      width: 1,
      height: 32,
      backgroundColor: colors.alpha.white12,
    },
    statLabel: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 11,
      color: colors.navy[350],
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      marginBottom: 4,
    },
    statValue: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 20,
      color: colors.white,
    },
    statValueGreen: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 20,
      color: colors.green[550],
    },

    // Trip Card
    tripCard: {
      backgroundColor: colors.isDark ? colors.navy[900] : colors.white,
      borderRadius: 22,
      padding: 16,
      marginHorizontal: 16,
      marginBottom: 12,
      shadowColor: colors.black,
      shadowOpacity: 0.04,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    tripHead: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14,
    },
    tripTime: {
      fontFamily: colors.fonts.sora.semiBold,
      fontSize: 13,
      color: colors.isDark ? colors.navy[300] : colors.slate[500],
    },
    statusPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusPillCompleted: {
      backgroundColor: colors.green[200],
    },
    statusPillCancelled: {
      backgroundColor: colors.red[200],
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    statusDotCompleted: {
      backgroundColor: colors.green[600],
    },
    statusDotCancelled: {
      backgroundColor: colors.red[600],
    },
    statusTextCompleted: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 12,
      color: colors.green[700],
    },
    statusTextCancelled: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 12,
      color: colors.red[600],
    },

    // Route Row
    routeRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },
    routePins: {
      alignItems: 'center',
      paddingTop: 4,
      width: 12,
    },
    dotOrange: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
    },
    routeLine: {
      width: 1.5,
      height: 28,
      backgroundColor: colors.isDark ? colors.navy[700] : colors.slate[300],
      marginVertical: 3,
    },
    squareNavy: {
      width: 8,
      height: 8,
      borderRadius: 2,
      backgroundColor: colors.isDark ? colors.navy[300] : colors.navy[850],
    },
    routeAddresses: {
      flex: 1,
      gap: 8,
    },
    addressBlock: {},
    addressKicker: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 10.5,
      color: colors.navy[350],
      letterSpacing: 0.5,
      textTransform: 'uppercase',
      marginBottom: 2,
    },
    addressTitle: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 14.5,
      color: colors.isDark ? colors.navy[25] : colors.slate[900],
    },

    // Card Footer
    cardFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTopWidth: 1,
      borderTopColor: colors.isDark ? colors.navy[800] : colors.slate[100],
      marginTop: 14,
      paddingTop: 12,
    },
    footerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      flex: 1,
    },
    footerMeta: {
      fontFamily: colors.fonts.sora.semiBold,
      fontSize: 12.5,
      color: colors.isDark ? colors.navy[300] : colors.slate[500],
    },
    footerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    footerFare: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 16,
      color: colors.isDark ? colors.navy[25] : colors.slate[900],
    },
  });
}
