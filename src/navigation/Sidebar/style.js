import {StyleSheet} from 'react-native';
import colors from '../../config/color';

export const DRAWER_WIDTH = 300;

export default StyleSheet.create({
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
    backgroundColor: colors.background,
    shadowColor: colors.black,
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: {width: 4, height: 0},
    elevation: 12,
  },
});
