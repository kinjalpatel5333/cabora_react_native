import React from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {images} from '../../assets';
import {useSidebar} from '../../context/SidebarContext';
import styles from './style';

export default function Header({title}) {
  const insets = useSafeAreaInsets();
  const {openDrawer} = useSidebar();

  return (
    <View style={[styles.wrap, {paddingTop: Math.max(insets.top, 12)}]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open menu"
        onPress={openDrawer}>
        <Image source={images.iconMenu} style={styles.menu} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}
