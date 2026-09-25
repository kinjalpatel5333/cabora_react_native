import {StyleSheet} from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    base: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: 8,
      minHeight: 32,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    label: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 13,
    },
    neutral: {
      backgroundColor: colors.gray[100],
    },
    accent: {
      backgroundColor: colors.orange[100],
    },
    success: {
      backgroundColor: colors.green[100],
    },
    warning: {
      backgroundColor: colors.amber[100],
    },
    danger: {
      backgroundColor: colors.red[100],
    },
    info: {
      backgroundColor: colors.blue[100],
    },
  });
}
