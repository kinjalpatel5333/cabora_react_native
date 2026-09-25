import { StyleSheet } from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },

    // Header
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.surface,
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
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 18,
      color: colors.text,
    },

    scrollContent: {
      paddingBottom: 40,
    },

    // Top Progress Card
    progressCard: {
      backgroundColor: colors.surface,
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
    progressTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    progressTitle: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 16,
      color: colors.text,
    },
    progressPercent: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 15,
      color: colors.primary,
    },
    progressSub: {
      fontFamily: colors.fonts.sora.medium,
      fontSize: 13,
      color: colors.textMuted,
      marginTop: 3,
    },
    track: {
      height: 8,
      backgroundColor: colors.background,
      borderRadius: 4,
      marginTop: 14,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 4,
    },

    // Section Titles
    sectionTitle: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 11.5,
      color: colors.textMuted,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      marginHorizontal: 16,
      marginTop: 20,
      marginBottom: 10,
    },

    // Items List
    itemsList: {
      gap: 10,
      marginHorizontal: 16,
    },
    checkCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      paddingVertical: 14,
      paddingHorizontal: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1.5,
      borderColor: colors.border,
      shadowColor: colors.black,
      shadowOpacity: 0.02,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 1 },
      elevation: 1,
    },
    checkCardDone: {
      borderColor: colors.green[300],
      backgroundColor: colors.surface,
    },
    checkLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
      marginRight: 8,
    },
    checkText: {
      fontFamily: colors.fonts.sora.semiBold,
      fontSize: 13.5,
      color: colors.text,
      flex: 1,
      lineHeight: 18,
    },
    doneText: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 12.5,
      color: colors.green[600],
    },

    // Warning Banner
    warningCard: {
      backgroundColor: colors.amber[50],
      borderWidth: 1.2,
      borderColor: colors.amber[200],
      borderRadius: 16,
      padding: 14,
      marginHorizontal: 16,
      marginTop: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    warningText: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 13,
      color: colors.amber[800],
      flex: 1,
    },

    // Success Banner
    successCard: {
      backgroundColor: colors.green[50],
      borderWidth: 1.2,
      borderColor: colors.green[300],
      borderRadius: 16,
      padding: 14,
      marginHorizontal: 16,
      marginTop: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    successText: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 13,
      color: colors.green[800],
      flex: 1,
    },
  });
}
