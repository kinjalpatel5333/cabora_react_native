import {StyleSheet} from 'react-native';

export default function createStyles(colors) {
  const isDark = Boolean(colors?.isDark);

  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingBottom: 14,
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
      fontFamily: colors.fonts.sora.bold,
      fontSize: 18,
      color: colors.text,
      textAlign: 'center',
    },
    scroll: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 24,
      gap: 14,
    },
    /* Top Banner Card */
    topBannerCard: {
      backgroundColor: isDark ? colors.alpha.orange20 : '#FFF8F2',
      borderRadius: 18,
      borderWidth: 1,
      borderColor: isDark ? '#8B3900' : '#FFD7B5',
      padding: 16,
    },
    topBannerRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    topBannerIconBox: {
      width: 46,
      height: 46,
      borderRadius: 12,
      backgroundColor: isDark ? colors.card : '#FFFFFF',
      borderWidth: 1,
      borderColor: isDark ? colors.border : '#FFE3D0',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    },
    topBannerContent: {
      flex: 1,
    },
    topBannerTitle: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 15,
      color: colors.text,
    },
    topBannerSub: {
      fontFamily: colors.fonts.sora.medium,
      fontSize: 12.5,
      color: colors.textMuted,
      marginTop: 3,
    },
    topBannerDivider: {
      height: 1,
      backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#FFE8DA',
      marginVertical: 12,
    },
    topBannerFooterText: {
      fontFamily: colors.fonts.sora.medium,
      fontSize: 12,
      color: isDark ? '#FFA756' : '#C2410C',
    },

    /* Section Card */
    card: {
      backgroundColor: colors.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      shadowColor: colors.shadow,
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
    },
    sectionLabel: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 11.5,
      color: colors.textMuted,
      letterSpacing: 0.8,
      marginBottom: 14,
      textTransform: 'uppercase',
    },

    /* Route Stop */
    routeStopRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    stopDotWrap: {
      width: 14,
      alignItems: 'center',
      marginTop: 4,
      marginRight: 10,
    },
    stopDotPickup: {
      width: 9,
      height: 9,
      borderRadius: 4.5,
      backgroundColor: isDark ? colors.navy[200] : '#1E293B',
    },
    stopDotDrop: {
      width: 9,
      height: 9,
      borderRadius: 4.5,
      backgroundColor: '#FF7A00',
    },
    stopLine: {
      width: 2,
      height: 22,
      backgroundColor: isDark ? colors.navy[700] : '#E2E8F0',
      marginLeft: 6,
      marginVertical: 2,
    },
    stopInfo: {
      flex: 1,
    },
    stopTitle: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 13.5,
      color: colors.text,
    },
    stopSub: {
      fontFamily: colors.fonts.sora.regular,
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 2,
    },

    /* Details Rows */
    detailsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 10,
    },
    detailsLabel: {
      fontFamily: colors.fonts.sora.medium,
      fontSize: 13,
      color: colors.textMuted,
    },
    detailsValue: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 13,
      color: colors.text,
      textAlign: 'right',
      maxWidth: '60%',
    },
    cardDivider: {
      height: 1,
      backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
    },

    /* Action List Items */
    actionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
    },
    actionIconBox: {
      width: 38,
      height: 38,
      borderRadius: 10,
      backgroundColor: isDark ? colors.surface : '#F1F5F9',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    actionContent: {
      flex: 1,
      marginRight: 8,
    },
    actionTitle: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 13.5,
      color: colors.text,
    },
    actionSub: {
      fontFamily: colors.fonts.sora.regular,
      fontSize: 11.5,
      color: colors.textMuted,
      marginTop: 2,
    },

    /* Policy Notice Card */
    policyCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? colors.surface : '#F8FAFC',
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 14,
      paddingVertical: 12,
      gap: 10,
    },
    policyText: {
      flex: 1,
      fontFamily: colors.fonts.sora.medium,
      fontSize: 12,
      color: colors.textMuted,
      lineHeight: 17,
    },

    /* Bottom Action Bar */
    bottomBar: {
      backgroundColor: colors.card,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingHorizontal: 16,
      paddingTop: 12,
      flexDirection: 'row',
      gap: 12,
      shadowColor: colors.shadow,
      shadowOffset: {width: 0, height: -2},
      shadowOpacity: 0.05,
      shadowRadius: 6,
      elevation: 4,
    },
    cancelBtn: {
      flex: 1,
      height: 50,
      borderRadius: 14,
      backgroundColor: '#EF4444',
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelBtnText: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 15,
      color: '#FFFFFF',
    },
    saveBtn: {
      flex: 1,
      height: 50,
      borderRadius: 14,
      backgroundColor: '#FF7A00',
      alignItems: 'center',
      justifyContent: 'center',
    },
    saveBtnText: {
      fontFamily: colors.fonts.sora.bold,
      fontSize: 15,
      color: '#FFFFFF',
    },
  });
}
