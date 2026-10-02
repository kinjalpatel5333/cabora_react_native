import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSidebar } from '../../context/SidebarContext';
import useThemedStyles from '../../components/useThemedStyles';
import DrawerContent from '../DrawerContent';
import createStyles from './style';

export default function Sidebar() {
  const { open, closeDrawer } = useSidebar();
  const { width } = useWindowDimensions();
  const drawerWidth = Math.min(Math.max(width * 0.78, 280), 330);

  const styles = useThemedStyles(createStyles);
  const translateX = useRef(new Animated.Value(-drawerWidth)).current;
  const overlay = useRef(new Animated.Value(0)).current;
  const [rendered, setRendered] = useState(open);

  useEffect(() => {
    if (open) {
      setRendered(true);
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 260,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: true,
        }),
        Animated.timing(overlay, {
          toValue: 1,
          duration: 260,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -drawerWidth,
          duration: 220,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(overlay, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          setRendered(false);
        }
      });
    }
  }, [open, drawerWidth, overlay, translateX]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10 && gestureState.dx < 0;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          const clamped = Math.max(-drawerWidth, gestureState.dx);
          translateX.setValue(clamped);
          overlay.setValue(1 + clamped / drawerWidth);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -50 || gestureState.vx < -0.5) {
          closeDrawer();
        } else {
          Animated.parallel([
            Animated.timing(translateX, {
              toValue: 0,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(overlay, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    }),
  ).current;

  if (!rendered && !open) {
    return null;
  }

  return (
    <View
      pointerEvents={open ? 'auto' : 'none'}
      style={[StyleSheet.absoluteFill, { zIndex: 9999, elevation: 9999 }]}>
      <TouchableOpacity
        activeOpacity={1}
        style={StyleSheet.absoluteFill}
        onPress={closeDrawer}>
        <Animated.View style={[styles.overlay, { opacity: overlay }]} />
      </TouchableOpacity>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.panel,
          { width: drawerWidth, transform: [{ translateX }] },
        ]}>
        <DrawerContent />
      </Animated.View>
    </View>
  );
}
