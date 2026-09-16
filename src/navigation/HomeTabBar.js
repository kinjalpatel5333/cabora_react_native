import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useApp} from '../context/AppContext';
import {getTabBarBottomPadding} from './homeTabBarMetrics';

const TABS = [
  {name: 'Home', label: 'Home', kind: 'home'},
  {name: 'Services', label: 'Services', kind: 'grid'},
  {name: 'Activity', label: 'Activity', kind: 'clock'},
  {name: 'Wallet', label: 'Wallet', kind: 'wallet'},
  {name: 'Profile', label: 'Profile', kind: 'user'},
];

function TabGlyph({kind, color, active}) {
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
  if (kind === 'wallet') {
    return (
      <MaterialDesignIcons name="wallet-outline" size={size} color={color} />
    );
  }
  return <Feather name="user" size={size} color={color} />;
}

export default function HomeTabBar({state, descriptors, navigation}) {
  const insets = useSafeAreaInsets();
  const {colors} = useApp();
  const safeBottom = getTabBarBottomPadding(insets);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.shell, {paddingBottom: safeBottom}]}>
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
            const {options} = descriptors[route.key];
            const label = options.tabBarLabel ?? options.title ?? route.name;
            const active = state.index === index;
            const tab = TABS.find(t => t.name === route.name) || TABS[0];
            const iconTint = active ? colors.orange[600] : colors.gray[500];
            const labelTint = active ? colors.navy[900] : colors.gray[500];
            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!active && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={active ? {selected: true} : {}}
                onPress={onPress}
                style={styles.item}>
                <View
                  style={[
                    styles.tabChip,
                    active && {
                      backgroundColor: colors.orange[100],
                    },
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
                        fontWeight: active ? '700' : '500',
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
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 14,
  },
  pill: {
    borderRadius: 32,
    paddingVertical: 8,
    paddingHorizontal: 8,
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: {width: 0, height: 8},
    elevation: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Active highlight wraps icon + label together (vertical pill).
  tabChip: {
    minWidth: 56,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: {
    fontSize: 11,
    lineHeight: 13,
  },
});
