import React, {useMemo, useState} from 'react';
import {Linking, Pressable, ScrollView, StatusBar, Text, View} from 'react-native';
import {AntDesign} from '@react-native-vector-icons/ant-design/static';
import {Feather} from '@react-native-vector-icons/feather/static';
import {Lucide} from '@react-native-vector-icons/lucide/static';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from '../../components';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import {useAppDispatch} from '../../redux/hooks';
import {loginWithPhone} from '../../redux/slices/authSlice';
import createStyles from './style';

const SUPPORT_URL = 'mailto:support@cabora.app';

const ROLES = [
  {
    id: 'passenger',
    label: 'Passenger',
    title: 'Ride as a passenger',
    body: 'Book cabs, autos, bikes, Portal deliveries and outstation trips.',
    hint: 'Ready in a minute',
    tone: 'success',
  },
  {
    id: 'driver',
    label: 'Driver',
    title: 'Drive and earn',
    body: 'Accept rides, track earnings and withdraw daily.',
    hint: 'Needs KYC · about 2 days',
    tone: 'warning',
  },
  // {
  //   id: 'both',
  //   label: 'Both',
  //   title: 'Both',
  //   body: 'Switch between riding and driving from one login.',
  //   hint: 'Driving unlocks after KYC',
  //   tone: 'info',
  // },
];

function RoleIcon({id, selected, colors}) {
  const color = selected ? colors.orange[500] : colors.navy[800];
  if (id === 'driver') {
    return (
      <MaterialDesignIcons name="car-hatchback" size={22} color={color} />
    );
  }
  if (id === 'both') {
    return <Lucide name="users" size={20} color={color} />;
  }
  return <Lucide name="user-round" size={20} color={color} />;
}

function HintIcon({tone, colors}) {
  if (tone === 'success') {
    return <AntDesign name="check-circle" size={14} color={colors.green[600]} />;
  }
  if (tone === 'warning') {
    return (
      <AntDesign name="exclamation-circle" size={14} color={colors.amber[600]} />
    );
  }
  return <AntDesign name="info-circle" size={14} color={colors.blue[600]} />;
}

export default function SetupAccountScreen({navigation, route}) {
  const insets = useSafeAreaInsets();
  const {colors} = useApp();
  const styles = useThemedStyles(createStyles);
  const phone = route?.params?.mobile || '';
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState('passenger');
  const [loading, setLoading] = useState(false);

  const picked = useMemo(
    () => ROLES.find(role => role.id === selected) || ROLES[0],
    [selected],
  );

  const onContinue = async () => {
    if (selected === 'driver' || selected === 'both') {
      setLoading(true);
      try {
        await dispatch(loginWithPhone({phone, role: selected})).unwrap();
      } catch (err) {
        setLoading(false);
      }
      return;
    }
    navigation.navigate('LocationPermission', {
      mobile: phone,
      role: selected,
    });
  };

  return (
    <View style={[styles.root, {paddingTop: insets.top + 8}]}>
      <StatusBar barStyle={colors.barStyle} />
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={styles.headerBtn}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Set up your account</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => Linking.openURL(SUPPORT_URL)}
          style={styles.headerBtn}>
          <Feather name="help-circle" size={22} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>How will you use Cabora?</Text>
        <Text style={styles.subtitle}>
          You can add the other role later from your profile — one account holds
          both.
        </Text>

        {ROLES.map(role => {
          const isSelected = role.id === selected;
          return (
            <Pressable
              key={role.id}
              onPress={() => setSelected(role.id)}
              style={[styles.card, isSelected && styles.cardSelected]}>
              <View style={styles.cardTop}>
                <View style={[styles.iconWrap, isSelected && styles.iconSelected]}>
                  <RoleIcon
                    id={role.id}
                    selected={isSelected}
                    colors={colors}
                  />
                </View>
                <View style={styles.copy}>
                  <Text style={styles.cardTitle}>{role.title}</Text>
                  <Text style={styles.cardBody}>{role.body}</Text>
                </View>
                <View style={[styles.radio, isSelected && styles.radioOn]} />
              </View>
              <View
                style={[styles.divider, isSelected && styles.dividerSelected]}
              />
              <View style={styles.hint}>
                <HintIcon tone={role.tone} colors={colors} />
                <Text
                  style={[
                    styles.hintText,
                    isSelected && styles.hintSuccess,
                  ]}>
                  {role.hint}
                </Text>
              </View>
            </Pressable>
          );
        })}

        <View style={styles.note}>
          <Feather name="shield" size={18} color={colors.navy[700]} />
          <Text style={styles.noteText}>
            Driver accounts need a licence, RC, insurance and a bank account
            before going online.
          </Text>
        </View>
      </ScrollView>

      <View
        style={[styles.footer, {paddingBottom: Math.max(insets.bottom, 8)}]}>
        <View>
          <Text style={styles.pickedLabel}>You picked</Text>
          <Text style={styles.pickedValue}>{picked.label}</Text>
        </View>
        <Button
          title="Continue"
          onPress={onContinue}
          loading={loading}
          fullWidth={false}
          style={styles.continue}
        />
      </View>
    </View>
  );
}
