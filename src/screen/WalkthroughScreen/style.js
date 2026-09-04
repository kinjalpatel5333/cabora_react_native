import {StyleSheet} from 'react-native';
import colors from '../../config/color';

export default StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  skipWrap: {
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  skip: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '700',
  },
  slide: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 220,
    marginBottom: 28,
  },
  kicker: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 8,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
  },
  body: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 10,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 18,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  dotActive: {
    width: 22,
    backgroundColor: colors.primary,
  },
});
