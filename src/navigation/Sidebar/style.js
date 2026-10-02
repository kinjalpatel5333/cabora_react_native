import { Dimensions, StyleSheet } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const DRAWER_WIDTH = Math.min(Math.max(SCREEN_WIDTH * 0.78, 280), 330);

export default function createStyles(colors) {
  return StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.overlay,
    },
    panel: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      width: DRAWER_WIDTH,
      maxWidth: '85%',
      backgroundColor: colors.surface,
      shadowColor: colors.isDark ? colors.black : colors.navy[900],
      shadowOpacity: colors.isDark ? 0.45 : 0.2,
      shadowRadius: 20,
      shadowOffset: { width: 4, height: 0 },
      elevation: 20,
      zIndex: 9999,
    },
  });
}
