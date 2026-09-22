import React from 'react';
import { Dimensions, Image, View } from 'react-native';
import { images } from '../../assets';
import { useApp } from '../../context/AppContext';
import useThemedStyles from '../useThemedStyles';
import createStyles from './styles';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

/** Soft radial demand glows */
const DEMAND_ZONES = [
  { top: 120, left: 210, size: 200, opacity: 1 },
  { top: 250, left: 66, size: 180, opacity: 0.85 },
  { top: 300, left: 250, size: 120, opacity: 0.95 },
];

export default function DriverMapBackdrop({
  showUserDot = true,
  showDemand = false,
  children,
}) {
  const styles = useThemedStyles(createStyles);
  const { isDark } = useApp();

  return (
    <View style={styles.map} pointerEvents="none">
      <Image
        source={isDark ? images.homeMapDark : images.mapBackdrop}
        style={[styles.mapImage, { width: SCREEN_W, height: SCREEN_H }]}
        resizeMode="cover"
      />

      {showDemand
        ? DEMAND_ZONES.map((zone, index) => (
          <Image
            key={index}
            source={images.demandGlow}
            style={[
              styles.demandZone,
              {
                top: zone.top,
                left: zone.left,
                width: zone.size,
                height: zone.size,
                opacity: zone.opacity,
              },
            ]}
            resizeMode="contain"
          />
        ))
        : null}

      {showUserDot ? (
        <View style={styles.userDotWrap}>
          <View style={styles.userPulseOuter} />
          <View style={styles.userPulse} />
          <View style={styles.userDot} />
        </View>
      ) : null}

      {children}
    </View>
  );
}
