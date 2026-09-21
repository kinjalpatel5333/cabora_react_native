import {StyleSheet} from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      marginBottom: 8,
      backgroundColor: colors.card,
      borderBottomWidth: colors.isDark ? 1 : 0,
      borderBottomColor: colors.border,
      paddingBottom: 12,
    },
    headerBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      flex: 1,
      textAlign: 'center',
      color: colors.text,
      fontSize: 17,
      fontWeight: '700',
    },
    scroll: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 28,
    },
    progressCard: {
      backgroundColor: colors.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      marginBottom: 22,
    },
    progressTop: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12,
      marginBottom: 6,
    },
    progressTitle: {
      flex: 1,
      color: colors.text,
      fontSize: 16,
      fontWeight: '800',
    },
    progressPct: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: '800',
    },
    progressSub: {
      color: colors.muted,
      fontSize: 13,
      lineHeight: 18,
      marginBottom: 12,
    },
    track: {
      height: 8,
      borderRadius: 999,
      backgroundColor: colors.surface,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      borderRadius: 999,
      backgroundColor: colors.primary,
    },
    section: {
      color: colors.muted,
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.8,
      marginBottom: 10,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 18,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardRejected: {
      backgroundColor: colors.isDark ? 'rgba(231,61,61,0.18)' : colors.red[100],
      borderColor: colors.isDark ? 'rgba(231,61,61,0.35)' : '#F6C9C9',
    },
    cardRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },
    iconWrap: {
      width: 42,
      height: 42,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    copy: {
      flex: 1,
    },
    cardTitle: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '700',
      marginBottom: 2,
    },
    cardMeta: {
      color: colors.muted,
      fontSize: 13,
      lineHeight: 18,
      marginBottom: 10,
    },
    cardMetaRejected: {
      color: colors.isDark ? '#FCA5A5' : colors.red[600],
    },
    action: {
      alignSelf: 'flex-start',
      minWidth: 108,
      borderRadius: 999,
    },
    eyeBtn: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    warning: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      backgroundColor: colors.isDark ? 'rgba(244,165,38,0.15)' : colors.amber[100],
      borderRadius: 16,
      padding: 14,
      marginTop: 6,
    },
    warningText: {
      flex: 1,
      color: colors.isDark ? '#FCD34D' : colors.amber[600],
      fontSize: 13,
      lineHeight: 19,
      fontWeight: '600',
    },
    continue: {
      marginTop: 10,
      borderRadius: 999,
    },
  });
}
