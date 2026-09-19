import { StyleSheet } from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.slate[50],
    },

    // Header Bar
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.white,
      borderBottomWidth: 1,
      borderBottomColor: colors.slate[100],
    },
    headerIconBtn: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.slate[900],
    },

    scrollContent: {
      paddingBottom: 24,
    },

    // Navy Pro Card
    navyCard: {
      backgroundColor: colors.navy[975],
      borderRadius: 24,
      padding: 22,
      marginHorizontal: 16,
      marginTop: 14,
      position: 'relative',
      overflow: 'hidden',
    },
    navyDeco: {
      position: 'absolute',
      right: -40,
      top: -15,
      width: 190,
      height: 190,
      borderRadius: 95,
      backgroundColor: colors.alpha.white07,
    },
    proBadge: {
      backgroundColor: colors.orange[150],
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      alignSelf: 'flex-start',
    },
    proDot: {
      width: 7,
      height: 7,
      borderRadius: 3.5,
      backgroundColor: colors.orange[750],
    },
    proBadgeText: {
      color: colors.orange[700],
      fontSize: 13,
      fontWeight: '800',
    },
    priceText: {
      fontSize: 44,
      fontWeight: '900',
      color: colors.white,
      marginTop: 14,
      letterSpacing: -0.5,
    },
    subText: {
      fontSize: 13.5,
      fontWeight: '500',
      color: colors.navy[450],
      marginTop: 4,
    },
    divider: {
      height: 1,
      backgroundColor: colors.alpha.white12,
      marginTop: 18,
      marginBottom: 16,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    metaCol: {},
    metaLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.navy[550],
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      marginBottom: 4,
    },
    metaValue: {
      fontSize: 17,
      fontWeight: '800',
      color: colors.white,
    },

    // Threshold Card
    thresholdCard: {
      backgroundColor: colors.white,
      borderRadius: 20,
      padding: 18,
      marginHorizontal: 16,
      marginTop: 14,
      shadowColor: colors.black,
      shadowOpacity: 0.04,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    thresholdHead: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    thresholdTitle: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.slate[900],
    },
    thresholdSub: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.slate[500],
      marginTop: 2,
    },
    thresholdCount: {
      fontSize: 17,
      fontWeight: '900',
      color: colors.slate[900],
    },
    progressTrack: {
      height: 8,
      backgroundColor: colors.slate[100],
      borderRadius: 4,
      marginTop: 14,
      marginBottom: 12,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 4,
    },
    hintRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
    },
    hintIcon: {
      marginTop: 1,
    },
    hintText: {
      flex: 1,
      fontSize: 12.5,
      fontWeight: '500',
      color: colors.slate[500],
      lineHeight: 17,
    },

    // Benefits Card
    benefitsCard: {
      backgroundColor: colors.white,
      borderRadius: 20,
      padding: 20,
      marginHorizontal: 16,
      marginTop: 14,
      shadowColor: colors.black,
      shadowOpacity: 0.04,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    benefitsTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.slate[900],
      marginBottom: 16,
    },
    benefitList: {
      gap: 14,
    },
    benefitItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    benefitText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.slate[700],
    },

    // Bank Card
    bankCard: {
      backgroundColor: colors.white,
      borderRadius: 18,
      padding: 16,
      marginHorizontal: 16,
      marginTop: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: colors.black,
      shadowOpacity: 0.04,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    bankLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    bankInfo: {
      flex: 1,
    },
    bankName: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.slate[900],
    },
    bankSub: {
      fontSize: 12.5,
      fontWeight: '500',
      color: colors.slate[500],
      marginTop: 2,
    },
    changeText: {
      fontSize: 14,
      fontWeight: '800',
      color: colors.primary,
    },

    // Bottom Action Bar
    bottomBar: {
      backgroundColor: colors.white,
      borderTopWidth: 1,
      borderTopColor: colors.slate[100],
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    changePlanBtn: {
      flex: 1,
      height: 48,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: colors.navy[850],
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
    },
    changePlanText: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.navy[850],
    },
    cancelBtn: {
      flex: 1,
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelText: {
      fontSize: 14.5,
      fontWeight: '700',
      color: colors.red[600],
    },
  });
}
