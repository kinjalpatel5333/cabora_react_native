import {StyleSheet} from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    map: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.map.land,
    },
    mapRoadH: {
      position: 'absolute',
      height: 10,
      left: 0,
      right: 0,
      backgroundColor: colors.map.road,
    },
    mapRoadV: {
      position: 'absolute',
      width: 10,
      top: 0,
      bottom: 0,
      backgroundColor: colors.map.road,
    },
    mapRoadAlt: {
      backgroundColor: colors.map.roadAlt,
    },
    mapLabel: {
      position: 'absolute',
      color: colors.navy[400],
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 1.1,
    },
    water: {
      position: 'absolute',
      backgroundColor: colors.map.water,
      borderRadius: 40,
      opacity: 0.7,
    },
    park: {
      position: 'absolute',
      backgroundColor: colors.map.park,
      borderRadius: 16,
      opacity: 0.85,
    },
    building: {
      position: 'absolute',
      backgroundColor: colors.map.building,
      borderRadius: 6,
    },
    vehiclePin: {
      position: 'absolute',
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.navy[900],
      shadowOpacity: 0.12,
      shadowRadius: 4,
      shadowOffset: {width: 0, height: 2},
      elevation: 2,
    },
    userDotWrap: {
      position: 'absolute',
      top: '42%',
      left: '46%',
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    userPulse: {
      position: 'absolute',
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(46, 123, 231, 0.18)',
    },
    userDot: {
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: colors.blue[500],
      borderWidth: 3,
      borderColor: colors.white,
    },
  });
}
