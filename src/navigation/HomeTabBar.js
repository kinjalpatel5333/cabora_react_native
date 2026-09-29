import React, { useEffect, useRef, useState } from 'react';
import { Animated, Keyboard, Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { fonts } from '../config/typography';

import { HOME_TAB_BAR_ITEMS as TABS } from '../config/staticData';

function TabGlyph({ kind, color, active }) {
  const size = 22;
  if (kind === 'home') {
    return (
      <MaterialDesignIcons
        name={active ? 'home' : 'home-outline'}
        size={size}
        color={color}
      />
    );
  }
  if (kind === 'grid') {
    return (
      <MaterialDesignIcons
        name={active ? 'view-grid' : 'view-grid-outline'}
        size={size}
        color={color}
      />
    );
  }
  if (kind === 'clock') {
    return (
      <MaterialDesignIcons
        name={active ? 'clock' : 'clock-outline'}
        size={size}
        color={color}
      />
    );
  }
  if (kind === 'rupee') {
    return (
      <MaterialDesignIcons
        name={active ? 'cash-multiple' : 'currency-inr'}
        size={size}
        color={color}
      />
    );
  }
  if (kind === 'gift') {
    return (
      <MaterialDesignIcons
        name={active ? 'gift' : 'gift-outline'}
        size={size}
        color={color}
      />
    );
  }
  if (kind === 'wallet') {
    return (
      <MaterialDesignIcons
        name={active ? 'wallet' : 'wallet-outline'}
        size={size}
        color={color}
      />
    );
  }
  return (
    <MaterialDesignIcons
      name={active ? 'account' : 'account-outline'}
      size={size}
      color={color}
    />
  );
}

function TabBarItem({ route, active, descriptors, navigation, colors }) {
  const { options } = descriptors[route.key];
  const label = options.tabBarLabel ?? options.title ?? route.name;
  const tab = TABS.find(t => t.name === route.name) || TABS[0];
  const iconTint = active ? colors.primary : (colors.isDark ? colors.navy[300] : colors.driver.tabInactive);
  const labelTint = active ? (colors.isDark ? colors.primary : colors.driver.heroNavy) : (colors.isDark ? colors.navy[300] : colors.driver.tabInactive);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (active) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.88,
          duration: 70,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 180,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [active, scaleAnim]);

  const onPress = () => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });
    if (!active && !event.defaultPrevented) {
      navigation.navigate({ name: route.name, merge: true });
    }
  };

  const onLongPress = () => {
    navigation.emit({
      type: 'tabLongPress',
      target: route.key,
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={active ? { selected: true } : {}}
      accessibilityLabel={label}
      onPress={onPress}
      onLongPress={onLongPress}
      hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
      style={styles.item}>
      <Animated.View
        style={[
          styles.tabChip,
          { transform: [{ scale: scaleAnim }] },
        ]}>
        <TabGlyph
          kind={tab.kind}
          color={iconTint}
          active={active}
        />
        <Text
          style={[
            styles.label,
            {
              color: labelTint,
              fontWeight: active ? '800' : '600',
            },
          ]}
          numberOfLines={1}>
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function HomeTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  const slideAnim = useRef(new Animated.Value(state.index)).current;

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: state.index,
      useNativeDriver: true,
      tension: 68,
      friction: 10,
    }).start();
  }, [state.index, slideAnim]);

  if (isKeyboardVisible) {
    return null;
  }

  const numTabs = state.routes.length;
  const tabWidth = containerWidth > 0 && numTabs > 0 ? containerWidth / numTabs : 0;
  const inputRange = numTabs > 1 ? state.routes.map((_, i) => i) : [0, 1];
  const outputRange = numTabs > 1 ? state.routes.map((_, i) => i * tabWidth) : [0, tabWidth];

  const translateX = slideAnim.interpolate({
    inputRange,
    outputRange,
  });

  const bottomOffset = insets.bottom > 0 ? insets.bottom + 6 : 10;

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.shell,
        { bottom: bottomOffset },
      ]}>
      <View
        style={[
          styles.pill,
          {
            backgroundColor: colors.surface,
            shadowColor: colors.isDark ? colors.black : colors.navy[900],
            borderWidth: colors.isDark ? 1 : 0,
            borderColor: colors.border,
          },
        ]}>
        <View
          style={styles.row}
          onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}>
          {containerWidth > 0 && numTabs > 0 && (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.slidingIndicator,
                {
                  width: tabWidth,
                  transform: [{ translateX }],
                },
              ]}>
              <View
                style={[
                  styles.tabChipActiveBackground,
                  {
                    backgroundColor: colors.isDark ? colors.alpha.orange18 : colors.driver.tabActiveBg,
                    borderColor: colors.isDark ? colors.alpha.orange30 : colors.driver.tabActiveBorder,
                    shadowColor: colors.primary,
                  },
                ]}
              />
            </Animated.View>
          )}
          {state.routes.map((route, index) => (
            <TabBarItem
              key={route.key}
              route={route}
              active={state.index === index}
              descriptors={descriptors}
              navigation={navigation}
              colors={colors}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    position: 'absolute',
    left: 12,
    right: 12,
    zIndex: 99,
  },
  pill: {
    width: '100%',
    borderRadius: 36,
    paddingVertical: 6,
    paddingHorizontal: 8,
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  slidingIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  tabChipActiveBackground: {
    width: '100%',
    maxWidth: 64,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderStyle: 'solid',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 2,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  tabChip: {
    width: '100%',
    maxWidth: 64,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingHorizontal: 2,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
    borderStyle: 'solid',
  },
  label: {
    fontFamily: fonts.sora.semiBold,
    fontSize: 10.5,
    lineHeight: 13,
    textAlign: 'center',
  },
});
