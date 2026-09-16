import React from 'react';
import {Pressable, StatusBar, Text, View} from 'react-native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from '../../components';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import {useAuth} from '../../hooks/useAuth';
import {useAppDispatch} from '../../redux/hooks';
import {logoutUser} from '../../redux/slices/authSlice';
import createStyles from './style';

export default function DriverHomeScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const {user} = useAuth();
  const dispatch = useAppDispatch();

  return (
    <View style={[styles.root, {paddingTop: insets.top + 16}]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.heroIcon}>
        <MaterialDesignIcons
          name="car-hatchback"
          size={36}
          color={colors.orange[600]}
        />
      </View>
      <Text style={styles.kicker}>DRIVER</Text>
      <Text style={styles.title}>Drive and earn</Text>
      <Text style={styles.body}>
        Hi {user?.name || 'Driver'} — passenger booking screens stay on the
        rider side. Driver KYC, go-online and trips will live here next.
      </Text>

      <View style={styles.card}>
        <Feather name="shield" size={18} color={colors.navy[700]} />
        <Text style={styles.cardText}>
          Licence, RC, insurance and bank details are required before going
          online.
        </Text>
      </View>

      <View style={{flex: 1}} />

      <View style={{paddingBottom: Math.max(insets.bottom, 12)}}>
        <Button
          title="Log out"
          variant="outline"
          onPress={() => dispatch(logoutUser())}
        />
        <Pressable
          style={styles.hintBtn}
          onPress={() => dispatch(logoutUser())}>
          <Text style={styles.hintText}>
            Switch account to open passenger booking
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
