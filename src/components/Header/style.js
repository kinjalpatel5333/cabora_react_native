import { fonts } from '../../config/typography';
import { StyleSheet } from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    wrap: {
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingHorizontal: 16,
      paddingBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    menu: {
      width: 36,
      height: 36,
      borderRadius: 10,
      tintColor: colors.isDark ? colors.white : undefined,
    },
    title: {
      fontFamily: fonts.sora.extraBold,
      flex: 1,
      marginLeft: 12,
      color: colors.text,
      fontSize: 18,
      fontWeight: '800',
    },
  });
}
