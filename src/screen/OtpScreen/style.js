import {StyleSheet} from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.white,
    },
    body: {
      flex: 1,
    },
    top: {
      flex: 1,
      paddingHorizontal: 20,
    },
    back: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.gray[100],
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 18,
    },
    avatarChat: {
      backgroundColor: colors.orange[100],
    },
    avatarPaused: {
      backgroundColor: colors.red[100],
    },
    avatarVerified: {
      backgroundColor: colors.green[100],
    },
    title: {
      color: colors.navy[900],
      fontSize: 28,
      fontWeight: '800',
      letterSpacing: -0.4,
    },
    meta: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      marginTop: 8,
      marginBottom: 28,
    },
    metaText: {
      color: colors.gray[500],
      fontSize: 14,
    },
    change: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '700',
    },
    boxes: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 14,
    },
    boxesHit: {
      position: 'relative',
    },
    box: {
      flex: 1,
      aspectRatio: 1,
      maxHeight: 56,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.gray[50],
      borderWidth: 1.5,
      borderColor: colors.gray[200],
    },
    boxFilled: {
      backgroundColor: colors.white,
      borderColor: colors.navy[200],
    },
    boxFocused: {
      backgroundColor: colors.white,
      borderColor: colors.primary,
    },
    boxError: {
      backgroundColor: '#FFF7F7',
      borderColor: colors.danger,
    },
    boxSuccess: {
      backgroundColor: colors.green[100],
      borderColor: colors.green[600],
      borderWidth: 1.5,
    },
    boxDigit: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.navy[900],
    },
    boxDigitError: {
      color: colors.danger,
    },
    boxDigitSuccess: {
      color: colors.green[600],
    },
    caret: {
      width: 2,
      height: 22,
      borderRadius: 1,
      backgroundColor: colors.primary,
    },
    hiddenInput: {
      position: 'absolute',
      opacity: 0,
      height: 56,
      width: '100%',
      top: 0,
    },
    hintRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 6,
      marginBottom: 14,
    },
    hint: {
      flex: 1,
      fontSize: 13,
      lineHeight: 18,
      color: colors.gray[500],
    },
    hintError: {
      color: colors.danger,
    },
    hintSuccess: {
      color: colors.green[600],
    },
    banner: {
      borderRadius: 16,
      padding: 14,
      backgroundColor: colors.red[100],
      marginBottom: 14,
    },
    bannerTitle: {
      color: colors.red[600],
      fontSize: 14,
      fontWeight: '700',
      marginBottom: 4,
    },
    bannerBody: {
      color: colors.red[600],
      fontSize: 13,
      lineHeight: 19,
    },
    support: {
      marginTop: 8,
      color: colors.navy[900],
      fontSize: 13,
      fontWeight: '700',
    },
    chip: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 999,
      backgroundColor: colors.gray[100],
    },
    chipResend: {
      backgroundColor: colors.orange[100],
    },
    chipLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.gray[500],
    },
    chipLabelResend: {
      color: colors.primary,
    },
    footer: {
      paddingHorizontal: 20,
      paddingTop: 16,
    },
    help: {
      marginTop: 14,
      textAlign: 'center',
      color: colors.gray[500],
      fontSize: 13,
    },
    helpLink: {
      color: colors.gray[600],
      fontWeight: '600',
    },
    verifyButton: {
      minHeight: 56,
      borderRadius: 18,
    },
  });
}
