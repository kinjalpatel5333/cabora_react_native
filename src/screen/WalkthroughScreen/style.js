import {StyleSheet} from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.navy[900],
    },
    page: {
      flex: 1,
    },
    header: {
      position: 'absolute',
      left: 20,
      right: 20,
      zIndex: 4,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    logo: {
      width: 40,
      height: 40,
      borderRadius: 12,
      overflow: 'hidden',
    },
    skip: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 9,
      paddingRight: 18,
      paddingBottom: 9,
      paddingLeft: 18,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: '#E6D5C6',
      backgroundColor: 'rgba(255, 255, 255, 0.75)',
    },
    skipLabel: {
      color: colors.navy[900],
      fontSize: 14,
      fontWeight: '700',
    },
    hero: {
      flex: 1.12,
      backgroundColor: '#FFD4AA',
      overflow: 'hidden',
    },
    heroFill: {
      flex: 1,
    },
    heroFillPay: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    heroImage: {
      width: '100%',
      height: '100%',
    },
    payImage: {
      width: '100%',
      maxWidth: 322,
      aspectRatio: 322 / 228,
    },
    wave: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: -1,
      width: '100%',
      height: 96,
      zIndex: 2,
    },
    panel: {
      backgroundColor: colors.navy[900],
      paddingHorizontal: 24,
      paddingTop: 8,
    },
    badge: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: 'rgba(255, 140, 60, 0.12)',
      borderWidth: 1,
      borderColor: 'rgba(255, 140, 60, 0.28)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      marginBottom: 16,
    },
    badgeDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.orange[500],
    },
    badgeLabel: {
      color: colors.orange[400],
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 1.1,
    },
    title: {
      color: colors.white,
      fontSize: 32,
      fontWeight: '800',
      letterSpacing: -0.4,
      lineHeight: 38,
    },
    body: {
      color: 'rgba(195, 207, 223, 0.88)',
      fontSize: 15,
      lineHeight: 22,
      marginTop: 10,
      marginBottom: 22,
    },
    dots: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      marginBottom: 16,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(255,255,255,0.22)',
    },
    dotActive: {
      width: 22,
      backgroundColor: colors.orange[600],
    },
    cta: {
      minHeight: 52,
      height: 52,
      borderRadius: 16,
      backgroundColor: colors.orange[600],
    },
  });
}
