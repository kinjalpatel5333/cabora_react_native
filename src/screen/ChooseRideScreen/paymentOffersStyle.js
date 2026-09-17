import {StyleSheet} from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'transparent',
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(13, 43, 71, 0.28)',
    },
    sheet: {
      backgroundColor: colors.white,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingHorizontal: 18,
      paddingTop: 10,
      overflow: 'hidden',
      shadowColor: colors.navy[900],
      shadowOpacity: 0.16,
      shadowRadius: 20,
      shadowOffset: {width: 0, height: -4},
      elevation: 24,
    },
    grabber: {
      alignSelf: 'center',
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.gray[200],
      marginBottom: 14,
    },
    grabberHit: {
      alignItems: 'center',
      paddingTop: 2,
      paddingBottom: 6,
    },
    title: {
      color: colors.navy[900],
      fontSize: 24,
      fontWeight: '800',
      marginBottom: 16,
    },
    list: {
      flexGrow: 0,
      flexShrink: 1,
    },
    listContent: {
      gap: 10,
      paddingBottom: 14,
    },
    methodCard: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: colors.gray[200],
      borderRadius: 16,
      paddingVertical: 14,
      paddingHorizontal: 14,
      backgroundColor: colors.white,
    },
    methodCardActive: {
      borderColor: colors.orange[500],
      borderWidth: 2,
    },
    methodIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.gray[100],
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    methodIconActive: {
      backgroundColor: colors.orange[500],
    },
    methodCopy: {
      flex: 1,
      minWidth: 0,
    },
    methodTitle: {
      color: colors.navy[900],
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 2,
    },
    methodSub: {
      color: colors.gray[500],
      fontSize: 13,
      fontWeight: '500',
    },
    check: {
      marginLeft: 8,
    },
    offerCard: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: colors.gray[200],
      borderRadius: 16,
      paddingVertical: 12,
      paddingHorizontal: 14,
      marginBottom: 16,
      backgroundColor: colors.white,
    },
    offerIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.gray[100],
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    offerCode: {
      flex: 1,
      color: colors.navy[900],
      fontSize: 16,
      fontWeight: '800',
    },
    appliedBtn: {
      backgroundColor: colors.orange[500],
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 12,
    },
    appliedText: {
      color: colors.white,
      fontSize: 13,
      fontWeight: '700',
    },
    saveBtn: {
      backgroundColor: colors.orange[500],
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    saveText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: '800',
    },
  });
}
