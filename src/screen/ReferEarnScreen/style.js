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
      paddingTop: 6,
    },

    // Hero Card
    heroCard: {
      height: 200,
      borderRadius: 20,
      backgroundColor: '#0B192C',
      padding: 20,
      justifyContent: 'space-between',
      overflow: 'hidden',
      marginBottom: 14,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.16,
      shadowRadius: 10,
      elevation: 5,
      position: 'relative',
    },
    heroAccentCircle: {
      position: 'absolute',
      right: -50,
      top: -30,
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: '#352118',
      opacity: 0.85,
    },
    heroAccentCircle2: {
      position: 'absolute',
      right: -20,
      bottom: -60,
      width: 170,
      height: 170,
      borderRadius: 85,
      backgroundColor: '#241711',
      opacity: 0.7,
    },
    heroContent: {
      zIndex: 1,
    },
    heroHeading: {
      fontSize: 22,
      fontWeight: '800',
      color: '#FFFFFF',
      letterSpacing: 0.3,
    },
    heroSub: {
      fontSize: 13,
      color: '#94A3B8',
      lineHeight: 18,
      marginTop: 6,
      maxWidth: '92%',
    },
    earnedBadge: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 4,
      elevation: 2,
      zIndex: 1,
    },
    earnedBadgeText: {
      fontSize: 13,
      fontWeight: '700',
      color: '#111827',
      marginLeft: 8,
    },

    // White standard cards
    card: {
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

    // Your Code Card
    codeCardLabel: {
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 0.8,
      color: isDark ? colors.navy[300] : '#8A94A6',
      textTransform: 'uppercase',
      marginBottom: 6,
    },
    codeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    codeValueText: {
      fontSize: 22,
      fontWeight: '800',
      color: isDark ? colors.white : '#111827',
      letterSpacing: 1,
    },
    copyBtn: {
      backgroundColor: isDark ? colors.navy[700] : '#F1F5F9',
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 14,
    },
    copyBtnText: {
      fontSize: 12,
      fontWeight: '700',
      color: isDark ? colors.navy[200] : '#475569',
    },
    codeCardSub: {
      fontSize: 11,
      color: isDark ? colors.navy[400] : '#8E9CAE',
      marginTop: 8,
    },

    // Stats Grid Card
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    statCol: {
      flex: 1,
    },
    statValue: {
      fontSize: 20,
      fontWeight: '800',
      color: isDark ? colors.white : '#111827',
    },
    statLabel: {
      fontSize: 11,
      color: isDark ? colors.navy[300] : '#8E9CAE',
      marginTop: 2,
    },
    statDivider: {
      height: 1,
      backgroundColor: isDark ? colors.navy[700] : '#F1F5F9',
      marginVertical: 12,
    },
    statUnlockText: {
      fontSize: 11,
      color: isDark ? colors.navy[300] : '#8E9CAE',
    },

    // How It Works Card
    stepsHeader: {
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 0.8,
      color: isDark ? colors.navy[300] : '#8A94A6',
      textTransform: 'uppercase',
      marginBottom: 14,
    },
    stepItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 14,
    },
    stepItemLast: {
      marginBottom: 0,
    },
    stepIconBox: {
      width: 38,
      height: 38,
      borderRadius: 10,
      backgroundColor: isDark ? colors.alpha.orange20 : '#FFF0E6',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    },
    stepTextWrap: {
      flex: 1,
    },
    stepTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: isDark ? colors.white : '#111827',
    },
    stepSub: {
      fontSize: 11,
      color: isDark ? colors.navy[300] : '#8E9CAE',
      marginTop: 2,
    },

    // Terms
    termsWrap: {
      marginTop: 4,
      marginBottom: 20,
      paddingHorizontal: 2,
    },
    termsText: {
      fontSize: 11,
      color: isDark ? colors.navy[400] : '#8E9CAE',
    },
    termsLink: {
      fontSize: 11,
      fontWeight: '700',
      color: '#FF7A00',
      marginTop: 4,
    },

    // Footer Action Button
    footer: {
      paddingHorizontal: 16,
      paddingTop: 10,
      backgroundColor: isDark ? colors.navy[900] : '#F4F6F8',
      borderTopWidth: 1,
      borderTopColor: isDark ? colors.navy[800] : '#ECEFF2',
    },
    shareBtn: {
      height: 52,
      borderRadius: 16,
      backgroundColor: '#FF7A00',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#FF7A00',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 4,
    },
    shareBtnText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
    },
  });
}
