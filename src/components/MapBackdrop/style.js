import {StyleSheet} from 'react-native';

export default function createStyles(colors) {
  return StyleSheet.create({
    map: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.map.land,
    },
    mapImage: {
      position: 'absolute',
      top: 0,
      left: 0,
    },
    demandZone: {
      position: 'absolute',
    },
    userDotWrap: {
      position: 'absolute',
      top: 250,
      left: '50%',
      width: 110,
      height: 110,
      marginLeft: -55,
      alignItems: 'center',
      justifyContent: 'center',
    },
    userPulseOuter: {
      position: 'absolute',
      width: 110,
      height: 110,
      borderRadius: 55,
      backgroundColor: 'rgba(46, 123, 231, 0.18)',
    },
    userPulse: {
      position: 'absolute',
      width: 58,
      height: 58,
      borderRadius: 29,
      backgroundColor: 'rgba(46, 123, 231, 0.28)',
    },
    userDot: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: '#2E7BE7',
      borderWidth: 4,
      borderColor: '#FFFFFF',
    },
  });
}
