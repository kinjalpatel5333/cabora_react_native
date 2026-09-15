import {StyleSheet} from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    track: {
      width: 52,
      height: 32,
      borderRadius: 16,
      padding: 3,
      justifyContent: 'center',
    },
    on: {
      backgroundColor: colors.primary,
      alignItems: 'flex-end',
    },
    off: {
      backgroundColor: colors.gray[400],
      alignItems: 'flex-start',
    },
    onPressed: {
      backgroundColor: colors.primaryDark,
    },
    offPressed: {
      backgroundColor: colors.gray[500],
    },
    disabledOn: {
      backgroundColor: colors.orange[200],
    },
    disabledOff: {
      backgroundColor: colors.gray[200],
    },
    thumb: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: colors.white,
    },
    thumbDisabled: {
      backgroundColor: colors.gray[50],
    },
  });
}
