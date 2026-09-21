import {StyleSheet} from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    toast: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      minHeight: 52,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 26,
      backgroundColor: colors.navy[900],
      shadowColor: colors.navy[950],
      shadowOpacity: 0.28,
      shadowRadius: 16,
      shadowOffset: {width: 0, height: 8},
      elevation: 8,
    },
    message: {
      fontFamily: colors.fonts.sora.bold,
      flex: 1,
      color: colors.white,
      fontSize: 15,
      fontWeight: '700',
    },
    host: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      elevation: 9999,
      paddingHorizontal: 16,
    },
    modalRoot: {
      flex: 1,
    },
    stack: {
      gap: 10,
    },
  });
}
