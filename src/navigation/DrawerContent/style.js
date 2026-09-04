import {StyleSheet} from 'react-native';
import colors from '../../config/color';

export default StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profile: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 12,
  },
  name: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  email: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 4,
  },
  items: {
    paddingTop: 12,
    paddingHorizontal: 12,
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  itemActive: {
    backgroundColor: colors.inputBg,
  },
  itemIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  itemLabel: {
    marginLeft: 12,
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
});
