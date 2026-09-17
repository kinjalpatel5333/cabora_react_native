import {StyleSheet} from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.navy[25],
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      paddingBottom: 12,
      backgroundColor: colors.white,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.gray[200],
    },
    headerBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      flex: 1,
      textAlign: 'center',
      color: colors.navy[900],
      fontSize: 17,
      fontWeight: '700',
    },
    scroll: {
      paddingHorizontal: 16,
      paddingTop: 16,
      gap: 12,
    },
    card: {
      backgroundColor: colors.white,
      borderRadius: 20,
      padding: 16,
    },
    cardRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },
    cardCopy: {
      flex: 1,
      minWidth: 0,
    },
    cardTitle: {
      color: colors.navy[900],
      fontSize: 16,
      fontWeight: '800',
    },
    cardSub: {
      color: colors.gray[500],
      fontSize: 13,
      lineHeight: 18,
      marginTop: 4,
    },
    onBadge: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 12,
      backgroundColor: colors.green[100],
      borderRadius: 999,
      paddingVertical: 5,
      paddingHorizontal: 10,
    },
    onDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: colors.green[500],
    },
    onBadgeText: {
      color: colors.green[600],
      fontSize: 12,
      fontWeight: '700',
    },
    mapPreview: {
      height: 140,
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: colors.map.land,
      marginBottom: 14,
    },
    mapImage: {
      ...StyleSheet.absoluteFillObject,
      width: '100%',
      height: '100%',
    },
    destRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    destCopy: {
      flex: 1,
      minWidth: 0,
    },
    destTitle: {
      color: colors.navy[900],
      fontSize: 15,
      fontWeight: '800',
    },
    destMeta: {
      color: colors.gray[500],
      fontSize: 12,
      marginTop: 2,
    },
    changeLink: {
      color: colors.orange[600],
      fontSize: 14,
      fontWeight: '800',
    },
    usesTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    usesCount: {
      color: colors.navy[900],
      fontSize: 16,
      fontWeight: '800',
    },
    usesTrack: {
      height: 8,
      borderRadius: 999,
      backgroundColor: colors.navy[100],
      overflow: 'hidden',
      marginBottom: 10,
    },
    usesFill: {
      height: '100%',
      borderRadius: 999,
      backgroundColor: colors.orange[600],
    },
    usesHint: {
      color: colors.gray[500],
      fontSize: 12,
      lineHeight: 17,
      marginBottom: 8,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    infoText: {
      flex: 1,
      color: colors.gray[500],
      fontSize: 12,
      lineHeight: 17,
    },
    rulesTitle: {
      marginBottom: 12,
    },
    ruleRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      marginBottom: 12,
    },
    ruleText: {
      flex: 1,
      color: colors.navy[800],
      fontSize: 13,
      lineHeight: 18,
      fontWeight: '500',
    },
    footer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: 16,
      paddingTop: 12,
      backgroundColor: colors.white,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.gray[200],
    },
    footerHint: {
      textAlign: 'center',
      color: colors.gray[500],
      fontSize: 12,
      marginBottom: 10,
    },
    ctaBtn: {
      backgroundColor: colors.orange[600],
    },
  });
}
