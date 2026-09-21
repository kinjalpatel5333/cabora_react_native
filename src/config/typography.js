/**
 * Cabora Typography & Font Configuration
 * Sora font family tokens and typographic presets.
 */

export const fonts = {
  sora: {
    thin: 'Sora-Thin',
    extraLight: 'Sora-ExtraLight',
    light: 'Sora-Light',
    regular: 'Sora-Regular',
    medium: 'Sora-Medium',
    semiBold: 'Sora-SemiBold',
    bold: 'Sora-Bold',
    extraBold: 'Sora-ExtraBold',
  },
};

export const fontByWeight = (weight = '400') => {
  const w = String(weight).toLowerCase();
  if (w === '100' || w === 'thin') return fonts.sora.thin;
  if (w === '200' || w === 'extralight') return fonts.sora.extraLight;
  if (w === '300' || w === 'light') return fonts.sora.light;
  if (w === '500' || w === 'medium') return fonts.sora.medium;
  if (w === '600' || w === 'semibold') return fonts.sora.semiBold;
  if (w === '700' || w === 'bold') return fonts.sora.bold;
  if (w === '800' || w === '900' || w === 'extrabold' || w === 'black') return fonts.sora.extraBold;
  return fonts.sora.regular;
};

export const typography = {
  // Headings
  h1: {
    fontFamily: fonts.sora.bold,
    fontSize: 24,
    lineHeight: 32,
  },
  h2: {
    fontFamily: fonts.sora.semiBold,
    fontSize: 20,
    lineHeight: 28,
  },
  h3: {
    fontFamily: fonts.sora.semiBold,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.09,
  },
  h4: {
    fontFamily: fonts.sora.semiBold,
    fontSize: 16,
    lineHeight: 22,
  },

  // Body
  bodyLarge: {
    fontFamily: fonts.sora.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyLargeMedium: {
    fontFamily: fonts.sora.medium,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyLargeSemiBold: {
    fontFamily: fonts.sora.semiBold,
    fontSize: 16,
    lineHeight: 24,
  },
  body: {
    fontFamily: fonts.sora.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  bodyMedium: {
    fontFamily: fonts.sora.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  bodySemiBold: {
    fontFamily: fonts.sora.semiBold,
    fontSize: 14,
    lineHeight: 20,
  },
  bodyBold: {
    fontFamily: fonts.sora.bold,
    fontSize: 14,
    lineHeight: 20,
  },

  // Small & Caption
  caption: {
    fontFamily: fonts.sora.regular,
    fontSize: 12,
    lineHeight: 16,
  },
  captionMedium: {
    fontFamily: fonts.sora.medium,
    fontSize: 12,
    lineHeight: 16,
  },
  captionSemiBold: {
    fontFamily: fonts.sora.semiBold,
    fontSize: 12,
    lineHeight: 16,
  },
  tiny: {
    fontFamily: fonts.sora.medium,
    fontSize: 10,
    lineHeight: 14,
  },
};

export default {
  fonts,
  typography,
};
