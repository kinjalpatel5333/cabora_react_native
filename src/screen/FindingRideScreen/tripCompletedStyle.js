import {StyleSheet, Dimensions} from 'react-native';

const {width: SCREEN_W} = Dimensions.get('window');
const CIRCLE_SIZE = SCREEN_W * 0.82;

export default function createStyles(colors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.isDark ? colors.background : '#FFFFFF',
    },
    scrollFlex: {
      flex: 1,
      backgroundColor: colors.isDark ? colors.background : '#FFFFFF',
    },
    scrollContent: {
      flexGrow: 1,
    },

    // ----------------------------------------------------
    // HERO CARD (Curved bottom with background circle dome)
    // ----------------------------------------------------
    heroCard: {
      backgroundColor: colors.isDark ? '#261418' : '#FEF2F2',
      borderBottomLeftRadius: 36,
      borderBottomRightRadius: 36,
      overflow: 'hidden',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingBottom: 28,
      position: 'relative',
    },
    heroCardSuccess: {
      backgroundColor: colors.isDark ? colors.navy.darkBg2 : '#ECFDF5',
    },
    heroDomeCircle: {
      position: 'absolute',
      top: -CIRCLE_SIZE * 0.36,
      width: CIRCLE_SIZE,
      height: CIRCLE_SIZE,
      borderRadius: CIRCLE_SIZE / 2,
      backgroundColor: colors.isDark ? 'rgba(239, 68, 68, 0.15)' : '#FDE8E8',
      alignSelf: 'center',
      zIndex: 0,
    },
    heroDomeCircleSuccess: {
      backgroundColor: colors.isDark ? colors.alpha.green15 : '#D1FAE5',
    },
    heroInnerContent: {
      alignItems: 'center',
      zIndex: 1,
      width: '100%',
    },

    // Badges (Alert / Check)
    alertBadge: {
      width: 54,
      height: 54,
      borderRadius: 27,
      backgroundColor: colors.isDark ? 'rgba(239, 68, 68, 0.25)' : '#FEE2E2',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    checkBadge: {
      width: 54,
      height: 54,
      borderRadius: 27,
      backgroundColor: colors.isDark ? colors.alpha.green25 : '#D1FAE5',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },

    // Hero Text
    failedTitle: {
      fontFamily: colors.fonts.sora.extraBold,
      color: colors.isDark ? '#FCA5A5' : '#881337',
      fontSize: 27,
      marginBottom: 8,
      textAlign: 'center',
      letterSpacing: -0.4,
      lineHeight: 33,
    },
    failedSub: {
      fontFamily: colors.fonts.sora.medium,
      color: colors.isDark ? '#F87171' : '#EF4444',
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 20,
    },
    title: {
      fontFamily: colors.fonts.sora.extraBold,
      color: colors.isDark ? colors.green[400] : colors.green[800],
      fontSize: 28,
      marginBottom: 8,
      textAlign: 'center',
      letterSpacing: -0.3,
    },
    meta: {
      fontFamily: colors.fonts.sora.medium,
      color: colors.isDark ? colors.green.bright : colors.green[650],
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 20,
    },

    // ----------------------------------------------------
    // BODY SECTION
    // ----------------------------------------------------
    body: {
      paddingHorizontal: 16,
      paddingTop: 18,
      paddingBottom: 24,
      backgroundColor: colors.isDark ? colors.background : '#FFFFFF',
      flexGrow: 1,
    },

    // Card 1: You have not been charged (Blue wash)
    notChargedCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
      backgroundColor: colors.isDark ? '#111C2E' : '#EFF6FF',
      borderRadius: 20,
      padding: 18,
      marginBottom: 14,
    },
    notChargedIcon: {
      marginTop: 2,
    },
    notChargedCopy: {
      flex: 1,
    },
    notChargedTitle: {
      fontFamily: colors.fonts.sora.bold,
      color: colors.isDark ? '#93C5FD' : '#1E40AF',
      fontSize: 15,
      marginBottom: 4,
    },
    notChargedSub: {
      fontFamily: colors.fonts.sora.medium,
      color: colors.isDark ? '#60A5FA' : '#3B82F6',
      fontSize: 13,
      lineHeight: 19,
    },

    // Card 2: WHY IT FAILED
    whyFailedCard: {
      backgroundColor: colors.isDark ? colors.card : '#FFFFFF',
      borderWidth: 1.5,
      borderColor: colors.isDark ? colors.border : '#FECACA',
      borderRadius: 20,
      padding: 18,
      marginBottom: 20,
    },
    whyFailedLabel: {
      fontFamily: colors.fonts.sora.bold,
      color: colors.muted,
      fontSize: 11,
      letterSpacing: 0.8,
      marginBottom: 6,
    },
    whyFailedText: {
      fontFamily: colors.fonts.sora.medium,
      color: colors.text,
      fontSize: 14,
      lineHeight: 20,
    },

    // Section Label: PAY WITH
    payWithLabel: {
      fontFamily: colors.fonts.sora.bold,
      color: colors.muted,
      fontSize: 11,
      letterSpacing: 0.8,
      marginBottom: 12,
      textTransform: 'uppercase',
    },

    // Payment Option Cards
    payOptionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
      borderRadius: 18,
      borderWidth: 1.5,
      borderColor: colors.isDark ? colors.border : '#E5E7EB',
      backgroundColor: colors.isDark ? colors.card : '#FFFFFF',
      marginBottom: 12,
    },
    payOptionCardSelected: {
      borderColor: colors.orange[500],
      borderWidth: 2,
      backgroundColor: colors.isDark ? colors.alpha.orangeBrand12 : '#FFF7ED',
    },
    payIconWrap: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    },
    payIconWrapSelected: {
      backgroundColor: colors.isDark ? 'rgba(249, 115, 22, 0.25)' : '#FED7AA',
    },
    payIconWrapDefault: {
      backgroundColor: colors.isDark ? colors.navy[800] : '#F3F4F6',
    },
    payOptionCopy: {
      flex: 1,
    },
    payOptionTitle: {
      fontFamily: colors.fonts.sora.bold,
      color: colors.text,
      fontSize: 15,
    },
    payOptionSub: {
      fontFamily: colors.fonts.sora.medium,
      color: colors.textMuted,
      fontSize: 13,
      marginTop: 2,
    },
    payCheckIcon: {
      marginLeft: 8,
    },

    // ----------------------------------------------------
    // NORMAL TRIP COMPLETED CARDS
    // ----------------------------------------------------
    tripCard: {
      flexDirection: 'row',
      marginBottom: 18,
    },
    timeline: {
      width: 16,
      alignItems: 'center',
      marginRight: 12,
      paddingTop: 5,
      paddingBottom: 5,
    },
    pickupDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.orange[500],
    },
    timelineLine: {
      width: 2,
      flex: 1,
      backgroundColor: colors.border,
      marginVertical: 5,
    },
    dropSquare: {
      width: 12,
      height: 12,
      borderRadius: 3,
      backgroundColor: colors.isDark ? colors.white : colors.navy[800],
    },
    tripCopy: {
      flex: 1,
      minWidth: 0,
      gap: 18,
    },
    tripBlock: {},
    tripLabel: {
      fontFamily: colors.fonts.sora.bold,
      color: colors.muted,
      fontSize: 11,
      letterSpacing: 0.8,
      marginBottom: 4,
    },
    tripAddress: {
      fontFamily: colors.fonts.sora.bold,
      color: colors.text,
      fontSize: 15,
      lineHeight: 21,
    },
    fareCard: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 18,
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 8,
      marginBottom: 12,
      backgroundColor: colors.card,
    },
    fareTitle: {
      fontFamily: colors.fonts.sora.bold,
      color: colors.muted,
      fontSize: 11,
      letterSpacing: 0.8,
      marginBottom: 8,
    },
    fareRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
    },
    fareLabel: {
      fontFamily: colors.fonts.sora.medium,
      color: colors.muted,
      fontSize: 14,
      flex: 1,
      paddingRight: 12,
    },
    fareValue: {
      fontFamily: colors.fonts.sora.bold,
      color: colors.text,
      fontSize: 14,
    },
    fareLabelPromo: {
      fontFamily: colors.fonts.sora.bold,
      color: colors.green[600],
    },
    fareValuePromo: {
      color: colors.green[600],
    },
    paidBox: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      backgroundColor: colors.isDark ? colors.alpha.green15 : colors.green[100],
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 13,
      marginBottom: 8,
    },
    paidCopy: {
      flex: 1,
      minWidth: 0,
    },
    paidTitle: {
      fontFamily: colors.fonts.sora.extraBold,
      color: colors.green[600],
      fontSize: 15,
      marginBottom: 2,
    },
    paidSub: {
      fontFamily: colors.fonts.sora.medium,
      color: colors.isDark ? colors.text : colors.green[500],
      fontSize: 12,
    },

    // ----------------------------------------------------
    // FOOTER ACTION BAR
    // ----------------------------------------------------
    footer: {
      paddingHorizontal: 20,
      paddingTop: 14,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.isDark ? colors.border : '#F3F4F6',
      backgroundColor: colors.isDark ? colors.card : '#FFFFFF',
    },
    dueRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14,
    },
    dueLabel: {
      fontFamily: colors.fonts.sora.bold,
      color: colors.text,
      fontSize: 16,
    },
    dueAmount: {
      fontFamily: colors.fonts.sora.extraBold,
      color: colors.text,
      fontSize: 24,
    },
    totalRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14,
    },
    totalLabel: {
      fontFamily: colors.fonts.sora.extraBold,
      color: colors.text,
      fontSize: 18,
    },
    totalValue: {
      fontFamily: colors.fonts.sora.extraBold,
      color: colors.text,
      fontSize: 22,
    },
    rateBtn: {
      backgroundColor: colors.orange[500],
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rateText: {
      fontFamily: colors.fonts.sora.extraBold,
      color: colors.white,
      fontSize: 16,
    },
    payBtn: {
      backgroundColor: colors.orange[500],
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    payBtnText: {
      fontFamily: colors.fonts.sora.extraBold,
      color: colors.white,
      fontSize: 16,
    },
  });
}
