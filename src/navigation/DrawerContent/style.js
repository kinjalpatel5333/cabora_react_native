import { fonts } from '../../config/typography';
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
      fontFamily: fonts.sora.extraBold,
    color: colors.slate[900],
    fontSize: 18,
    fontWeight: '800',
  },
  email: {
      fontFamily: fonts.sora.regular,
    color: colors.slate[500],
    fontSize: 13,
    marginTop: 2,
  },
  scrollItems: {
    paddingTop: 10,
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  scrollView: {
    flex: 1,
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
    fontFamily: fonts.sora.bold,
    marginLeft: 12,
    color: colors.slate[700],
    fontSize: 15,
    fontWeight: '700',
  },
  itemLabelActive: {
    fontFamily: fonts.sora.extraBold,
    color: colors.primary,
    fontWeight: '800',
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.slate[100],
    backgroundColor: colors.white,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.red[50],
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  logoutIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.red[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoutText: {
    fontFamily: fonts.sora.bold,
    color: colors.red[600],
    fontSize: 15,
    fontWeight: '700',
  },
});
