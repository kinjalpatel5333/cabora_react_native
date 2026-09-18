/**
 * Cabora colour system
 * Orange is the single action colour. Navy carries authority and night surfaces.
 * Everything else is state.
 */

export const palette = {
  orange: {
    50: '#FFF8F2',
    100: '#FFF3EA',
    200: '#FEE3D0',
    300: '#FFC7A4',
    400: '#FEA86F',
    500: '#FF7006',
    600: '#FF7006',
    700: '#E85F00',
    800: '#BE4D01',
    900: '#8B3900',
  },
  navy: {
    25: '#F8F9FD',
    50: '#F3F5FA',
    100: '#EEF1F8',
    200: '#DFE6F0',
    300: '#C3CFDF',
    400: '#9AA8C2',
    500: '#6F809E',
    600: '#45547B',
    700: '#23406A',
    800: '#173460',
    900: '#0D2B47',
    950: '#071C31',
  },
  gray: {
    25: '#FCFCFD',
    50: '#FAFBFD',
    100: '#F4F5F7',
    200: '#E6E9F0',
    300: '#D3DAE4',
    400: '#B3BCCB',
    500: '#8C95A6',
    600: '#6C7487',
    700: '#51596C',
    800: '#3D4454',
    900: '#262C38',
  },
  green: {
    100: '#E4F7EC',
    500: '#26A85E',
    600: '#1C8A4D',
  },
  red: {
    100: '#FDECEC',
    500: '#E73D3D',
    600: '#C82C2D',
  },
  amber: {
    100: '#FBF3D4',
    500: '#F4A526',
    600: '#CD8411',
  },
  blue: {
    100: '#E3F0FC',
    500: '#2E7BE7',
    600: '#1D63C5',
  },
  map: {
    land: '#E1E5F0',
    road: '#FFFFFF',
    roadAlt: '#F6F7FB',
    water: '#C2D7EC',
    park: '#D3E7CE',
    building: '#D5DBE7',
  },
};

const shared = {
  orange: palette.orange,
  navy: palette.navy,
  gray: palette.gray,
  green: palette.green,
  red: palette.red,
  amber: palette.amber,
  blue: palette.blue,
  map: palette.map,
  white: '#FFFFFF',
  black: '#000000',
  primary: palette.orange[500],
  primaryDark: palette.orange[600],
  accent: palette.orange[500],
  success: palette.green[500],
  danger: palette.red[500],
  warning: palette.amber[500],
  info: palette.blue[500],
};

export const light = {
  ...shared,
  mode: 'light',
  barStyle: 'dark-content',
  secondary: palette.navy[700],
  background: palette.gray[25],
  surface: palette.white,
  text: palette.navy[900],
  textMuted: palette.gray[500],
  border: palette.gray[200],
  inputBg: palette.gray[50],
  disabledBg: palette.gray[100],
  disabledText: palette.gray[400],
  focus: palette.orange[500],
  overlay: 'rgba(13, 43, 71, 0.45)',
};

export const dark = {
  ...light,
  mode: 'dark',
  barStyle: 'light-content',
  primaryDark: palette.orange[400],
  secondary: palette.navy[300],
  background: palette.navy[950],
  surface: palette.navy[900],
  text: palette.navy[25],
  textMuted: palette.navy[300],
  border: palette.navy[800],
  inputBg: palette.navy[800],
  disabledBg: palette.navy[800],
  disabledText: palette.navy[500],
  focus: palette.orange[400],
  overlay: 'rgba(7, 28, 49, 0.72)',
};

export const themes = {light, dark};

export const DEFAULT_THEME = 'light';

export function getThemeColors(theme = DEFAULT_THEME) {
  return themes[theme] ?? themes.light;
}

const colors = getThemeColors(DEFAULT_THEME);

export default colors;
