import {StyleSheet, Dimensions} from 'react-native';

const SCREEN_W = Dimensions.get('window').width;
const H_PAD = 20;
const PKG_GAP = 12;
export const PKG_CARD_W = (SCREEN_W - H_PAD * 2 - PKG_GAP) / 2;

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
      paddingHorizontal: 12,
      paddingBottom: 10,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerBtn: {
      width: 40,
      height: 40,
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
      paddingHorizontal: H_PAD,
      paddingTop: 12,
    },
    section: {
      marginBottom: 20,
    },
    sectionLabel: {
      color: colors.textMuted,
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.1,
      marginBottom: 10,
    },
    packageGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: PKG_GAP,
    },
    packageCard: {
      width: PKG_CARD_W,
      backgroundColor: colors.card,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: colors.border,
      padding: 10,
      position: 'relative',
    },
    packageCardActive: {
      backgroundColor: colors.isDark ? colors.alpha.orange18 : colors.orange[50],
      borderColor: colors.primary,
    },
    packageCheck: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    packageHours: {
      color: colors.text,
      fontSize: 13,
      fontWeight: '700',
      paddingRight: 20,
    },
    packageKm: {
      color: colors.textMuted,
      fontSize: 11,
      fontWeight: '400',
      marginTop: 1,
    },
    packagePrice: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '800',
      marginTop: 8,
      letterSpacing: -0.3,
    },
    packagePriceActive: {
      color: colors.primary,
    },
    packageAfter: {
      color: colors.textMuted,
      fontSize: 11,
      fontWeight: '400',
      marginTop: 1,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
    },
    whereRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingBottom: 14,
    },
    pinIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.isDark ? colors.alpha.orange20 : colors.orange[100],
      alignItems: 'center',
      justifyContent: 'center',
    },
    whereCopy: {
      flex: 1,
      minWidth: 0,
    },
    whereTitle: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '700',
    },
    whereMeta: {
      color: colors.textMuted,
      fontSize: 12,
      fontWeight: '400',
      marginTop: 2,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
      marginBottom: 12,
    },
    scheduleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    editBtn: {
      paddingVertical: 6,
      paddingHorizontal: 4,
    },
    editText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '700',
    },
    vehicleScroll: {
      paddingRight: 8,
      gap: 8,
    },
    vehicleCard: {
      width: 108,
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: colors.border,
      padding: 10,
    },
    vehicleCardActive: {
      backgroundColor: colors.isDark ? colors.alpha.orange18 : colors.orange[50],
      borderColor: colors.primary,
    },
    vehicleName: {
      color: colors.text,
      fontSize: 13,
      fontWeight: '700',
      marginTop: 6,
    },
    vehiclePrice: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '800',
      marginTop: 1,
    },
    vehiclePriceActive: {
      color: colors.primary,
    },
    vehicleMeta: {
      color: colors.textMuted,
      fontSize: 10,
      fontWeight: '400',
      marginTop: 1,
    },
    infoBanner: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
      padding: 14,
      marginBottom: 8,
    },
    infoText: {
      flex: 1,
      color: colors.textMuted,
      fontSize: 13,
      fontWeight: '400',
      lineHeight: 18,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      paddingHorizontal: 20,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.card,
    },
    fareCopy: {
      flex: 1,
      minWidth: 0,
    },
    fareLabel: {
      color: colors.textMuted,
      fontSize: 12,
      fontWeight: '500',
    },
    fareValue: {
      color: colors.text,
      fontSize: 26,
      fontWeight: '800',
      marginTop: 2,
      letterSpacing: -0.4,
    },
    fareNote: {
      color: colors.textMuted,
      fontSize: 11,
      fontWeight: '400',
      marginTop: 2,
    },
    bookBtn: {
      backgroundColor: colors.primary,
      paddingVertical: 14,
      paddingHorizontal: 36,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bookText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: '700',
    },
  });
}
