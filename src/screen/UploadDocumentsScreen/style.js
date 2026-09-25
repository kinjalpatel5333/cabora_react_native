import { StyleSheet } from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },

    // Header Bar
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingBottom: 12,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerIconBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 18,
      color: colors.text,
    },

    scrollContent: {
      paddingTop: 16,
      paddingBottom: 30,
    },

    // Top Progress Card
    progressCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 18,
      marginHorizontal: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    progressTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    progressCardTitle: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 16,
      color: colors.text,
    },
    progressPctText: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 16,
      color: colors.primary,
    },
    progressCardSub: {
      fontFamily: colors.fonts.sora.regular,
      fontSize: 13,
      color: colors.gray[500],
      marginBottom: 14,
    },
    progressTrack: {
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.gray[100],
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 4,
      backgroundColor: colors.primary,
    },

    // Section Header
    sectionTitle: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 12,
      color: '#64748B',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      marginHorizontal: 16,
      marginTop: 20,
      marginBottom: 12,
    },

    // Documents List
    docsList: {
      gap: 12,
      marginHorizontal: 16,
    },
    docCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: colors.border,
    },
    docCardRejected: {
      borderColor: '#FCA5A5',
      backgroundColor: '#FFF5F5',
    },
    docLeft: {
      flexDirection: 'row',
      alignItems: 'flex-start',
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
      marginTop: 2,
    },
    iconBoxApproved: {
      backgroundColor: colors.green.mint,
    },
    iconBoxRejected: {
      backgroundColor: colors.red.light,
    },
    iconBoxPending: {
      backgroundColor: colors.gray[100],
    },
    docInfo: {
      flex: 1,
    },
    docTitle: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 15,
      color: colors.text,
      marginBottom: 2,
    },
    docSub: {
      fontFamily: colors.fonts.sora.regular,
      fontSize: 12.5,
      color: colors.gray[500],
      marginBottom: 8,
    },
    docSubRejected: {
      color: '#DC2626',
    },

    // Status Pills
    statusPill: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      gap: 5,
    },
    pillApproved: {
      backgroundColor: colors.green.mint,
    },
    pillRejected: {
      backgroundColor: colors.red.badge,
    },
    pillPending: {
      backgroundColor: colors.gray[100],
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    dotApproved: {
      backgroundColor: colors.green[700],
    },
    dotRejected: {
      backgroundColor: colors.danger,
    },
    dotPending: {
      backgroundColor: colors.gray[600],
    },
    statusPillText: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 11.5,
    },
    pillTextApproved: {
      color: colors.green[700],
    },
    pillTextRejected: {
      color: colors.danger,
    },
    pillTextPending: {
      color: colors.gray[700],
    },

    // Actions (Right Side)
    docRight: {
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    eyeBtn: {
      padding: 8,
    },
    reuploadBtn: {
      backgroundColor: '#EF4444',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 12,
    },
    reuploadBtnText: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 13,
      color: colors.white,
    },
    uploadBtn: {
      backgroundColor: colors.primary,
      paddingHorizontal: 18,
      paddingVertical: 8,
      borderRadius: 12,
    },
    uploadBtnText: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 13,
      color: colors.white,
    },

    // Amber Notice Card
    amberNoticeCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFBEB',
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 16,
      marginTop: 20,
      borderWidth: 1,
      borderColor: '#FDE68A',
    },
    amberNoticeText: {
      flex: 1,
      fontFamily: colors.fonts.sora.medium,
      fontSize: 13,
      color: '#92400E',
      lineHeight: 18,
    },

    // Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: colors.card || '#FFFFFF',
      borderRadius: 24,
      padding: 24,
      width: '100%',
      maxWidth: 380,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 10,
    },
    statusIconContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    iconApproved: {
      backgroundColor: '#E4F7EC',
    },
    iconRejected: {
      backgroundColor: '#FEE2E2',
    },
    iconPending: {
      backgroundColor: '#FEF3C7',
    },
    modalTitle: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 20,
      color: colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    modalSub: {
      fontFamily: colors.fonts.sora.regular,
      fontSize: 13.5,
      color: colors.gray[500] || '#64748B',
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 18,
    },
    modalBadge: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 20,
      marginBottom: 20,
    },
    modalBadgeApproved: {
      backgroundColor: '#DCFCE7',
    },
    modalBadgeRejected: {
      backgroundColor: '#FEE2E2',
    },
    modalBadgePending: {
      backgroundColor: '#FEF3C7',
    },
    modalBadgeTextApproved: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 12,
      color: '#15803D',
    },
    modalBadgeTextRejected: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 12,
      color: '#DC2626',
    },
    modalBadgeTextPending: {
      fontFamily: colors.fonts.sora.extraBold,
      fontSize: 12,
      color: '#D97706',
    },
    modalBtn: {
      backgroundColor: colors.primary || '#FF7A00',
      width: '100%',
      paddingVertical: 14,
      borderRadius: 16,
      alignItems: 'center',
    },
    modalBtnText: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 15,
      color: '#FFFFFF',
    },

    // Image Preview Modal
    previewOverlay: {
      flex: 1,
      backgroundColor: '#000000',
      justifyContent: 'center',
      alignItems: 'center',
    },
    previewCloseBtn: {
      position: 'absolute',
      top: 50,
      right: 20,
      zIndex: 10,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    previewImage: {
      width: '90%',
      height: '75%',
      resizeMode: 'contain',
    },
  });
}
