import React, {useState} from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useToast} from '../../components/Toast';
import {useApp} from '../../context/AppContext';
import useThemedStyles from '../../components/useThemedStyles';
import createStyles from './style';

function CustomToggle({value, onToggle, label, styles}) {
  return (
    <Pressable
      onPress={() => onToggle(!value)}
      accessibilityRole="switch"
      accessibilityState={{checked: value}}
      accessibilityLabel={label}
      style={[
        styles.toggleTrack,
        value ? styles.toggleTrackActive : styles.toggleTrackInactive,
      ]}>
      <View
        style={[
          styles.toggleThumb,
          value ? styles.toggleThumbActive : styles.toggleThumbInactive,
        ]}
      />
    </Pressable>
  );
}

export default function SafetyNumberScreen() {
  const insets = useSafeAreaInsets();
  const {colors} = useApp();
  const styles = useThemedStyles(createStyles);
  const navigation = useNavigation();
  const {showToast} = useToast();

  const [toggles, setToggles] = useState({
    after9pm: true,
    over30min: true,
    airport: false,
    tapShare: false,
  });

  const handleToggle = key => {
    setToggles(prev => ({...prev, [key]: !prev[key]}));
  };

  const onSave = () => {
    showToast({type: 'success', message: 'Safety number updated'});
    navigation.goBack();
  };

  const onRemove = () => {
    showToast({type: 'info', message: 'Safety number removed'});
    navigation.goBack();
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle={colors.barStyle} backgroundColor={colors.card} />
      <View style={[styles.header, {paddingTop: insets.top + 4}]}>
        <Pressable
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Safety number</Text>
        <Pressable
          style={styles.headerBtn}
          onPress={() => navigation.navigate('Help')}
          accessibilityRole="button"
          accessibilityLabel="Help"
          hitSlop={8}>
          <Feather name="help-circle" size={22} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {paddingBottom: Math.max(insets.bottom, 16) + 20},
        ]}>
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Feather name="phone" size={18} color=colors.blue[550] />
          </View>
          <View style={styles.infoBody}>
            <Text style={styles.infoTitle}>Add an alternate number</Text>
            <Text style={styles.infoSub}>
              If your phone is unreachable, Cabora calls this number and can
              share your live trip with them.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>ALTERNATE NUMBER</Text>
        <View style={styles.numberCard}>
          <Text style={styles.numberLabel}>Mobile number</Text>
          <View style={styles.numberBox}>
            <View style={styles.numberLeft}>
              <Text style={styles.countryCode}>+91</Text>
              <Text style={styles.phoneNumber}>98450 33119</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <View style={styles.verifiedDot} />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          </View>

          <View style={styles.contactMetaRow}>
            <View style={styles.contactMetaLeft}>
              <Feather name="users" size={16} color={colors.textMuted} />
              <Text style={styles.contactMetaText}>Priya Sharma · sister</Text>
            </View>
            <Pressable
              onPress={() => showToast({type: 'info', message: 'Change contact'})}
              hitSlop={6}>
              <Text style={styles.changeLink}>Change</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.sectionLabel}>WHEN TO SHARE MY LOCATION</Text>

        <View style={styles.toggleCard}>
          <Text style={styles.toggleTitle}>Every ride after 9 pm</Text>
          <CustomToggle
            value={toggles.after9pm}
            onToggle={() => handleToggle('after9pm')}
            label="Every ride after 9 pm"
            styles={styles}
          />
        </View>

        <View style={styles.toggleCard}>
          <Text style={styles.toggleTitle}>Any ride over 30 minutes</Text>
          <CustomToggle
            value={toggles.over30min}
            onToggle={() => handleToggle('over30min')}
            label="Any ride over 30 minutes"
            styles={styles}
          />
        </View>

        <View style={styles.toggleCard}>
          <Text style={styles.toggleTitle}>Rides to and from the airport</Text>
          <CustomToggle
            value={toggles.airport}
            onToggle={() => handleToggle('airport')}
            label="Rides to and from the airport"
            styles={styles}
          />
        </View>

        <View style={styles.toggleCard}>
          <Text style={styles.toggleTitle}>Only when I tap share</Text>
          <CustomToggle
            value={toggles.tapShare}
            onToggle={() => handleToggle('tapShare')}
            label="Only when I tap share"
            styles={styles}
          />
        </View>

        <View style={styles.liveLocationCard}>
          <View style={styles.liveLocationTop}>
            <View style={styles.liveLocationIcon}>
              <Feather name="upload" size={20} color=colors.primary />
            </View>
            <View style={styles.liveLocationBody}>
              <Text style={styles.liveLocationTitle}>
                Send my live location now
              </Text>
              <Text style={styles.liveLocationSub}>
                Priya gets an SMS with a link that tracks you until you stop
                sharing.
              </Text>
            </View>
          </View>
          <Pressable
            style={styles.shareNowBtn}
            onPress={() =>
              showToast({
                type: 'success',
                message: 'Live location link sent to Priya',
              })
            }
            accessibilityRole="button"
            accessibilityLabel="Share with Priya">
            <Text style={styles.shareNowText}>Share with Priya</Text>
          </Pressable>
        </View>
      </ScrollView>

      <View
        style={[styles.footer, {paddingBottom: Math.max(insets.bottom, 12)}]}>
        <Pressable
          style={styles.removeBtn}
          onPress={onRemove}
          accessibilityRole="button"
          accessibilityLabel="Remove">
          <Text style={styles.removeBtnText}>Remove</Text>
        </Pressable>
        <Pressable
          style={styles.saveBtn}
          onPress={onSave}
          accessibilityRole="button"
          accessibilityLabel="Save">
          <Text style={styles.saveBtnText}>Save</Text>
        </Pressable>
      </View>
    </View>
  );
}
