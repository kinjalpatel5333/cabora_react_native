import React from 'react';
import {Text, View} from 'react-native';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import useThemedStyles from '../useThemedStyles';
import createStyles from './style';

const VEHICLES = [
  {top: 118, left: 52, icon: 'car-hatchback'},
  {top: 168, left: 210, icon: 'motorbike'},
  {top: 92, right: 48, icon: 'car-hatchback'},
  {top: 220, left: 130, icon: 'motorbike'},
];

export default function MapBackdrop({showUserDot = true, children}) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.map} pointerEvents="none">
      <View style={[styles.park, {top: 56, left: 18, width: 96, height: 64}]} />
      <View style={[styles.park, {top: 200, right: 24, width: 88, height: 56}]} />
      <View style={[styles.water, {top: 100, right: -24, width: 130, height: 90}]} />
      <View style={[styles.building, {top: 78, left: 140, width: 44, height: 32}]} />
      <View style={[styles.building, {top: 148, left: 40, width: 52, height: 38}]} />
      <View style={[styles.building, {top: 228, left: 170, width: 58, height: 36}]} />
      <View style={[styles.mapRoadH, {top: 128}]} />
      <View style={[styles.mapRoadH, styles.mapRoadAlt, {top: 208, height: 7}]} />
      <View style={[styles.mapRoadV, {left: 82}]} />
      <View style={[styles.mapRoadV, styles.mapRoadAlt, {left: 205, width: 7}]} />
      <Text style={[styles.mapLabel, {top: 106, left: 98}]}>MG ROAD</Text>
      <Text style={[styles.mapLabel, {top: 196, left: 28}]}>CHURCH STREET</Text>

      {VEHICLES.map((vehicle, index) => (
        <View
          key={index}
          style={[
            styles.vehiclePin,
            vehicle.left != null && {left: vehicle.left},
            vehicle.right != null && {right: vehicle.right},
            {top: vehicle.top},
          ]}>
          <MaterialDesignIcons name={vehicle.icon} size={14} color="#173460" />
        </View>
      ))}

      {showUserDot ? (
        <View style={styles.userDotWrap}>
          <View style={styles.userPulse} />
          <View style={styles.userDot} />
        </View>
      ) : null}

      {children}
    </View>
  );
}
