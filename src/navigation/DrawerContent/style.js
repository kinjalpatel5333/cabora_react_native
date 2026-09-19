import { StyleSheet } from 'react-native';
import colors from '../../config/color';

export default StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  profile: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate[100],
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  name: {
    color: colors.slate[900],
    fontSize: 18,
    fontWeight: '800',
  },
  email: {
    color: colors.slate[500],
    fontSize: 13,
    marginTop: 2,
  },
  scrollItems: {
    paddingTop: 10,
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 4,
  },
  itemActive: {
    backgroundColor: colors.orange[175],
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.slate[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxActive: {
    backgroundColor: colors.orange[250],
  },
  itemLabel: {
    marginLeft: 12,
    color: colors.slate[700],
    fontSize: 15,
    fontWeight: '700',
  },
  itemLabelActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.slate[100],
  },
});
