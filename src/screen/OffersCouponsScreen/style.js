import { StyleSheet } from 'react-native';

export default function createStyles(colors) {
  const isDark = Boolean(colors?.isDark);


  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: isDark ? colors.navy[900] : '#F4F6F8',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingBottom: 14,
      backgroundColor: isDark ? colors.navy[900] : '#F4F6F8',
    },
    headerBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 18,
      color: isDark ? colors.white : '#111827',
      textAlign: 'center',
    },
    scroll: {
      paddingHorizontal: 16,
      paddingTop: 6,
    },

    // Top Input Box
    couponInputCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? colors.navy[800] : '#FFFFFF',
      borderRadius: 16,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: isDark ? colors.navy[700] : '#E8EDF2',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.03,
      shadowRadius: 3,
      elevation: 1,
      marginBottom: 6,
    },
    giftIconBox: {
      marginRight: 10,
    },
    couponInput: {
      fontFamily: colors.fonts.sora.medium,
      flex: 1,
      fontSize: 14,
      color: isDark ? colors.white : '#111827',
      paddingVertical: 4,
    },
    topApplyBtn: {
      backgroundColor: isDark ? colors.alpha.orange20 : '#FFF1E8',
      paddingHorizontal: 18,
      paddingVertical: 8,
      borderRadius: 14,
    },
    topApplyBtnText: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 13,
      color: '#FF7A00',
    },

    // Section Header
    sectionHeader: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 11,
      letterSpacing: 0.8,
      color: isDark ? colors.navy[300] : '#8A94A6',
      marginTop: 18,
      marginBottom: 10,
      textTransform: 'uppercase',
    },

    // Coupon Offer Card
    offerCard: {
      backgroundColor: isDark ? colors.navy[800] : '#FFFFFF',
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: isDark ? colors.navy[700] : '#E8EDF2',
      borderLeftWidth: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.03,
      shadowRadius: 3,
      elevation: 1,
    },
    offerTitle: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 15,
      color: isDark ? colors.white : '#111827',
    },
    offerSubtitle: {
      fontFamily: colors.fonts.sora.regular,
      fontSize: 12,
      color: isDark ? colors.navy[300] : '#8E9CAE',
      marginTop: 3,
      marginBottom: 14,
    },
    offerBottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    codeTagWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    codeTag: {
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: isDark ? colors.navy[600] : '#D0DFE8',
      backgroundColor: isDark ? colors.navy[700] : '#F8FAFC',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
    },
    codeTagText: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 12,
      color: isDark ? colors.white : '#111827',
      letterSpacing: 0.5,
    },
    expiryText: {
      fontFamily: colors.fonts.sora.regular,
      fontSize: 11,
      color: isDark ? colors.navy[300] : '#8E9CAE',
      marginLeft: 8,
    },
    cardApplyBtn: {
      backgroundColor: '#FF7A00',
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#FF7A00',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3,
      elevation: 2,
    },
    cardApplyBtnApplied: {
      backgroundColor: isDark ? colors.alpha.greenDark20 : '#E6F8EF',
      shadowOpacity: 0,
      elevation: 0,
    },
    cardApplyBtnText: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 13,
      color: '#FFFFFF',
    },
    cardApplyBtnTextApplied: {
      color: '#10B981',
    },

    // Expired Card
    expiredCard: {
      backgroundColor: isDark ? colors.navy[800] : '#FFFFFF',
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: isDark ? colors.navy[700] : '#E8EDF2',
      borderLeftWidth: 5,
      borderLeftColor: isDark ? colors.navy[600] : '#CBD5E1',
    },
    expiredTitle: {
      fontFamily: colors.fonts.sora.semiBold,
      fontSize: 15,
      color: isDark ? colors.navy[200] : '#64748B',
    },
    expiredSubtitle: {
      fontFamily: colors.fonts.sora.regular,
      fontSize: 12,
      color: isDark ? colors.navy[400] : '#94A3B8',
      marginTop: 3,
      marginBottom: 12,
    },
    usedTag: {
      alignSelf: 'flex-start',
      backgroundColor: isDark ? colors.navy[700] : '#F1F5F9',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 10,
    },
    usedTagText: {
      fontFamily: colors.fonts.sora.semiBold,
      fontSize: 11,
      color: isDark ? colors.navy[300] : '#64748B',
    },
  });
}
