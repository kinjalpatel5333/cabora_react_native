import { PASSENGER_TRUSTED_CONTACTS_INITIAL, PASSENGER_TRUSTED_CONTACTS_PRIVACY } from '../../config/staticData';
import React, {useCallback, useMemo, useState} from 'react';
import {ActivityIndicator, RefreshControl, ScrollView, Text, View, TouchableOpacity} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useToast} from '../../components/Toast';
import {Button} from '../../components';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import {getEmergencyContactsApi} from '../../services/userApi';
import createStyles from './style';
import colors from '../../config/color';

const MAX_CONTACTS = 5;

const INITIAL = PASSENGER_TRUSTED_CONTACTS_INITIAL;

const PRIVACY = PASSENGER_TRUSTED_CONTACTS_PRIVACY;

function CustomToggle({value, onToggle, label, styles}) {
  return (
    <TouchableOpacity activeOpacity={0.7}
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
    </TouchableOpacity>
  );
}

export default function TrustedContactsScreen() {
  const insets = useSafeAreaInsets();
  const {colors} = useApp();
  const styles = useThemedStyles(createStyles);
  const navigation = useNavigation();
  const {showToast} = useToast();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getEmergencyContactsApi();
      const rawList =
        res?.data?.emergencyContacts ||
        res?.data?.contacts ||
        res?.data ||
        res?.emergencyContacts ||
        res?.contacts ||
        (Array.isArray(res) ? res : []);

      if (Array.isArray(rawList)) {
        const formatted = rawList.map((item, index) => {
          const name = item.name || item.fullName || 'Emergency Contact';
          const phone = item.phone || item.mobile || item.phoneNumber || '';
          const relation = item.relation || item.relationship || 'Emergency Contact';
          const initials = name
            .trim()
            .split(/\s+/)
            .map(part => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase() || 'EC';
          const meta = phone ? `${phone} · ${relation}` : relation;
          return {
            id: item._id || item.id || `contact-${index}`,
            name,
            phone,
            relation,
            initials,
            meta,
            avatarBg: item.avatarBg || '#1E3A8A',
            avatarFg: item.avatarFg || '#93C5FD',
            autoShare: item.autoShare ?? true,
            alertSos: item.alertSos ?? true,
            ...item,
          };
        });
        setContacts(formatted);
      } else {
        setContacts([]);
      }
    } catch (err) {
      console.warn('Failed to load emergency contacts:', err);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchContacts();
    }, [fetchContacts]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchContacts();
    setRefreshing(false);
  };

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
      <View style={[styles.header, {paddingTop: insets.top + 4}]}>
        <TouchableOpacity activeOpacity={0.7}
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trusted contacts</Text>
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
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

        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} style={{paddingVertical: 20}} />
        ) : contacts.length === 0 ? (
          <View style={[styles.contactCard, {paddingVertical: 24, alignItems: 'center', justifyContent: 'center'}]}>
            <Feather name="users" size={32} color={colors.blue[550]} style={{marginBottom: 8}} />
            <Text style={{fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 4}}>
              No contacts added
            </Text>
            <Text style={{fontSize: 13, color: colors.textMuted, textAlign: 'center', paddingHorizontal: 16}}>
              Add emergency contacts to share your location automatically.
            </Text>
          </View>
        ) : (
          contacts.map(contact => (
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
                <TouchableOpacity activeOpacity={0.7}
                  style={styles.menuBtn}
                  onPress={() =>
                    navigation.navigate('SafetyNumber', {contact})
                  }
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={`Options for ${contact.name}`}>
                  <Feather
                    name="edit-2"
                    size={16}
                    color={colors.slate[500]}
                  />
                </TouchableOpacity>
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
          ))
        )}

        <TouchableOpacity activeOpacity={0.7}
          style={styles.addCard}
          onPress={() => {
            navigation.navigate('SafetyNumber');
          }}
          accessibilityRole="button"
          accessibilityLabel="Add a trusted contact">
          <Feather name="plus" size={18} color={colors.primary} />
          <Text style={styles.addText}>Add a trusted contact</Text>
        </TouchableOpacity>

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
        <Button
          title="Save changes"
          onPress={onSave}
          accessibilityLabel="Save changes"
        />
      </View>
    </View>
  );
}
