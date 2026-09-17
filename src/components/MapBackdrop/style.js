import {Dimensions, StyleSheet} from 'react-native';

const {width: SCREEN_W, height: SCREEN_H} = Dimensions.get('screen');

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
  });
}
