import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, TouchableOpacity } from 'react-native';
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
