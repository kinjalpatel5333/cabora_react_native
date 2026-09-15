import {StyleSheet} from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: '#08101E',
    },
    glow: {
      position: 'absolute',
      zIndex: 0,
    },
    content: {
      flex: 1,
      overflow: 'visible',
    },
    brand: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingHorizontal: 32,
      paddingBottom: 18,
    },
    brandLoading: {
      justifyContent: 'center',
      paddingBottom: 0,
    },
    logoStage: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
      overflow: 'visible',
    },
    logoRing: {
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: colors.orange[700],
      backgroundColor: 'transparent',
      zIndex: 1,
    },
    logoClip: {
      overflow: 'hidden',
    },
    title: {
      color: colors.white,
      fontSize: 36,
      fontWeight: '800',
      letterSpacing: -0.4,
    },
    tagline: {
      color: 'rgba(195, 207, 223, 0.9)',
      fontSize: 16,
      marginTop: 8,
    },
    footer: {
      flexGrow: 0,
      paddingHorizontal: 32,
      alignItems: 'center',
    },
    loadingBlock: {
      alignItems: 'center',
      marginBottom: 28,
    },
    track: {
      width: 148,
      height: 4,
      borderRadius: 2,
      backgroundColor: 'rgba(255,255,255,0.12)',
      overflow: 'hidden',
    },
    fill: {
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.primary,
    },
    finding: {
      color: 'rgba(154, 168, 194, 0.95)',
      fontSize: 13,
      marginTop: 12,
    },
    card: {
      width: 326,
      flexGrow: 0,
      alignSelf: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.07)',
      borderRadius: 24,
      paddingTop: 28,
      paddingRight: 22,
      paddingBottom: 24,
      paddingLeft: 22,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.14)',
      marginBottom: 24,
    },
    cardIcon: {
      width: 56,
      height: 56,
      marginBottom: 12,
    },
    cardTitle: {
      color: colors.white,
      fontSize: 20,
      fontWeight: '800',
      textAlign: 'center',
      marginBottom: 12,
    },
    cardBody: {
      color: 'rgba(195, 207, 223, 0.88)',
      fontSize: 14,
      lineHeight: 21,
      textAlign: 'center',
      marginBottom: 12,
    },
    cardButton: {
      alignSelf: 'stretch',
      minHeight: 52,
      height: 52,
      borderRadius: 16,
    },
    cardButtonPrimary: {
      backgroundColor: colors.orange[600],
    },
    cardButtonInverse: {
      backgroundColor: 'rgba(255, 255, 255, 0.10)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.22)',
    },
    version: {
      color: 'rgba(255,255,255,0.32)',
      fontSize: 12,
      textAlign: 'center',
    },
  });
}
