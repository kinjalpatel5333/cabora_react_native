import {StyleSheet} from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.navy[25],
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      marginBottom: 8,
      backgroundColor: colors.white,
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
      color: colors.navy[900],
      fontSize: 17,
      fontWeight: '700',
    },
    scroll: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 28,
    },
    progressCard: {
      backgroundColor: colors.white,
      borderRadius: 18,
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
      color: colors.navy[900],
      fontSize: 16,
      fontWeight: '800',
    },
    progressPct: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: '800',
    },
    progressSub: {
      color: colors.gray[500],
      fontSize: 13,
      lineHeight: 18,
      marginBottom: 12,
    },
    track: {
      height: 8,
      borderRadius: 999,
      backgroundColor: colors.navy[100],
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      borderRadius: 999,
      backgroundColor: colors.primary,
    },
    section: {
      color: colors.gray[500],
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.8,
      marginBottom: 10,
    },
    card: {
      backgroundColor: colors.white,
      borderRadius: 18,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.gray[200],
    },
    cardRejected: {
      backgroundColor: colors.red[100],
      borderColor: '#F6C9C9',
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
      minWidth: 0,
    },
    cardTitle: {
      color: colors.navy[900],
      fontSize: 15,
      fontWeight: '700',
      marginBottom: 2,
    },
    cardMeta: {
      color: colors.gray[500],
      fontSize: 13,
      lineHeight: 18,
      marginBottom: 8,
    },
    cardMetaRejected: {
      color: colors.red[600],
    },
    action: {
      flexShrink: 0,
      alignSelf: 'flex-end',
      minWidth: 96,
      minHeight: 30,
      paddingHorizontal: 22,
      borderRadius: 10,
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
      backgroundColor: colors.amber[100],
      borderRadius: 16,
      padding: 14,
      marginTop: 6,
    },
    warningText: {
      flex: 1,
      color: colors.amber[600],
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
