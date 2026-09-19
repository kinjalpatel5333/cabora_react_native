import { StyleSheet } from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.slate[50],
    },

    // Header
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
      paddingBottom: 40,
    },

    // Top Progress Card
    progressCard: {
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
    progressTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    progressTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.slate[900],
    },
    progressPercent: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.primary,
    },
    progressSub: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.slate[500],
      marginTop: 3,
    },
    track: {
      height: 8,
      backgroundColor: colors.slate[100],
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
      fontSize: 11.5,
      fontWeight: '700',
      color: colors.slate[500],
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
      backgroundColor: colors.white,
      borderRadius: 16,
      paddingVertical: 14,
      paddingHorizontal: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1.5,
      borderColor: colors.slate[200],
      shadowColor: colors.black,
      shadowOpacity: 0.02,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 1 },
      elevation: 1,
    },
    checkCardDone: {
      borderColor: colors.green[300],
      backgroundColor: colors.white,
    },
    checkLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
      marginRight: 8,
    },
    checkText: {
      fontSize: 13.5,
      fontWeight: '600',
      color: colors.slate[900],
      flex: 1,
      lineHeight: 18,
    },
    doneText: {
      fontSize: 12.5,
      fontWeight: '700',
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
      fontSize: 13,
      fontWeight: '700',
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
      fontSize: 13,
      fontWeight: '700',
      color: colors.green[800],
      flex: 1,
    },
  });
}
