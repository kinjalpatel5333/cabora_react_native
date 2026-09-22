import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@react-native-vector-icons/feather/static';
import { Lucide } from '@react-native-vector-icons/lucide/static';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { fonts } from '../config/typography';
import colors from '../config/color';

const TABS = [
  { name: 'Home', label: 'Home', kind: 'home' },
  { name: 'Dashboard', label: 'Dashboard', kind: 'home' },
  { name: 'Services', label: 'Services', kind: 'grid' },
  { name: 'Activity', label: 'Activity', kind: 'clock' },
  { name: 'Earnings', label: 'Earnings', kind: 'rupee' },
  { name: 'Wallet', label: 'Wallet', kind: 'wallet' },
  { name: 'Incentives', label: 'Incentives', kind: 'gift' },
  { name: 'Profile', label: 'Profile', kind: 'user' },
];

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
    return <Feather name="grid" size={size} color={color} />;
  }
  if (kind === 'clock') {
    return <Feather name="clock" size={size} color={color} />;
  }
  if (kind === 'rupee') {
    return (
      <MaterialDesignIcons name="currency-inr" size={size} color={color} />
    );
  }
  if (kind === 'gift') {
    return <Lucide name="gift" size={size} color={color} />;
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
  return <Feather name="user" size={size} color={color} />;
}

export default function HomeTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.shell,
        { paddingBottom: Math.max(insets.bottom, 10) },
      ]}>
      <View
        style={[
          styles.pill,
          {
            backgroundColor: colors.white,
            shadowColor: colors.navy[900],
          },
        ]}>
        <View style={styles.row}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label = options.tabBarLabel ?? options.title ?? route.name;
            const active = state.index === index;
            const tab = TABS.find(t => t.name === route.name) || TABS[0];
            const iconTint = active ? colors.primary : colors.driver.tabInactive;
            const labelTint = active ? colors.driver.heroNavy : colors.driver.tabInactive;

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
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={active ? { selected: true } : {}}
                accessibilityLabel={label}
                onPress={onPress}
                onLongPress={onLongPress}
                hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                style={styles.item}>
                <View
                  style={[
                    styles.tabChip,
                    active && [
                      styles.tabChipActive,
                      {
                        backgroundColor: colors.driver.tabActiveBg,
                        borderColor: colors.driver.tabActiveBorder,
                        shadowColor: colors.primary,
                      },
                    ],
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
                </View>
              </Pressable>
            );
          })}
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
    bottom: 0,
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
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabChip: {
    width: '100%',
    maxWidth: 64,
    height: 50,
    borderRadius: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingHorizontal: 2,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
    borderStyle: 'solid',
  },
  tabChipActive: {
    borderRadius: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    borderWidth: 1,
    borderStyle: 'solid',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontFamily: fonts.sora.semiBold,
    fontSize: 10.5,
    lineHeight: 13,
    textAlign: 'center',
  },
});
