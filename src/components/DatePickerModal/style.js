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
      marginBottom: 16,
    },
    title: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 18,
      color: colors.text,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.isDark ? colors.gray?.[700] || '#374151' : colors.gray?.[100] || '#F3F4F6',
      alignItems: 'center',
      justifyContent: 'center',
    },
    monthNavRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
      paddingHorizontal: 4,
    },
    monthTitle: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 16,
      color: colors.text,
    },
    navBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.isDark ? colors.gray?.[800] || '#1F2937' : colors.gray?.[100] || '#F3F4F6',
      alignItems: 'center',
      justifyContent: 'center',
    },
    yearScroll: {
      maxHeight: 38,
      marginBottom: 16,
    },
    yearScrollContent: {
      gap: 8,
      paddingHorizontal: 4,
    },
    yearChip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 12,
      backgroundColor: colors.isDark ? colors.gray?.[800] || '#1F2937' : colors.gray?.[100] || '#F3F4F6',
      borderWidth: 1,
      borderColor: 'transparent',
    },
    yearChipActive: {
      backgroundColor: colors.orange?.[500] || '#FF5500',
      borderColor: colors.orange?.[600] || '#EA580C',
    },
    yearChipText: {
      fontFamily: colors.fonts.sora.semiBold,
      fontSize: 13,
      color: colors.text,
    },
    yearChipTextActive: {
      fontFamily: colors.fonts.sora.bold,
      color: '#FFFFFF',
    },
    weekHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
      paddingHorizontal: 4,
    },
    weekDayText: {
      width: '14.28%',
      textAlign: 'center',
      fontFamily: colors.fonts.sora.semiBold,
      fontSize: 12,
      color: colors.muted || '#6B7280',
    },
    daysGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 20,
    },
    dayCell: {
      width: '14.28%',
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 2,
    },
    dayInner: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dayInnerSelected: {
      backgroundColor: colors.orange?.[500] || '#FF5500',
    },
    dayText: {
      fontFamily: colors.fonts.sora.medium,
      fontSize: 14,
      color: colors.text,
    },
    dayTextSelected: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 14,
      color: '#FFFFFF',
    },
    confirmBtn: {
      backgroundColor: colors.orange?.[500] || '#FF5500',
      borderRadius: 14,
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
    },
    confirmBtnText: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 15,
      color: '#FFFFFF',
    },
  });
}
