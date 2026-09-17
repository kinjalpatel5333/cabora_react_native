import React from 'react';
import {Image, View} from 'react-native';
import {images} from '../../assets';
import useThemedStyles from '../useThemedStyles';
import createStyles from './style';

/**
 * Static map placeholder until Google Maps is wired.
 */
export default function MapBackdrop({children}) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.map} pointerEvents="none">
      <Image
        source={images.homeMap}
        style={styles.mapImage}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />
      {children}
    </View>
  );
}
