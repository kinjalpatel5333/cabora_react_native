import React, {useMemo, useState} from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  Switch,
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

const MAX_CONTACTS = 5;

const INITIAL = [
  {
    id: 'c1',
    initials: 'PS',
    name: 'Priya Sharma',
    meta: 'Sister · +91 98450 33119',
    avatarBg: '#FDE8D8',
    avatarFg: '#C45C26',
    autoShare: true,
    alertSos: true,
  },
  {
    id: 'c2',
    initials: 'VS',
    name: 'Vikram Singh',
    meta: 'Father · +91 98112 44550',
    avatarBg: '#DCEBFC',
    avatarFg: '#1D63C5',
    autoShare: true,
    alertSos: true,
  },
  {
    id: 'c3',
    initials: 'NK',
    name: 'Neha Kapoor',
    meta: 'Friend · +91 97654 22001',
    avatarBg: '#DDF3E6',
    avatarFg: '#1C8A4D',
    autoShare: false,
    alertSos: true,
  },
];

const PRIVACY = [
  {ok: true, text: 'Your live location while a trip is running'},
  {ok: true, text: 'Driver name, photo and vehicle number'},
  {ok: false, text: 'Your home address or saved places'},
];

export default function TrustedContactsScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
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
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <View style={[styles.header, {paddingTop: insets.top + 4}]}>
        <Pressable
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}>
          <Feather name="arrow-left" size={22} color={colors.navy[900]} />
        </Pressable>
        <Text style={styles.headerTitle}>Trusted contacts</Text>
        <Pressable
          style={styles.headerBtn}
          onPress={() =>
            showToast({type: 'info', message: 'Trusted contacts help'})
          }
          accessibilityRole="button"
          accessibilityLabel="Help"
          hitSlop={8}>
          <Feather name="help-circle" size={22} color={colors.navy[900]} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {paddingBottom: Math.max(insets.bottom, 12) + 90},
        ]}>
        <View style={styles.statusCard}>
          <View style={styles.statusIcon}>
            <Feather name="users" size={20} color={colors.blue[600]} />
          </View>
          <View style={{flex: 1}}>
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
                  color={colors.gray[400]}
                />
              </Pressable>
            </View>

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Auto-share every ride</Text>
              <Switch
                value={contact.autoShare}
                onValueChange={v => setToggle(contact.id, 'autoShare', v)}
                trackColor={{
                  false: colors.gray[200],
                  true: colors.orange[500],
                }}
                thumbColor={colors.white}
                ios_backgroundColor={colors.gray[200]}
              />
            </View>
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Alert on SOS</Text>
              <Switch
                value={contact.alertSos}
                onValueChange={v => setToggle(contact.id, 'alertSos', v)}
                trackColor={{
                  false: colors.gray[200],
                  true: colors.orange[500],
                }}
                thumbColor={colors.white}
                ios_backgroundColor={colors.gray[200]}
              />
            </View>
          </View>
        ))}

        <Pressable
          style={styles.addCard}
          onPress={() => {
            if (contacts.length >= MAX_CONTACTS) {
              showToast({
                type: 'info',
                message: `You can add up to ${MAX_CONTACTS} contacts`,
              });
              return;
            }
            showToast({type: 'info', message: 'Add a trusted contact'});
          }}
          accessibilityRole="button"
          accessibilityLabel="Add a trusted contact">
          <Feather name="plus" size={18} color={colors.orange[600]} />
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
                size={18}
                color={row.ok ? colors.green[500] : colors.gray[400]}
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
