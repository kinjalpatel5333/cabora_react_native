import { PASSENGER_TRUSTED_CONTACTS_INITIAL, PASSENGER_TRUSTED_CONTACTS_PRIVACY } from '../../config/staticData';
import React, {useMemo, useState} from 'react';
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
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import createStyles from './style';
import colors from '../../config/color';

const MAX_CONTACTS = 5;

const INITIAL = PASSENGER_TRUSTED_CONTACTS_INITIAL;

const PRIVACY = PASSENGER_TRUSTED_CONTACTS_PRIVACY;

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

export default function TrustedContactsScreen() {
  const insets = useSafeAreaInsets();
  const {colors} = useApp();
  const styles = useThemedStyles(createStyles);
  const navigation = useNavigation();
  const {showToast} = useToast();
  const [contacts, setContacts] = useState(INITIAL);

  const countLabel = useMemo(
    () => `${contacts.length} of ${MAX_CONTACTS} contacts added`,
    [contacts.length],
  );

  const setToggle = (id, key, value) => {
    setContacts(prev =>
      prev.map(c => (c.id === id ? {...c, [key]: value} : c)),
    );
  };

  const onSave = () => {
    showToast({type: 'success', message: 'Trusted contacts saved'});
    navigation.goBack();
  };

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle={colors.barStyle}
        backgroundColor={colors.card}
      />
      <View style={[styles.header, {paddingTop: insets.top + 4}]}>
        <Pressable
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Trusted contacts</Text>
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
          {paddingBottom: Math.max(insets.bottom, 12) + 20},
        ]}>
        <View style={styles.statusCard}>
          <View style={styles.statusIconContainer}>
            <Feather name="users" size={20} color={colors.blue[550]} />
          </View>
          <View style={styles.statusBody}>
            <Text style={styles.statusTitle}>{countLabel}</Text>
            <Text style={styles.statusSub}>
              Trusted contacts can see your live trip and are alerted if you
              raise an SOS.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>YOUR CONTACTS</Text>

        {contacts.map(contact => (
          <View key={contact.id} style={styles.contactCard}>
            <View style={styles.contactTop}>
              <View
                style={[styles.avatar, {backgroundColor: contact.avatarBg}]}>
                <Text style={[styles.avatarText, {color: contact.avatarFg}]}>
                  {contact.initials}
                </Text>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactMeta}>{contact.meta}</Text>
              </View>
              <Pressable
                style={styles.menuBtn}
                onPress={() =>
                  showToast({
                    type: 'info',
                    message: `Options for ${contact.name}`,
                  })
                }
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={`Options for ${contact.name}`}>
                <Feather
                  name="more-vertical"
                  size={18}
                  color={colors.slate[500]}
                />
              </Pressable>
            </View>

            <View style={styles.togglesRow}>
              <View style={styles.toggleItem}>
                <Text style={styles.toggleText}>Auto-share every ride</Text>
                <CustomToggle
                  value={contact.autoShare}
                  onToggle={v => setToggle(contact.id, 'autoShare', v)}
                  label="Auto-share every ride"
                  styles={styles}
                />
              </View>
              <View style={styles.toggleItem}>
                <Text style={styles.toggleText}>Alert on SOS</Text>
                <CustomToggle
                  value={contact.alertSos}
                  onToggle={v => setToggle(contact.id, 'alertSos', v)}
                  label="Alert on SOS"
                  styles={styles}
                />
              </View>
            </View>
          </View>
        ))}

        <Pressable
          style={styles.addCard}
          onPress={() => {
            navigation.navigate('SafetyNumber');
          }}
          accessibilityRole="button"
          accessibilityLabel="Add a trusted contact">
          <Feather name="plus" size={18} color={colors.primary} />
          <Text style={styles.addText}>Add a trusted contact</Text>
        </Pressable>

        <View style={styles.privacyCard}>
          <Text style={styles.privacyTitle}>What they can see</Text>
          {PRIVACY.map((row, index) => (
            <View
              key={row.text}
              style={[
                styles.privacyRow,
                index === PRIVACY.length - 1 && styles.privacyRowLast,
              ]}>
              <Feather
                name={row.ok ? 'check-circle' : 'x-circle'}
                size={16}
                color={row.ok ? colors.green[600] : colors.slate[400]}
              />
              <Text
                style={[
                  styles.privacyText,
                  !row.ok && styles.privacyTextMuted,
                ]}>
                {row.text}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View
        style={[styles.footer, {paddingBottom: Math.max(insets.bottom, 12)}]}>
        <Pressable
          style={styles.saveBtn}
          onPress={onSave}
          accessibilityRole="button"
          accessibilityLabel="Save changes">
          <Text style={styles.saveText}>Save changes</Text>
        </Pressable>
      </View>
    </View>
  );
}
