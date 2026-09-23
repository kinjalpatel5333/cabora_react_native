import { StyleSheet } from 'react-native';

export default function createStyles(theme) {
  const { colors, isDark } = theme;

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
      fontSize: 18,
      fontWeight: '700',
      color: isDark ? colors.white : '#111827',
      textAlign: 'center',
    },
    scroll: {
      paddingHorizontal: 16,
      paddingTop: 8,
    },

    // Credit Card Preview
    cardPreview: {
      height: 196,
      borderRadius: 20,
      backgroundColor: '#0B192C',
      padding: 20,
      justifyContent: 'space-between',
      overflow: 'hidden',
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.18,
      shadowRadius: 10,
      elevation: 6,
      position: 'relative',
    },
    cardAccentCircle: {
      position: 'absolute',
      right: -40,
      top: -30,
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: '#352118',
      opacity: 0.8,
    },
    cardAccentCircle2: {
      position: 'absolute',
      right: -20,
      bottom: -60,
      width: 160,
      height: 160,
      borderRadius: 80,
      backgroundColor: '#241711',
      opacity: 0.7,
    },
    cardTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      zIndex: 1,
    },
    cardLabel: {
      fontSize: 9,
      fontWeight: '700',
      letterSpacing: 0.8,
      color: '#8A9DB5',
      marginBottom: 3,
      textTransform: 'uppercase',
    },
    cardHolderName: {
      fontSize: 13,
      fontWeight: '700',
      color: '#FFFFFF',
      letterSpacing: 0.5,
    },
    cardExpiry: {
      fontSize: 13,
      fontWeight: '700',
      color: '#FFFFFF',
      textAlign: 'right',
    },
    chipBox: {
      width: 42,
      height: 32,
      borderRadius: 6,
      backgroundColor: '#E5B869',
      padding: 4,
      justifyContent: 'space-around',
      zIndex: 1,
    },
    chipLine: {
      height: 1.5,
      backgroundColor: '#B28236',
      borderRadius: 1,
    },
    cardBottomRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1,
    },
    cardNumberText: {
      fontSize: 18,
      fontWeight: '700',
      color: '#FFFFFF',
      letterSpacing: 2,
    },
    networkBadge: {
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 4,
    },
    networkText: {
      fontSize: 10,
      fontWeight: '800',
      color: '#1E293B',
      letterSpacing: 0.5,
    },

    // Form inputs
    formGroup: {
      marginBottom: 14,
    },
    inputLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: isDark ? colors.navy[200] : '#475569',
      marginBottom: 6,
    },
    input: {
      backgroundColor: isDark ? colors.navy[800] : '#FFFFFF',
      borderWidth: 1.2,
      borderColor: isDark ? colors.navy[700] : '#E2E8F0',
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 15,
      color: isDark ? colors.white : '#111827',
      fontWeight: '500',
    },
    inputFocused: {
      borderColor: '#FF7A00',
      borderWidth: 2,
    },
    rowFields: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    halfField: {
      flex: 1,
    },
    fieldGap: {
      width: 14,
    },

    // Save this card card
    saveCardRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: isDark ? colors.navy[800] : '#FFFFFF',
      borderRadius: 14,
      padding: 16,
      borderWidth: 1,
      borderColor: isDark ? colors.navy[700] : '#E2E8F0',
      marginBottom: 14,
    },
    saveCardTextWrap: {
      flex: 1,
      paddingRight: 10,
    },
    saveCardTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: isDark ? colors.white : '#111827',
    },
    saveCardSub: {
      fontSize: 11,
      color: isDark ? colors.navy[300] : '#8E9CAE',
      marginTop: 2,
    },

    // Security Banner
    securityBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? colors.alpha.greenDark20 : '#EBF9F1',
      borderWidth: 1,
      borderColor: isDark ? colors.green[700] : '#A7F3D0',
      borderRadius: 12,
      padding: 12,
      marginBottom: 20,
    },
    securityText: {
      flex: 1,
      fontSize: 12,
      color: isDark ? colors.green[300] : '#047857',
      marginLeft: 10,
      lineHeight: 16,
    },

    // Footer actions
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 12,
      backgroundColor: isDark ? colors.navy[900] : '#F4F6F8',
      borderTopWidth: 1,
      borderTopColor: isDark ? colors.navy[800] : '#ECEFF2',
    },
    cancelBtn: {
      flex: 1,
      height: 50,
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: isDark ? colors.navy[600] : '#CBD5E1',
      backgroundColor: isDark ? colors.navy[800] : '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    cancelBtnText: {
      fontSize: 15,
      fontWeight: '700',
      color: isDark ? colors.white : '#111827',
    },
    addBtn: {
      flex: 2,
      height: 50,
      borderRadius: 16,
      backgroundColor: '#FF7A00',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#FF7A00',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 3,
    },
    addBtnText: {
      fontSize: 15,
      fontWeight: '700',
      color: '#FFFFFF',
    },
  });
}
