import {StyleSheet} from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    track: {
      width: 52,
      height: 32,
      borderRadius: 16,
      padding: 3,
      justifyContent: 'center',
      position: 'relative',
    },
    trackLg: {
      width: 58,
      height: 34,
      borderRadius: 17,
      padding: 3,
    },
    on: {
      backgroundColor: colors.orange[600],
      alignItems: 'flex-end',
    },
    off: {
      backgroundColor: colors.gray[400],
      alignItems: 'flex-start',
    },
    onPressed: {
      backgroundColor: colors.orange[700],
    },
    successOn: {
      backgroundColor: colors.green[500],
      alignItems: 'flex-end',
    },
    successOnPressed: {
      backgroundColor: colors.green[600],
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
    locked: {
      backgroundColor: colors.navy[100],
      borderWidth: 1.5,
      borderColor: colors.navy[200],
      alignItems: 'flex-start',
      overflow: 'visible',
    },
    thumb: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: colors.white,
    },
    thumbLg: {
      width: 28,
      height: 28,
      borderRadius: 14,
    },
    thumbDisabled: {
      backgroundColor: colors.gray[50],
    },
    thumbLocked: {
      backgroundColor: colors.white,
      shadowColor: colors.navy[900],
      shadowOpacity: 0.12,
      shadowRadius: 3,
      shadowOffset: {width: 0, height: 1},
      elevation: 2,
    },
    // Center of 52x32 track: (52-14)/2=19, (32-2)/2=15
    lockDash: {
      position: 'absolute',
      left: 19,
      top: 15,
      width: 14,
      height: 2,
      borderRadius: 1,
      backgroundColor: colors.red[600],
      zIndex: 2,
    },
    // Center of 58x34 track: (58-16)/2=21, (34-2)/2=16
    lockDashLg: {
      left: 21,
      top: 16,
      width: 16,
    },
  });
}
