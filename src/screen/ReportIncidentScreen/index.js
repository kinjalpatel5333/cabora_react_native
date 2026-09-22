import { PASSENGER_REPORT_INCIDENTS } from '../../config/staticData';
import React, {useState} from 'react';
import {Linking, ScrollView, Text, TextInput, View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {Lucide} from '@react-native-vector-icons/lucide/static';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useToast} from '../../components/Toast';
import {useApp} from '../../context/AppContext';
import useThemedStyles from '../../components/useThemedStyles';
import createStyles from './style';
import colors from '../../config/color';

const INCIDENTS = PASSENGER_REPORT_INCIDENTS;

function CategoryIcon({item, isSelected, colors}) {
  const color = isSelected ? colors.primary : colors.textMuted;
  if (item.iconType === 'lucide') {
    return <Lucide name={item.icon} size={18} color={color} />;
  }
  if (item.iconType === 'mdi') {
    return (
      <MaterialDesignIcons
        name={item.icon}
        size={18}
        color={color}
      />
    );
  }
  return <Feather name={item.icon} size={18} color={color} />;
}

export default function ReportIncidentScreen() {
  const insets = useSafeAreaInsets();
  const {colors} = useApp();
  const styles = useThemedStyles(createStyles);
  const navigation = useNavigation();
  const {showToast} = useToast();

  const [selectedIncident, setSelectedIncident] = useState('driving');
  const [description, setDescription] = useState(
    'The driver was on a call for most of the trip and took a turn without indicating near Marathahalli.',
  );
  const [anonymous, setAnonymous] = useState(false);

  const onCall112 = () => {
    Linking.openURL('tel:112').catch(() => {
      showToast({type: 'error', message: 'Could not place call to 112'});
    });
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, {paddingTop: insets.top + 4}]}>
        <TouchableOpacity activeOpacity={0.7}
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report an incident</Text>
        <TouchableOpacity activeOpacity={0.7}
          style={styles.headerBtn}
          onPress={() => navigation.navigate('Help')}
          accessibilityRole="button"
          accessibilityLabel="Help"
          hitSlop={8}>
          <Feather name="help-circle" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {paddingBottom: Math.max(insets.bottom, 16) + 20},
        ]}>
        <View style={styles.alertBanner}>
          <View style={styles.alertLeft}>
            <View style={styles.alertIcon}>
              <MaterialDesignIcons
                name="alarm-light-outline"
                size={22}
                color={colors.red.primary}
              />
            </View>
            <View style={styles.alertTextCol}>
              <Text style={styles.alertTitle}>In danger right now?</Text>
              <Text style={styles.alertSub}>
                Call 112 or use SOS — don't wait for this form.
              </Text>
            </View>
          </View>
          <TouchableOpacity activeOpacity={0.7}
            style={styles.callBtn}
            onPress={onCall112}
            accessibilityRole="button"
            accessibilityLabel="Call 112">
            <Text style={styles.callBtnText}>Call 112</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>WHICH RIDE</Text>
        <View style={styles.rideCard}>
          <View style={styles.rideTop}>
            <View style={styles.rideIcon}>
              <Lucide name="car" size={22} color={colors.text} />
            </View>
            <View style={styles.rideInfo}>
              <Text style={styles.rideTitle}>CBR-88214 · today 18:42</Text>
              <Text style={styles.rideSub}>
                Indiranagar → Whitefield · Suresh Nair
              </Text>
            </View>
          </View>
          <TouchableOpacity activeOpacity={0.7}
            onPress={() => showToast({type: 'info', message: 'Change ride'})}
            hitSlop={6}>
            <Text style={styles.changeRideLink}>Change ride</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>WHAT HAPPENED</Text>
        <View style={styles.categoriesGrid}>
          {INCIDENTS.map(item => {
            const isSelected = selectedIncident === item.id;
            return (
              <TouchableOpacity activeOpacity={0.7}
                key={item.id}
                style={[
                  styles.categoryCard,
                  isSelected && styles.categoryCardSelected,
                ]}
                onPress={() => setSelectedIncident(item.id)}
                accessibilityRole="button"
                accessibilityLabel={item.label.replace('\n', ' ')}>
                <View style={styles.categoryIcon}>
                  <CategoryIcon item={item} isSelected={isSelected} colors={colors} />
                </View>
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextSelected,
                  ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>TELL US MORE</Text>
        <View style={styles.textAreaCard}>
          <TextInput
            style={styles.textInput}
            multiline
            value={description}
            onChangeText={setDescription}
            placeholder="Please describe what happened..."
            placeholderTextColor={colors.textMuted}
            maxLength={500}
          />
          <Text style={styles.charCount}>{`${description.length} / 500`}</Text>
        </View>

        <TouchableOpacity activeOpacity={0.7}
          style={styles.photoBtn}
          onPress={() =>
            showToast({type: 'info', message: 'Attach photo or screenshot'})
          }
          accessibilityRole="button"
          accessibilityLabel="Add a photo or screenshot">
          <Feather name="camera" size={18} color={colors.textMuted} />
          <Text style={styles.photoBtnText}>Add a photo or screenshot</Text>
        </TouchableOpacity>

        <View style={styles.anonymousCard}>
          <View style={styles.anonymousInfo}>
            <Text style={styles.anonymousTitle}>Report anonymously</Text>
            <Text style={styles.anonymousSub}>
              The driver won't see your name
            </Text>
          </View>
          <TouchableOpacity activeOpacity={0.7}
            onPress={() => setAnonymous(!anonymous)}
            accessibilityRole="switch"
            accessibilityState={{checked: anonymous}}
            accessibilityLabel="Report anonymously"
            style={[
              styles.toggleTrack,
              anonymous ? styles.toggleTrackActive : styles.toggleTrackInactive,
            ]}>
            <View
              style={[
                styles.toggleThumb,
                anonymous
                  ? styles.toggleThumbActive
                  : styles.toggleThumbInactive,
              ]}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
