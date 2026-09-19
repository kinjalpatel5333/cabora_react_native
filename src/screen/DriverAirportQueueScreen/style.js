import { StyleSheet } from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.map.land,
    },
    mapImage: {
      ...StyleSheet.absoluteFillObject,
      width: '100%',
      height: '100%',
    },

    // Floating Back Button
    backBtn: {
      position: 'absolute',
      left: 16,
      zIndex: 6,
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.black,
      shadowOpacity: 0.12,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 4,
    },

    // Map Geofence Overlay
    mapZoneContainer: {
      position: 'absolute',
      left: '12%',
      right: '12%',
      height: 180,
      zIndex: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    geofenceBox: {
      width: '100%',
      height: 150,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.orange[650],
      backgroundColor: colors.alpha.orange25,
      transform: [{ rotate: '-3deg' }],
      alignItems: 'center',
      justifyContent: 'center',
    },
    zoneMarker: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: colors.white,
      borderWidth: 4,
      borderColor: colors.orange[650],
      marginBottom: 10,
    },
    zoneLabel: {
      fontSize: 12.5,
      fontWeight: '800',
      color: colors.slate[900],
      backgroundColor: colors.alpha.white85,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
      overflow: 'hidden',
    },

    // Bottom Sheet Container
    sheet: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      maxHeight: '68%',
      backgroundColor: colors.white,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingTop: 10,
      zIndex: 8,
      shadowColor: colors.navy[850],
      shadowOpacity: 0.16,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: -6 },
      elevation: 16,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 16,
    },

    dragHandleWrapper: {
      alignItems: 'center',
      paddingVertical: 4,
      marginBottom: 8,
    },
    dragHandleBar: {
      width: 44,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.slate[300],
    },

    // Status Pill
    statusBadge: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: colors.green[150],
      borderRadius: 20,
      paddingVertical: 6,
      paddingHorizontal: 12,
      marginBottom: 10,
    },
    statusDot: {
      width: 7,
      height: 7,
      borderRadius: 3.5,
      backgroundColor: colors.green[600],
    },
    statusText: {
      color: colors.green[700],
      fontSize: 13,
      fontWeight: '700',
    },

    sheetTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.slate[900],
      marginBottom: 14,
    },

    // Position Hero Card (Dark Navy)
    positionCard: {
      backgroundColor: colors.navy[850],
      borderRadius: 20,
      paddingVertical: 20,
      paddingHorizontal: 20,
      marginBottom: 12,
      position: 'relative',
      overflow: 'hidden',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    posCircleBg: {
      position: 'absolute',
      top: -68,
      left: 250,
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: colors.alpha.orange22,
    },
    posLeft: {
      flex: 1,
      zIndex: 2,
    },
    posLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.navy[450],
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      marginBottom: 6,
    },
    posNumber: {
      fontSize: 44,
      fontWeight: '900',
      color: colors.white,
      lineHeight: 48,
    },
    posSub: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.navy[450],
      marginTop: 4,
    },
    posRight: {
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      zIndex: 2,
      width: 135,
    },
    posTopLine: {
      width: 130,
      height: 1.5,
      backgroundColor: colors.alpha.white16,
      marginBottom: 12,
    },
    waitValue: {
      fontSize: 26,
      fontWeight: '800',
      color: colors.white,
      lineHeight: 30,
    },
    waitMinText: {
      color: colors.orange[350],
      fontSize: 26,
      fontWeight: '800',
    },
    waitSub: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.navy[450],
      marginTop: 4,
    },

    // Vehicle Class Card
    classCard: {
      backgroundColor: colors.white,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.slate[200],
      padding: 16,
      marginBottom: 12,
    },
    classCardTitle: {
      fontSize: 14,
      fontWeight: '800',
      color: colors.slate[900],
      marginBottom: 12,
    },
    classRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 4,
    },
    className: {
      fontSize: 13.5,
      fontWeight: '500',
      color: colors.slate[500],
    },
    classWaiting: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.slate[500],
    },
    classNameActive: {
      fontSize: 14,
      fontWeight: '800',
      color: colors.slate[900],
    },
    classWaitingActive: {
      fontSize: 13.5,
      fontWeight: '800',
      color: colors.orange[650],
    },

    // Guidelines Card
    guideCard: {
      backgroundColor: colors.slate[50],
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.slate[100],
      padding: 16,
      marginBottom: 8,
    },
    guideTitle: {
      fontSize: 14,
      fontWeight: '800',
      color: colors.slate[900],
      marginBottom: 12,
    },
    guideItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 10,
    },
    guideText: {
      flex: 1,
      fontSize: 13,
      fontWeight: '600',
      color: colors.slate[700],
    },

    // Bottom Action Row (Leave queue & Refresh)
    footer: {
      backgroundColor: colors.white,
      borderTopWidth: 1,
      borderTopColor: colors.navy[150],
      paddingHorizontal: 16,
      paddingTop: 12,
      flexDirection: 'row',
      gap: 12,
    },
    leaveBtn: {
      flex: 1,
      minHeight: 52,
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: colors.slate[200],
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
    },
    leaveBtnText: {
      color: colors.slate[900],
      fontSize: 15,
      fontWeight: '800',
    },
    refreshBtn: {
      flex: 1,
      minHeight: 52,
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
    refreshBtnText: {
      color: colors.white,
      fontSize: 15,
      fontWeight: '800',
    },
  });
}
