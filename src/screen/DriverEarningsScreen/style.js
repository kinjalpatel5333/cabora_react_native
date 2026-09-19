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
      paddingVertical: 10,
      backgroundColor: colors.slate[50],
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
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
    statementBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.black,
      shadowOpacity: 0.06,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },

    scrollContent: {
      paddingBottom: 110,
    },

    // Period Tabs (Today, Week, Month, Custom)
    periodTabsContainer: {
      flexDirection: 'row',
      backgroundColor: colors.navy[250],
      borderRadius: 18,
      padding: 4,
      marginHorizontal: 16,
      marginTop: 12,
    },
    periodTab: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 14,
      flexDirection: 'row',
      gap: 5,
    },
    periodTabActive: {
      backgroundColor: colors.white,
      shadowColor: colors.black,
      shadowOpacity: 0.08,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    periodTabText: {
      fontSize: 13.5,
      fontWeight: '600',
      color: colors.slate[500],
    },
    periodTabTextActive: {
      color: colors.slate[900],
      fontWeight: '800',
    },

    // Main Chart Card (Navy)
    chartCard: {
      backgroundColor: colors.navy[850],
      borderRadius: 24,
      padding: 20,
      marginHorizontal: 16,
      marginTop: 16,
    },
    chartHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    chartLabel: {
      fontSize: 11.5,
      fontWeight: '700',
      color: colors.navy[350],
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
    chartTrend: {
      fontSize: 12.5,
      fontWeight: '700',
      color: colors.green[550],
    },
    netAmount: {
      fontSize: 38,
      fontWeight: '900',
      color: colors.white,
      marginTop: 10,
      marginBottom: 16,
      letterSpacing: -0.5,
    },

    // Bar Chart
    chartContainer: {
      position: 'relative',
      height: 140,
      justifyContent: 'flex-end',
    },
    chartGridLineTop: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 36,
      height: 1,
      backgroundColor: colors.alpha.white10,
    },
    chartGridLineMid: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 72,
      height: 1,
      backgroundColor: colors.alpha.white10,
    },
    chartBaseLine: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 22,
      height: 1,
      backgroundColor: colors.alpha.white14,
    },
    barsRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      paddingHorizontal: 6,
      height: 110,
    },
    barCol: {
      alignItems: 'center',
      width: 32,
      justifyContent: 'flex-end',
      overflow: 'visible',
    },
    tooltipBadge: {
      backgroundColor: colors.primary,
      minWidth: 54,
      height: 22,
      paddingHorizontal: 8,
      borderRadius: 7,
      marginBottom: 4,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 5,
    },
    tooltipText: {
      color: colors.white,
      fontSize: 11.5,
      fontWeight: '800',
      textAlign: 'center',
      includeFontPadding: false,
    },
    bar: {
      width: 26,
      backgroundColor: colors.alpha.white16,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
    },
    barActive: {
      backgroundColor: colors.primary,
    },
    dayLabelsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 6,
      marginTop: 8,
    },
    dayLabel: {
      fontSize: 11.5,
      fontWeight: '600',
      color: colors.slate[500],
      width: 32,
      textAlign: 'center',
    },
    dayLabelActive: {
      color: colors.navy[350],
      fontWeight: '700',
    },

    // 2x2 Metric Grid
    metricGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginHorizontal: 16,
      marginTop: 14,
    },
    metricCard: {
      width: '48.1%',
      backgroundColor: colors.white,
      borderRadius: 18,
      padding: 16,
      shadowColor: colors.black,
      shadowOpacity: 0.04,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    metricTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 8,
    },
    metricTitle: {
      fontSize: 10.5,
      fontWeight: '700',
      color: colors.slate[500],
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    metricValue: {
      fontSize: 18.5,
      fontWeight: '900',
      color: colors.slate[900],
      marginBottom: 4,
    },
    metricValueRed: {
      fontSize: 18.5,
      fontWeight: '900',
      color: colors.red[600],
      marginBottom: 4,
    },
    metricValueGreen: {
      fontSize: 18.5,
      fontWeight: '900',
      color: colors.green[600],
      marginBottom: 4,
    },
    metricSub: {
      fontSize: 12.5,
      fontWeight: '500',
      color: colors.slate[500],
    },

    // Ride Level Earnings Section
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
    ridesCard: {
      backgroundColor: colors.white,
      borderRadius: 18,
      marginHorizontal: 16,
      paddingHorizontal: 16,
      shadowColor: colors.black,
      shadowOpacity: 0.04,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    rideItem: {
      paddingVertical: 14,
    },
    rideItemBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.slate[100],
    },
    rideTopRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    rideLeft: {
      flex: 1,
      marginRight: 10,
    },
    rideTime: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.slate[400],
      marginBottom: 3,
    },
    rideRoute: {
      fontSize: 14,
      fontWeight: '800',
      color: colors.slate[900],
    },
    rideRight: {
      alignItems: 'flex-end',
    },
    rideEarning: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.green[700],
    },
    rideFare: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.slate[500],
      marginTop: 2,
    },
  });
}
