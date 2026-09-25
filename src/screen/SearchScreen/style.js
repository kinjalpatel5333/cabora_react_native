import { fonts } from '../../config/typography';
import {StyleSheet} from 'react-native';
import colors from '../../config/color';

export default StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background || colors.navy[950],
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: colors.surface || colors.navy[900],
    borderBottomWidth: 1,
    borderBottomColor: colors.border || colors.navy[850],
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  menuBtn: {
    padding: 6,
  },
  menuIcon: {
    width: 22,
    height: 22,
    tintColor: colors.text || colors.white,
  },
  headerTitle: {
      fontFamily: fonts.sora.bold,
    fontSize: 18,
    color: colors.text || colors.white,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderRadius: 12,
    backgroundColor: colors.alpha.white07,
    borderWidth: 1,
    borderColor: colors.border || colors.alpha.white10,
    paddingHorizontal: 12,
  },
  searchIcon: {
      fontFamily: fonts.sora.regular,
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
      fontFamily: fonts.sora.regular,
    flex: 1,
    color: colors.text || colors.white,
    fontSize: 15,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  clearText: {
      fontFamily: fonts.sora.bold,
    color: colors.textMuted || colors.gray.gray400,
    fontSize: 13,
  },
  countText: {
      fontFamily: fonts.sora.semiBold,
    fontSize: 12,
    color: colors.textMuted || colors.gray.gray400,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: colors.surface || colors.navy[900],
    borderWidth: 1,
    borderColor: colors.border || colors.navy[850],
    marginBottom: 10,
  },
  itemIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemIconText: {
      fontFamily: fonts.sora.regular,
    fontSize: 20,
  },
  itemContent: {
    flex: 1,
    marginRight: 8,
  },
  itemTitle: {
      fontFamily: fonts.sora.semiBold,
    fontSize: 15,
    color: colors.text || colors.white,
    marginBottom: 3,
  },
  itemSubtitle: {
      fontFamily: fonts.sora.regular,
    fontSize: 12.5,
    color: colors.textMuted || colors.gray.gray400,
  },
  itemBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: colors.alpha.white06,
    marginRight: 8,
  },
  itemBadgeText: {
      fontFamily: fonts.sora.semiBold,
    fontSize: 11,
    color: colors.primary || colors.purple.hotPink,
  },
  arrow: {
      fontFamily: fonts.sora.regular,
    fontSize: 18,
    color: colors.textMuted || colors.gray.gray500,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
      fontFamily: fonts.sora.regular,
    fontSize: 36,
    marginBottom: 8,
  },
  emptyTitle: {
      fontFamily: fonts.sora.semiBold,
    fontSize: 16,
    color: colors.text || colors.white,
    marginBottom: 4,
  },
  emptyText: {
      fontFamily: fonts.sora.regular,
    fontSize: 13,
    color: colors.textMuted || colors.gray.gray400,
  },
});
