import React, {useState} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useToast} from '../../components/Toast';
import {Button} from '../../components';
import {useApp} from '../../context/AppContext';
import useThemedStyles from '../../components/useThemedStyles';
import {addEmergencyContactApi, deleteEmergencyContactApi} from '../../services/userApi';
import createStyles from './style';

const RELATIONSHIP_OPTIONS = [
  'Brother',
  'Sister',
  'Parent',
  'Spouse',
  'Friend',
  'Other',
];

function CustomToggle({value, onToggle, label, styles}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
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

export default function SafetyNumberScreen() {
  const insets = useSafeAreaInsets();
  const {colors} = useApp();
  const styles = useThemedStyles(createStyles);
  const navigation = useNavigation();
  const route = useRoute();
  const {showToast} = useToast();

  const editingContact = route.params?.contact || null;

  const [name, setName] = useState(editingContact?.name || '');
  const [mobile, setMobile] = useState(
    editingContact?.phone || editingContact?.mobile || '',
  );
  const [relationship, setRelationship] = useState(
    editingContact?.relation || editingContact?.relationship || 'Brother',
  );
  const [customRelation, setCustomRelation] = useState(
    RELATIONSHIP_OPTIONS.includes(
      editingContact?.relation || editingContact?.relationship,
    )
      ? ''
      : editingContact?.relation || editingContact?.relationship || '',
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const [toggles, setToggles] = useState({
    after9pm: editingContact?.after9pm ?? true,
    over30min: editingContact?.over30min ?? true,
    airport: editingContact?.airport ?? false,
    tapShare: editingContact?.tapShare ?? false,
  });

  const handleToggle = key => {
    setToggles(prev => ({...prev, [key]: !prev[key]}));
  };

  const handleSelectRelationship = option => {
    setRelationship(option);
    if (option !== 'Other') {
      setCustomRelation('');
    }
  };

  const onSave = async () => {
    if (!name.trim()) {
      showToast({type: 'error', message: 'Please enter contact name'});
      return;
    }

    const cleanMobile = mobile.trim();
    if (!cleanMobile) {
      showToast({type: 'error', message: 'Please enter mobile number'});
      return;
    }

    const digitsOnly = cleanMobile.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      showToast({
        type: 'error',
        message: 'Please enter a valid 10-digit mobile number',
      });
      return;
    }

    const formattedMobile = cleanMobile.startsWith('+')
      ? cleanMobile
      : `+91${digitsOnly.slice(-10)}`;

    const finalRelationship =
      relationship === 'Other' && customRelation.trim()
        ? customRelation.trim()
        : relationship.trim() || 'Emergency Contact';

    setIsSaving(true);
    try {
      const payload = {
        name: name.trim(),
        mobile: formattedMobile,
        relationship: finalRelationship,
      };

      await addEmergencyContactApi(payload);

      showToast({
        type: 'success',
        message: 'Emergency contact added successfully',
      });
      navigation.goBack();
    } catch (err) {
      console.error('Failed to add emergency contact:', err);
      showToast({
        type: 'error',
        message: err?.message || 'Failed to save emergency contact',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const onRemove = async () => {
    if (!editingContact?.id && !editingContact?._id) {
      navigation.goBack();
      return;
    }

    setIsRemoving(true);
    try {
      const contactId = editingContact.id || editingContact._id;
      await deleteEmergencyContactApi(contactId);
      showToast({type: 'success', message: 'Emergency contact removed'});
      navigation.goBack();
    } catch (err) {
      console.error('Failed to delete emergency contact:', err);
      showToast({
        type: 'error',
        message: err?.message || 'Failed to remove contact',
      });
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, {paddingTop: insets.top + 4}]}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {editingContact ? 'Edit contact' : 'Add emergency contact'}
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.headerBtn}
          onPress={() => navigation.navigate('Help')}
          accessibilityRole="button"
          accessibilityLabel="Help"
          hitSlop={8}>
          <Feather name="help-circle" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scroll,
            {paddingBottom: Math.max(insets.bottom, 16) + 30},
          ]}>
          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Feather
                name="shield"
                size={20}
                color={colors.blue?.[550] || colors.primary}
              />
            </View>
            <View style={styles.infoBody}>
              <Text style={styles.infoTitle}>Trusted safety contact</Text>
              <Text style={styles.infoSub}>
                Cabora will notify this contact via SMS and call when you trigger
                an SOS or share your ride.
              </Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>CONTACT DETAILS</Text>
          <View style={styles.formCard}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <View style={styles.textInputBox}>
                <TextInput
                  style={styles.textInputField}
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. John Doe"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Mobile Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mobile Number *</Text>
              <View style={styles.textInputBox}>
                <Text style={styles.phonePrefix}>+91</Text>
                <TextInput
                  style={styles.textInputField}
                  value={mobile.replace(/^\+91\s*/, '')}
                  onChangeText={text => setMobile(text)}
                  placeholder="98765 43210"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="phone-pad"
                  maxLength={15}
                />
              </View>
            </View>

            {/* Relationship */}
            <View style={[styles.inputGroup, {marginBottom: 0}]}>
              <Text style={styles.inputLabel}>Relationship</Text>
              <View style={styles.chipRow}>
                {RELATIONSHIP_OPTIONS.map(opt => {
                  const isSelected = relationship === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      activeOpacity={0.7}
                      style={[
                        styles.relationChip,
                        isSelected && styles.relationChipActive,
                      ]}
                      onPress={() => handleSelectRelationship(opt)}>
                      <Text
                        style={[
                          styles.relationChipText,
                          isSelected && styles.relationChipTextActive,
                        ]}>
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {relationship === 'Other' && (
                <View style={[styles.textInputBox, {marginTop: 10}]}>
                  <TextInput
                    style={styles.textInputField}
                    value={customRelation}
                    onChangeText={setCustomRelation}
                    placeholder="Specify relationship (e.g. Colleague)"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
              )}
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
        </ScrollView>
      </KeyboardAvoidingView>

      <View
        style={[styles.footer, {paddingBottom: Math.max(insets.bottom, 12)}]}>
        {editingContact ? (
          <Button
            title={isRemoving ? 'Removing...' : 'Remove'}
            variant="outline"
            onPress={onRemove}
            disabled={isRemoving || isSaving}
            style={styles.removeBtn}
            textStyle={styles.removeBtnText}
            fullWidth={false}
            accessibilityLabel="Remove contact"
          />
        ) : (
          <Button
            title="Cancel"
            variant="outline"
            onPress={() => navigation.goBack()}
            style={styles.removeBtn}
            textStyle={styles.removeBtnText}
            fullWidth={false}
            accessibilityLabel="Cancel"
          />
        )}
        <Button
          title={isSaving ? 'Saving...' : 'Save Contact'}
          variant="primary"
          onPress={onSave}
          disabled={isSaving || isRemoving}
          style={styles.saveBtn}
          textStyle={styles.saveBtnText}
          fullWidth={false}
          accessibilityLabel="Save Contact"
        />
      </View>
    </View>
  );
}
