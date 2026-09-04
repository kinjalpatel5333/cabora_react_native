import {StyleSheet} from 'react-native';
import colors from '../../config/color';

export default StyleSheet.create({
  wrap: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menu: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },
  title: {
    flex: 1,
    marginLeft: 12,
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
});
