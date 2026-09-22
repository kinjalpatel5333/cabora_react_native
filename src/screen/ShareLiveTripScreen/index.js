import React, {useMemo, useState} from 'react';
import {
  Clipboard,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useToast} from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import createStyles from './style';
import colors from '../../config/color';

const CONTACTS = [
  {id: 'priya', initials: 'PM', name: 'Priya', selected: true},
  {id: 'vikram', initials: 'VM', name: 'Vikram', selected: true},
  {id: 'ananya', initials: 'AS', name: 'Ananya', selected: false},
];

const TRACKING_LINK = 'cabora.in/t/8QK2-M4RD';

export default function ShareLiveTripScreen({
  visible,
  onClose,
  destination = 'Airport T2',
  eta = '12:24 pm',
}) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const {showToast} = useToast();
  const [contacts, setContacts] = useState(CONTACTS);
  const [phone, setPhone] = useState('+91 98765 43210');

  const selectedCount = useMemo(
    () => contacts.filter(c => c.selected).length,
    [contacts],
  );

  const toggleContact = id => {
    setContacts(prev =>
      prev.map(c => (c.id === id ? {...c, selected: !c.selected} : c)),
    );
  };

  const onSendPhone = () => {
    const digits = phone.replace(/[^0-9]/g, '');
    if (digits.length < 10) {
      showToast({type: 'info', message: 'Enter a valid mobile number'});
      return;
    }
    showToast({type: 'success', message: `Link sent to ${phone}`});
  };

  const onCopy = () => {
    try {
      Clipboard.setString(TRACKING_LINK);
      showToast({type: 'success', message: 'Tracking link copied'});
    } catch {
      showToast({type: 'info', message: 'Could not copy link'});
    }
  };

  const onShare = () => {
    if (selectedCount === 0) {
      showToast({type: 'info', message: 'Select at least one contact'});
      return;
    }
    showToast({
      type: 'success',
      message: `Shared with ${selectedCount} contact${selectedCount > 1 ? 's' : ''}`,
    });
    onClose?.();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={styles.root}>
        <StatusBar barStyle={colors.isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
        <View style={[styles.header, {paddingTop: insets.top + 4}]}>
          <Pressable
            style={styles.headerBtn}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={8}>
            <Feather name="arrow-left" size={22} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Share live trip</Text>
          <View style={styles.headerBtn} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.scroll,
            {paddingBottom: Math.max(insets.bottom, 12) + 90},
          ]}>
          <View style={styles.mapCard}>
            <View style={styles.mapBg}>
              <View style={styles.roadH} />
              <View style={styles.roadV} />
              <View style={styles.park} />
              <View style={styles.routeLine} />
              <View style={styles.startPin}>
                <MaterialDesignIcons
                  name="car-side"
                  size={14}
                  color={colors.white}
                />
              </View>
              <View style={styles.endPin}>
                <Feather name="map-pin" size={22} color={colors.text} />
              </View>
            </View>
            <View style={styles.etaPill}>
              <MaterialDesignIcons
                name="car-side"
                size={14}
                color={colors.orange[500]}
              />
              <Text style={styles.etaText}>
                To {destination} · ETA {eta}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>WHO CAN FOLLOW THIS TRIP</Text>
          <View style={styles.contactsRow}>
            {contacts.map(contact => (
              <Pressable
                key={contact.id}
                style={styles.contactItem}
                onPress={() => toggleContact(contact.id)}>
                <View
                  style={[
                    styles.avatar,
                    contact.selected ? styles.avatarSelected : styles.avatarMuted,
                  ]}>
                  <Text
                    style={[
                      styles.avatarText,
                      !contact.selected && styles.avatarTextMuted,
                    ]}>
                    {contact.initials}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.contactName,
                    !contact.selected && styles.contactNameMuted,
                  ]}>
                  {contact.name}
                </Text>
              </Pressable>
            ))}
            <Pressable
              style={styles.contactItem}
              onPress={() =>
                showToast({type: 'info', message: 'Add a contact'})
              }>
              <View style={styles.addAvatar}>
                <Feather name="plus" size={20} color={colors.muted} />
              </View>
              <Text style={styles.contactNameMuted}>Add</Text>
            </Pressable>
          </View>

          <Text style={styles.orLabel}>Or send to a mobile number</Text>
          <View style={styles.phoneRow}>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={styles.phoneInput}
              placeholder="+91 98765 43210"
              placeholderTextColor={colors.muted}
            />
            <Pressable style={styles.sendBtn} onPress={onSendPhone}>
              <Text style={styles.sendText}>Send</Text>
            </Pressable>
          </View>

          <View style={styles.linkCard}>
            <Text style={styles.linkLabel}>TRACKING LINK</Text>
            <View style={styles.linkRow}>
              <Text style={styles.linkText} numberOfLines={1}>
                {TRACKING_LINK}
              </Text>
              <Pressable style={styles.copyBtn} onPress={onCopy}>
                <Feather name="copy" size={14} color={colors.text} />
                <Text style={styles.copyText}>Copy</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.infoBanner}>
            <Feather name="clock" size={16} color={colors.blue[600]} />
            <Text style={styles.infoText}>
              The link stops working the moment your trip ends, or after 2
              hours. Nobody can see your saved places or payment details.
            </Text>
          </View>
        </ScrollView>

        <View
          style={[
            styles.footer,
            {paddingBottom: Math.max(insets.bottom, 12)},
          ]}>
          <Pressable
            style={styles.shareBtn}
            onPress={onShare}
            accessibilityRole="button"
            accessibilityLabel={`Share with ${selectedCount} contacts`}>
            <Text style={styles.shareText}>
              Share with {selectedCount} contact
              {selectedCount === 1 ? '' : 's'}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
