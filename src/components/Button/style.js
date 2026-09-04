import {StyleSheet} from 'react-native';
import colors from '../../config/color';

export default StyleSheet.create({
  base: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  outline: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.88,
  },
  label: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  outlineLabel: {
    color: colors.text,
  },
});
