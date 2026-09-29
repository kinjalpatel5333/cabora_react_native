import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useSidebar } from '../../context/SidebarContext';
import useThemedStyles from '../../components/useThemedStyles';
import DrawerContent from '../DrawerContent';
import createStyles, { DRAWER_WIDTH } from './style';

export default function Sidebar() {
  const { open, closeDrawer } = useSidebar();
  const styles = useThemedStyles(createStyles);
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlay = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (open) {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 260,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: true,
        }),
        Animated.timing(overlay, {
          toValue: 1,
          duration: 240,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -DRAWER_WIDTH,
          duration: 220,
          easing: Easing.bezier(0.25, 1, 0.5, 1),
          useNativeDriver: true,
        }),
        Animated.timing(overlay, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [open, overlay, translateX]);

  return (
    <View
      pointerEvents={open ? 'auto' : 'none'}
      style={StyleSheet.absoluteFill}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={StyleSheet.absoluteFill}
        onPress={closeDrawer}>
        <Animated.View style={[styles.overlay, { opacity: overlay }]} />
      </TouchableOpacity>
      <Animated.View style={[styles.panel, { transform: [{ translateX }] }]}>
        <DrawerContent />
      </Animated.View>
    </View>
  );
}
