import { fonts } from '../../config/typography';
import {StyleSheet} from 'react-native';
import colors from '../../config/color';

export default StyleSheet.create({
  hero: {
    paddingTop: 32,
    paddingBottom: 28,
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 20,
  },
  kicker: {
      fontFamily: fonts.sora.extraBold,
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 8,
  },
  title: {
      fontFamily: fonts.sora.extraBold,
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
  },
  subtitle: {
      fontFamily: fonts.sora.regular,
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },
  footerText: {
      fontFamily: fonts.sora.regular,
    color: colors.textMuted,
    fontSize: 14,
  },
  link: {
      fontFamily: fonts.sora.bold,
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
