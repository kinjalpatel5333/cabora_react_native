import {StyleSheet} from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
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
      backgroundColor: colors.surface,
      borderWidth: colors.isDark ? 1 : 0,
      borderColor: colors.border,
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
      backgroundColor: colors.isDark ? 'rgba(255,112,6,0.18)' : colors.orange[100],
    },
    avatarPaused: {
      backgroundColor: colors.isDark ? 'rgba(231,61,61,0.18)' : colors.red[100],
    },
    avatarVerified: {
      backgroundColor: colors.isDark ? 'rgba(38,168,94,0.18)' : colors.green[100],
    },
    title: {
      fontFamily: colors.fonts.sora.extraBold,
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
      fontFamily: colors.fonts.sora.regular,
      color: colors.gray[500],
      fontSize: 14,
    },
    change: {
      fontFamily: colors.fonts.sora.bold,
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
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    boxFilled: {
      backgroundColor: colors.card,
      borderColor: colors.primary,
    },
    boxFocused: {
      backgroundColor: colors.card,
      borderColor: colors.primary,
    },
    boxError: {
      backgroundColor: colors.isDark ? 'rgba(231,61,61,0.15)' : '#FFF7F7',
      borderColor: colors.danger,
    },
    boxSuccess: {
      backgroundColor: colors.isDark ? 'rgba(38,168,94,0.15)' : colors.green[100],
      borderColor: colors.green[600],
      borderWidth: 1.5,
    },
    boxDigit: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
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
      fontFamily: colors.fonts.sora.regular,
      flex: 1,
      fontSize: 13,
      lineHeight: 18,
      color: colors.muted,
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
      backgroundColor: colors.isDark ? 'rgba(231,61,61,0.18)' : colors.red[100],
      marginBottom: 14,
    },
    bannerTitle: {
      fontFamily: colors.fonts.sora.bold,
      color: colors.red[600],
      fontSize: 14,
      fontWeight: '700',
      marginBottom: 4,
    },
    bannerBody: {
      fontFamily: colors.fonts.sora.regular,
      color: colors.red[600],
      fontSize: 13,
      lineHeight: 19,
    },
    support: {
      fontFamily: colors.fonts.sora.bold,
      marginTop: 8,
      color: colors.text,
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
      backgroundColor: colors.surface,
      borderWidth: colors.isDark ? 1 : 0,
      borderColor: colors.border,
    },
    chipResend: {
      backgroundColor: colors.isDark ? 'rgba(255,112,6,0.18)' : colors.orange[100],
    },
    chipLabel: {
      fontFamily: colors.fonts.sora.semiBold,
      fontSize: 13,
      fontWeight: '600',
      color: colors.muted,
    },
    chipLabelResend: {
      color: colors.primary,
    },
    footer: {
      paddingHorizontal: 20,
      paddingTop: 16,
    },
    help: {
      fontFamily: colors.fonts.sora.regular,
      marginTop: 14,
      textAlign: 'center',
      color: colors.muted,
      fontSize: 13,
    },
    helpLink: {
      fontFamily: colors.fonts.sora.semiBold,
      color: colors.gray[600],
      fontWeight: '600',
    },
    verifyButton: {
      minHeight: 56,
      borderRadius: 18,
    },
  });
}
