import {Dimensions, StyleSheet} from 'react-native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const FIGMA_FRAME = 390;
const SCALE = SCREEN_WIDTH / FIGMA_FRAME;
const CARD_WIDTH = Math.min(336, 326 * SCALE);

export default function createStyles(colors) {
  return StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(5, 10, 24, 0.78)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    card: {
      width: CARD_WIDTH,
      maxWidth: '100%',
      alignSelf: 'center',
      alignItems: 'center',
      backgroundColor: '#172238',
      borderRadius: 24,
      paddingTop: 28,
      paddingRight: 22,
      paddingBottom: 24,
      paddingLeft: 22,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.12)',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 10},
      shadowOpacity: 0.35,
      shadowRadius: 20,
      elevation: 8,
    },
    iconCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: '#4A3528',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    cardTitle: {
      fontFamily: colors.fonts.sora.extraBold,
      color: colors.white || '#FFFFFF',
      fontSize: 20,
      textAlign: 'center',
      marginBottom: 10,
    },
    cardBody: {
      fontFamily: colors.fonts.sora.regular,
      color: colors.alpha?.slateAlpha88 || 'rgba(226, 232, 240, 0.85)',
      fontSize: 14,
      lineHeight: 21,
      textAlign: 'center',
      marginBottom: 20,
    },
    cardButton: {
      alignSelf: 'stretch',
      minHeight: 52,
      height: 52,
      borderRadius: 16,
      backgroundColor: colors.orange?.[600] || '#FF5500',
    },
    cardButtonInverse: {
      backgroundColor: colors.alpha?.white10 || 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      borderColor: colors.alpha?.white22 || 'rgba(255, 255, 255, 0.22)',
    },
  });
}
