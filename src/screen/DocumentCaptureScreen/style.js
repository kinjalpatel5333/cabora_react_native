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
    headerBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontFamily: colors.fonts?.sora?.bold || 'System',
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
    },

    scroll: {
      padding: 20,
    },

    // Sub-header Copy
    title: {
      fontFamily: colors.fonts?.sora?.bold || 'System',
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
    },
    hint: {
      fontFamily: colors.fonts?.sora?.regular || 'System',
      fontSize: 13.5,
      color: colors.gray[500],
      lineHeight: 19,
      marginBottom: 20,
    },

    // Viewfinder Camera Preview Box
    preview: {
      height: 180,
      borderRadius: 20,
      backgroundColor: '#0F172A',
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      overflow: 'hidden',
    },
    previewFilled: {
      backgroundColor: '#000000',
    },
    previewImage: {
      width: '100%',
      height: '100%',
    },

    // Corner Markers
    corner: {
      position: 'absolute',
      width: 24,
      height: 24,
      borderColor: '#F97316',
    },
    cornerTL: {
      top: 16,
      left: 16,
      borderTopWidth: 3,
      borderLeftWidth: 3,
    },
    cornerTR: {
      top: 16,
      right: 16,
      borderTopWidth: 3,
      borderRightWidth: 3,
    },
    cornerBL: {
      bottom: 16,
      left: 16,
      borderBottomWidth: 3,
      borderLeftWidth: 3,
    },
    cornerBR: {
      bottom: 16,
      right: 16,
      borderBottomWidth: 3,
      borderRightWidth: 3,
    },

    // Paper Illustration
    paper: {
      width: '60%',
      height: '60%',
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      padding: 12,
      justifyContent: 'center',
      gap: 6,
    },
    line: {
      height: 5,
      borderRadius: 2.5,
      backgroundColor: '#CBD5E1',
    },

    // Edges Detected Pill
    edgesPill: {
      position: 'absolute',
      bottom: 12,
      backgroundColor: '#22C55E',
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 20,
    },
    edgesPillText: {
      fontFamily: colors.fonts?.sora?.bold || 'System',
      fontSize: 12,
      fontWeight: '700',
      color: colors.white,
    },

    // Source Selector Tabs
    sourceRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 20,
    },
    sourceBtn: {
      flex: 1,
      height: 48,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.card,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    sourceOn: {
      borderColor: colors.primary,
      backgroundColor: colors.orange.subtleBg,
    },
    sourceLabel: {
      fontFamily: colors.fonts?.sora?.bold || 'System',
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
    },
    sourceLabelOn: {
      color: colors.primary,
    },

    // Uploading File Card
    fileCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
      position: 'relative',
    },
    fileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    fileIcon: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: colors.orange.accentBg,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    fileCopy: {
      flex: 1,
    },
    fileName: {
      fontFamily: colors.fonts?.sora?.bold || 'System',
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
    },
    fileMeta: {
      fontFamily: colors.fonts?.sora?.regular || 'System',
      fontSize: 12,
      color: colors.gray[500],
      marginTop: 2,
    },
    closeBtn: {
      padding: 4,
    },
    filePct: {
      position: 'absolute',
      top: 36,
      right: 16,
      fontFamily: colors.fonts?.sora?.bold || 'System',
      fontSize: 13,
      fontWeight: '800',
      color: colors.primary,
    },
    track: {
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.gray[100],
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      borderRadius: 3,
      backgroundColor: colors.primary,
    },

    // Checklist Card
    checklist: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 18,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    checkLabel: {
      fontFamily: colors.fonts?.sora?.bold || 'System',
      fontSize: 11.5,
      fontWeight: '700',
      color: '#64748B',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      marginBottom: 14,
    },
    checkRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 10,
    },
    checkText: {
      fontFamily: colors.fonts?.sora?.medium || 'System',
      fontSize: 13,
      fontWeight: '500',
      color: colors.text,
      flex: 1,
    },

    // Footer Navigation Bar
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 20,
      paddingTop: 14,
      backgroundColor: colors.card,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    footerBtn: {
      flex: 1,
      height: 52,
    },
  });
}
