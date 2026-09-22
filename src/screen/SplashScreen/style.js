import {StyleSheet} from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    root: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.navy[950],
    },
    bottomFill: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.navy[950],
      zIndex: 0,
    },
    glow: {
      position: 'absolute',
      zIndex: 0,
    },
    content: {
      flex: 1,
      overflow: 'visible',
      zIndex: 1,
    },
    brand: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingHorizontal: 32,
      paddingBottom: 10,
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
      color: colors.alpha.slateAlpha90,
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
      backgroundColor: colors.alpha.white12,
      overflow: 'hidden',
    },
    fill: {
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.primary,
    },
    finding: {
      color: colors.alpha.navyAlpha95,
      fontSize: 13,
      marginTop: 12,
    },
    card: {
      width: 326,
      flexGrow: 0,
      alignSelf: 'center',
      alignItems: 'center',
      backgroundColor: colors.alpha.white07,
      borderRadius: 24,
      paddingTop: 28,
      paddingRight: 22,
      paddingBottom: 24,
      paddingLeft: 22,
      borderWidth: 1,
      borderColor: colors.alpha.white14,
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
      color: colors.alpha.slateAlpha88,
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
      backgroundColor: colors.alpha.white10,
      borderWidth: 1,
      borderColor: colors.alpha.white22,
    },
    version: {
      color: colors.alpha.white32,
      fontSize: 12,
      textAlign: 'center',
    },
  });
}
