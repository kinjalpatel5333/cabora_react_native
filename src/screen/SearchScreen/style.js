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
    fontSize: 18,
    fontWeight: '700',
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
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.text || colors.white,
    fontSize: 15,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  clearText: {
    color: colors.textMuted || colors.gray.gray400,
    fontSize: 13,
    fontWeight: '700',
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
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
    fontSize: 20,
  },
  itemContent: {
    flex: 1,
    marginRight: 8,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text || colors.white,
    marginBottom: 3,
  },
  itemSubtitle: {
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
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary || colors.purple.hotPink,
  },
  arrow: {
    fontSize: 18,
    color: colors.textMuted || colors.gray.gray500,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text || colors.white,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted || colors.gray.gray400,
  },
});
