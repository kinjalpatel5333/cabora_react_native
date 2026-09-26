import {StyleSheet} from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    providerRoot: {
      flex: 1,
      backgroundColor: 'transparent',
      zIndex: 999999,
      elevation: 999999,
    },
    toastWrapper: {
      width: '100%',
      zIndex: 999999,
      elevation: 999999,
    },
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
      shadowOpacity: 0.35,
      shadowRadius: 16,
      shadowOffset: {width: 0, height: 8},
      elevation: 999999,
      zIndex: 999999,
    },
    message: {
      fontFamily: colors.fonts.sora.bold,
      flex: 1,
      color: colors.white,
      fontSize: 15,
    },
    host: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 999999,
      elevation: 999999,
      paddingHorizontal: 16,
    },
    stack: {
      gap: 10,
      zIndex: 999999,
      elevation: 999999,
    },
  });
}
