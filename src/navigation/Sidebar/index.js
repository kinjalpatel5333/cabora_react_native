import React, {useEffect, useRef} from 'react';
import {Animated, Pressable, StyleSheet, View} from 'react-native';
import {useSidebar} from '../../context/SidebarContext';
import DrawerContent from '../DrawerContent';
import styles, {DRAWER_WIDTH} from './style';

export default function Sidebar() {
  const {open, closeDrawer} = useSidebar();
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlay = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: open ? 0 : -DRAWER_WIDTH,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(overlay, {
        toValue: open ? 1 : 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [open, overlay, translateX]);

  return (
    <View
      pointerEvents={open ? 'auto' : 'none'}
      style={StyleSheet.absoluteFill}>
      <Pressable style={StyleSheet.absoluteFill} onPress={closeDrawer}>
        <Animated.View style={[styles.overlay, {opacity: overlay}]} />
      </Pressable>
      <Animated.View style={[styles.panel, {transform: [{translateX}]}]}>
        <DrawerContent />
      </Animated.View>
    </View>
  );
}
