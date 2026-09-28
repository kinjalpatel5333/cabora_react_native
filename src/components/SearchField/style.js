import {StyleSheet} from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: colors.isDark ? colors.surface : colors.card,
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: colors.border,
      paddingHorizontal: 16,
      height: 52,
    },
    searchBoxFocused: {
      borderColor: colors.primary,
      backgroundColor: colors.isDark ? colors.surface : colors.card,
      shadowColor: colors.primary,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 2,
    },
    searchBoxDisabled: {
      backgroundColor: colors.disabledBg,
      borderColor: colors.borderLight,
      opacity: 0.7,
    },
    searchInput: {
      fontFamily: colors.fonts.sora.medium,
      flex: 1,
      color: colors.text,
      fontSize: 15,
      paddingVertical: 0,
      paddingHorizontal: 0,
      margin: 0,
      height: '100%',
    },
    clearBtn: {
      padding: 4,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
