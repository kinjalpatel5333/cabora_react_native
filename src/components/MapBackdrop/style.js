import { Dimensions, StyleSheet } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');

export default function createStyles(colors) {
  return StyleSheet.create({
    map: {
      ...StyleSheet.absoluteFillObject,
      width: SCREEN_W,
      height: SCREEN_H,
      backgroundColor: colors.map.land,
      overflow: 'hidden',
      zIndex: 0,
    },
    mapImage: {
      ...StyleSheet.absoluteFillObject,
      width: SCREEN_W,
      height: SCREEN_H,
    },
    driverMarker: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.isDark ? '#0F1E36' : '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.5,
      elevation: 5,
      borderWidth: 1.5,
      borderColor: colors.primary,
    },
    userLocationDot: {
      position: 'absolute',
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: colors.alpha?.blue25 || 'rgba(37, 99, 235, 0.25)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    userLocationInner: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: '#2563EB',
      borderWidth: 2,
      borderColor: '#FFFFFF',
    },
  });
}
