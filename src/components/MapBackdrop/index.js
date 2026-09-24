import React from 'react';
import { Dimensions, Image, View } from 'react-native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import { images } from '../../assets';
import { useApp } from '../../context/AppContext';
import useThemedStyles from '../useThemedStyles';
import createStyles from './style';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

/**
 * Positions to distribute nearby drivers across the visible map viewport.
 */
const DEFAULT_POSITIONS = [
  { top: SCREEN_H * 0.22, left: SCREEN_W * 0.25 },
  { top: SCREEN_H * 0.18, left: SCREEN_W * 0.65 },
  { top: SCREEN_H * 0.32, left: SCREEN_W * 0.45 },
  { top: SCREEN_H * 0.28, left: SCREEN_W * 0.78 },
  { top: SCREEN_H * 0.38, left: SCREEN_W * 0.20 },
];

export default function MapBackdrop({ drivers = [], children }) {
  const styles = useThemedStyles(createStyles);
  const { isDark, colors } = useApp();

  return (
    <View style={styles.map} pointerEvents="none">
      <Image
        source={isDark ? images.homeMapDark : images.homeMap}
        style={styles.mapImage}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />

      {/* User Center Dot */}
      <View
        style={[
          styles.userLocationDot,
          { top: SCREEN_H * 0.30 - 11, left: SCREEN_W * 0.5 - 11 },
        ]}>
        <View style={styles.userLocationInner} />
      </View>

      {/* Nearby Driver Markers */}
      {drivers.map((driver, index) => {
        const pos = DEFAULT_POSITIONS[index % DEFAULT_POSITIONS.length];
        const iconName =
          driver.vehicleType === 'bike'
            ? 'motorbike'
            : driver.vehicleType === 'auto'
            ? 'rickshaw'
            : 'car-side';

        return (
          <View
            key={driver._id || driver.id || `driver_${index}`}
            style={[
              styles.driverMarker,
              { top: pos.top, left: pos.left },
            ]}>
            <MaterialDesignIcons
              name={iconName}
              size={20}
              color={colors.primary}
            />
          </View>
        );
      })}

      {children}
    </View>
  );
}
