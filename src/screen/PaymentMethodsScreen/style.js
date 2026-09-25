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
      paddingTop: 8,
    },
    sectionHeader: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 11,
      letterSpacing: 0.8,
      color: isDark ? colors.navy[300] : '#8A94A6',
      marginBottom: 10,
      textTransform: 'uppercase',
    },
    sectionHeaderOther: {
      marginTop: 20,
    },
    sectionHeaderPrefs: {
      marginTop: 4,
    },

    // Default card style
    defaultCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? colors.alpha.orange20 : '#FFF7F2',
      borderWidth: 1.5,
      borderColor: '#FF7A00',
      borderRadius: 16,
      padding: 16,
      marginBottom: 6,
    },
    defaultIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: isDark ? colors.navy[800] : '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    defaultCurrencySymbol: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 22,
      color: '#FF7A00',
    },
    defaultContent: {
      flex: 1,
      marginLeft: 14,
      justifyContent: 'center',
    },
    defaultTitle: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 15,
      color: isDark ? colors.white : '#111827',
    },
    defaultSubtitle: {
      fontFamily: colors.fonts.sora.regular,
      fontSize: 12,
      color: isDark ? colors.navy[300] : '#8E9CAE',
      marginTop: 3,
    },
    defaultBadgeText: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 12,
      color: '#FF7A00',
      marginTop: 4,
    },
    radioSelectedOuter: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: '#FF7A00',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 10,
    },
    radioSelectedInner: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: '#FF7A00',
    },

    // Regular card style
    methodCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? colors.navy[800] : '#FFFFFF',
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: isDark ? colors.navy[700] : '#E8EDF2',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.03,
      shadowRadius: 3,
      elevation: 1,
    },
    methodIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: isDark ? colors.navy[700] : '#EFF3F7',
      alignItems: 'center',
      justifyContent: 'center',
    },
    methodCurrencySymbol: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 20,
      color: isDark ? colors.navy[200] : '#475569',
    },
    methodContent: {
      flex: 1,
      marginLeft: 14,
      justifyContent: 'center',
    },
    methodTitle: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 15,
      color: isDark ? colors.white : '#111827',
    },
    methodSubtitle: {
      fontFamily: colors.fonts.sora.regular,
      fontSize: 12,
      color: isDark ? colors.navy[300] : '#8E9CAE',
      marginTop: 3,
    },
    radioUnselected: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: isDark ? colors.navy[500] : '#CBD5E1',
      marginLeft: 10,
    },
    activeBadge: {
      backgroundColor: isDark ? colors.alpha.greenDark20 : '#E6F8EF',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      marginLeft: 10,
    },
    activeBadgeText: {
      fontFamily: colors.fonts.sora.semiBold,
      fontSize: 12,
      color: '#10B981',
    },

    // Add card / UPI dashed container
    addCardContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 16,
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: isDark ? colors.navy[600] : '#D0DFE8',
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginBottom: 14,
      backgroundColor: 'transparent',
    },
    addCardIconBox: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: isDark ? colors.alpha.orange20 : '#FFF0E6',
      alignItems: 'center',
      justifyContent: 'center',
    },
    addCardTitle: {
      fontFamily: colors.fonts.sora.semiBold,
      flex: 1,
      fontSize: 14,
      color: '#FF7A00',
      marginLeft: 12,
    },

    // Preferences Card
    prefsCard: {
      backgroundColor: isDark ? colors.navy[800] : '#FFFFFF',
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderWidth: 1,
      borderColor: isDark ? colors.navy[700] : '#E8EDF2',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.03,
      shadowRadius: 3,
      elevation: 1,
    },
    prefRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    prefTextWrap: {
      flex: 1,
      paddingRight: 12,
    },
    prefTitle: {
      fontFamily: colors.fonts.sora.semiBold,
      fontSize: 14,
      color: isDark ? colors.white : '#111827',
    },
    prefSubtitle: {
      fontFamily: colors.fonts.sora.regular,
      fontSize: 12,
      color: isDark ? colors.navy[300] : '#8E9CAE',
      marginTop: 2,
    },
    prefDivider: {
      height: 1,
      backgroundColor: isDark ? colors.navy[700] : '#F1F5F9',
      marginVertical: 12,
    },

    // Footer note
    footerNote: {
      fontFamily: colors.fonts.sora.regular,
      fontSize: 12,
      color: isDark ? colors.navy[400] : '#8E9CAE',
      marginTop: 14,
      marginBottom: 20,
      paddingHorizontal: 2,
    },
  });
}
