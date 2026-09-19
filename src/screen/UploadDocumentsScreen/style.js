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
      paddingBottom: 20,
    },

    // Blocked Warning Banner Card
    blockedCard: {
      backgroundColor: colors.red[150],
      borderWidth: 1.2,
      borderColor: colors.red[250],
      borderRadius: 20,
      padding: 18,
      marginHorizontal: 16,
      marginTop: 14,
    },
    blockedHead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 6,
    },
    blockedTitle: {
      fontSize: 15.5,
      fontWeight: '800',
      color: colors.red[800],
    },
    blockedSub: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.red[600],
      lineHeight: 18,
    },

    // Section Title
    sectionTitle: {
      fontSize: 11.5,
      fontWeight: '700',
      color: colors.slate[500],
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      marginHorizontal: 16,
      marginTop: 20,
      marginBottom: 12,
    },

    // Document Cards
    docsList: {
      gap: 12,
      marginHorizontal: 16,
    },
    docCard: {
      backgroundColor: colors.white,
      borderRadius: 20,
      padding: 16,
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
    docCardExpired: {
      borderColor: colors.red[250],
      backgroundColor: colors.white,
    },
    docCardWarning: {
      borderColor: colors.amber[200],
      backgroundColor: colors.white,
    },
    docLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
      marginRight: 10,
    },
    docIconBox: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconBoxExpired: {
      backgroundColor: colors.red[200],
    },
    iconBoxWarning: {
      backgroundColor: colors.amber[100],
    },
    iconBoxVerified: {
      backgroundColor: colors.green[200],
    },
    iconBoxReview: {
      backgroundColor: colors.blue[50],
    },
    docInfo: {
      flex: 1,
    },
    docTitle: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.slate[900],
    },
    docSubExpired: {
      fontSize: 12.5,
      fontWeight: '500',
      color: colors.red[600],
      marginTop: 2,
    },
    docSubWarning: {
      fontSize: 12.5,
      fontWeight: '500',
      color: colors.amber[600],
      marginTop: 2,
    },
    docSubVerified: {
      fontSize: 12.5,
      fontWeight: '500',
      color: colors.slate[500],
      marginTop: 2,
    },
    docSubReview: {
      fontSize: 12.5,
      fontWeight: '500',
      color: colors.blue[550],
      marginTop: 2,
    },
    docRight: {
      alignItems: 'flex-end',
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 9,
      paddingVertical: 3,
      borderRadius: 12,
    },
    badgeExpired: {
      backgroundColor: colors.red[200],
    },
    badgeWarning: {
      backgroundColor: colors.amber[100],
    },
    badgeVerified: {
      backgroundColor: colors.green[200],
    },
    badgeReview: {
      backgroundColor: colors.blue[50],
    },
    statusDotExpired: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.red[600],
    },
    statusDotWarning: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.amber[600],
    },
    statusDotVerified: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.green[600],
    },
    statusDotReview: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.blue[550],
    },
    statusTextExpired: {
      fontSize: 11.5,
      fontWeight: '800',
      color: colors.red[600],
    },
    statusTextWarning: {
      fontSize: 11.5,
      fontWeight: '800',
      color: colors.amber[700],
    },
    statusTextVerified: {
      fontSize: 11.5,
      fontWeight: '800',
      color: colors.green[700],
    },
    statusTextReview: {
      fontSize: 11.5,
      fontWeight: '800',
      color: colors.blue[550],
    },
    actionLinkText: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: '800',
      marginTop: 4,
    },

    // Bottom Sticky Bar
    bottomBar: {
      backgroundColor: colors.white,
      borderTopWidth: 1,
      borderTopColor: colors.slate[100],
      paddingHorizontal: 16,
      paddingTop: 12,
    },
    uploadBtn: {
      backgroundColor: colors.primary,
      height: 52,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.primary,
      shadowOpacity: 0.25,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    uploadBtnText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: '800',
    },
    supportLink: {
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    supportLinkText: {
      color: colors.slate[500],
      fontSize: 14,
      fontWeight: '700',
    },
  });
}
