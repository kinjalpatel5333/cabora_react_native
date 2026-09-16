import {StyleSheet} from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.white,
      paddingHorizontal: 24,
    },
    heroIcon: {
      width: 72,
      height: 72,
      borderRadius: 24,
      backgroundColor: colors.orange[100],
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 18,
    },
    kicker: {
      color: colors.orange[600],
      fontSize: 12,
      fontWeight: '800',
      letterSpacing: 1.2,
      marginBottom: 8,
    },
    title: {
      color: colors.navy[900],
      fontSize: 28,
      fontWeight: '800',
      marginBottom: 10,
    },
    body: {
      color: colors.gray[500],
      fontSize: 15,
      fontWeight: '500',
      lineHeight: 22,
      marginBottom: 20,
    },
    card: {
      flexDirection: 'row',
      gap: 12,
      backgroundColor: colors.gray[100],
      borderRadius: 16,
      padding: 14,
    },
    cardText: {
      flex: 1,
      color: colors.navy[700],
      fontSize: 13,
      fontWeight: '500',
      lineHeight: 19,
    },
    hintBtn: {
      marginTop: 14,
      alignItems: 'center',
    },
    hintText: {
      color: colors.orange[600],
      fontSize: 13,
      fontWeight: '700',
      textAlign: 'center',
    },
  });
}
