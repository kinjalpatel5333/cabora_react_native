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
      backgroundColor: 'rgba(0, 0, 0, 0.28)',
    },
    sheet: {
      backgroundColor: colors.card,
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
      backgroundColor: colors.border,
      marginBottom: 12,
    },
    grabberHit: {
      alignItems: 'center',
      paddingTop: 2,
      paddingBottom: 6,
    },
    headerRow: {
      marginBottom: 12,
    },
    title: {
      color: colors.text,
      fontSize: 24,
      fontWeight: '800',
      marginBottom: 8,
    },
    statsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    statText: {
      color: colors.muted,
      fontSize: 13,
      fontWeight: '600',
    },
    sectionLabel: {
      color: colors.muted,
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.8,
      marginBottom: 10,
    },
    list: {
      flexGrow: 0,
      flexShrink: 1,
    },
    listContent: {
      gap: 10,
      paddingBottom: 10,
    },
    rideRow: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 16,
      paddingVertical: 12,
      paddingHorizontal: 12,
      backgroundColor: colors.card,
    },
    rideRowActive: {
      borderColor: colors.orange[500],
      borderWidth: 2,
      backgroundColor: colors.isDark ? '#1A3959' : '#FFF8F3',
    },
    rideIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    rideIconActive: {
      backgroundColor: colors.isDark ? 'rgba(255, 112, 6, 0.15)' : colors.orange[100],
    },
    rideCopy: {
      flex: 1,
      minWidth: 0,
    },
    rideName: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 2,
    },
    rideMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    rideMeta: {
      color: colors.muted,
      fontSize: 12,
      fontWeight: '500',
    },
    ridePrice: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '800',
      marginLeft: 8,
    },
    bookAnyCard: {
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: 16,
      padding: 12,
      backgroundColor: colors.card,
    },
    bookAnyCardActive: {
      borderColor: colors.orange[500],
      backgroundColor: colors.isDark ? '#1A3959' : '#FFF8F3',
    },
    bookAnyTop: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    bookAnyBadge: {
      backgroundColor: colors.isDark ? 'rgba(34, 197, 94, 0.15)' : '#E8F8EF',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 8,
    },
    bookAnyBadgeText: {
      color: colors.green[600],
      fontSize: 11,
      fontWeight: '700',
    },
    chipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 12,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 7,
      backgroundColor: colors.card,
    },
    chipOn: {
      borderColor: colors.orange[500],
      backgroundColor: colors.isDark ? 'rgba(255, 112, 6, 0.15)' : colors.orange[50],
    },
    chipText: {
      color: colors.text,
      fontSize: 12,
      fontWeight: '600',
    },
    chipTextOn: {
      color: colors.orange[500],
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    metaIcon: {
      width: 34,
      height: 34,
      borderRadius: 10,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    metaIconPromo: {
      backgroundColor: colors.isDark ? 'rgba(34, 197, 94, 0.15)' : '#E8F8EF',
    },
    metaCopy: {
      flex: 1,
      minWidth: 0,
    },
    metaText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '600',
    },
    metaTextPromo: {
      color: colors.green[600],
    },
    changeText: {
      color: colors.orange[500],
      fontSize: 14,
      fontWeight: '700',
    },
    promoAmount: {
      color: colors.green[600],
      fontSize: 14,
      fontWeight: '700',
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      paddingTop: 12,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    totalCol: {
      minWidth: 88,
    },
    totalLabel: {
      color: colors.muted,
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.6,
    },
    totalValue: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '800',
      marginTop: 2,
    },
    bookBtn: {
      flex: 1,
      backgroundColor: colors.orange[500],
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bookText: {
      color: colors.white,
      fontSize: 15,
      fontWeight: '800',
    },
  });
}

