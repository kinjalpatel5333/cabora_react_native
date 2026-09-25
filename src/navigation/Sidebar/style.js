import { StyleSheet } from 'react-native';

export const DRAWER_WIDTH = 300;

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
      backgroundColor: colors.surface,
      shadowColor: colors.isDark ? colors.black : colors.navy[900],
      shadowOpacity: colors.isDark ? 0.4 : 0.18,
      shadowRadius: 16,
      shadowOffset: { width: 4, height: 0 },
      elevation: 16,
    },
  });
}
