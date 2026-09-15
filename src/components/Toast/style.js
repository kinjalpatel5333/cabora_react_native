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
      flex: 1,
      color: colors.white,
      fontSize: 15,
      fontWeight: '700',
    },
    host: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'flex-start',
      paddingHorizontal: 16,
    },
    stack: {
      gap: 10,
    },
  });
}
