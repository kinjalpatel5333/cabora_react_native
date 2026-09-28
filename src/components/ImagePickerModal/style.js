import { StyleSheet } from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: colors.alpha?.black55 || 'rgba(0,0,0,0.55)',
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingTop: 12,
      paddingHorizontal: 20,
      paddingBottom: 24,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 20,
    },
    dragHandle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.isDark ? colors.gray?.[600] || '#4B5563' : colors.gray?.[200] || '#E5E7EB',
      alignSelf: 'center',
      marginBottom: 14,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    title: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 18,
      color: colors.text,
    },
    subtitle: {
      fontFamily: colors.fonts.sora.regular,
      fontSize: 13,
      color: colors.muted || '#6B7280',
      marginBottom: 20,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.isDark ? colors.gray?.[700] || '#374151' : colors.gray?.[100] || '#F3F4F6',
      alignItems: 'center',
      justifyContent: 'center',
    },
    optionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
      borderRadius: 18,
      backgroundColor: colors.isDark ? colors.navy?.[900] || '#0F1E36' : colors.gray?.[50] || '#F9FAFB',
      borderWidth: 1,
      borderColor: colors.border || '#E5E7EB',
      marginBottom: 12,
    },
    optionIconWrap: {
      width: 46,
      height: 46,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    },
    optionIconCamera: {
      backgroundColor: colors.isDark ? colors.alpha?.orange18 || 'rgba(255,112,6,0.18)' : colors.orange?.[50] || '#FFF8F2',
    },
    optionIconGallery: {
      backgroundColor: colors.isDark ? colors.alpha?.blue20 || 'rgba(46,123,231,0.2)' : colors.blue?.[50] || '#EFF6FF',
    },
    optionCopy: {
      flex: 1,
    },
    optionTitle: {
      fontFamily: colors.fonts.sora.semiBold,
      fontSize: 15,
      color: colors.text,
      marginBottom: 2,
    },
    optionDesc: {
      fontFamily: colors.fonts.sora.regular,
      fontSize: 12,
      color: colors.muted || '#6B7280',
    },
    cancelBtn: {
      height: 48,
      borderRadius: 14,
      backgroundColor: colors.isDark ? colors.navy?.[800] || '#1F2937' : colors.gray?.[100] || '#F3F4F6',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 4,
    },
    cancelText: {
      fontFamily: colors.fonts.sora.semiBold,
      fontSize: 14,
      color: colors.text,
    },
  });
}
