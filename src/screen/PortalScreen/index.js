import React, {useMemo, useRef, useState} from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {Lucide} from '@react-native-vector-icons/lucide/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useToast} from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import createStyles from './style';
import colors from '../../config/color';

const SAVED = [
  {id: 'home', label: 'Home'},
  {id: 'work', label: 'Work'},
  {id: 'mums', label: "Mum's place"},
  {id: 'new', label: '+ New'},
];

const PLACE_SUGGESTIONS = [
  {
    id: 'indira-100',
    title: 'Indiranagar 100ft Road',
    meta: '402, Brigade Residency, Bengaluru 560038',
  },
  {
    id: 'indira-metro',
    title: 'Indiranagar Metro Station',
    meta: '100 Feet Rd, Indiranagar, Bengaluru 560038',
  },
  {
    id: 'indira-12th',
    title: 'Indiranagar 12th Main',
    meta: 'Near CMH Road, Bengaluru 560008',
  },
  {
    id: 'kora-5',
    title: 'Koramangala 5th Block',
    meta: '18, 80 Feet Road, near Sony World, Bengaluru 560095',
  },
  {
    id: 'kora-forum',
    title: 'The Forum Mall Koramangala',
    meta: 'Hosur Road, Koramangala, Bengaluru 560095',
  },
  {
    id: 'hsr',
    title: 'HSR Layout Sector 2',
    meta: '27th Main Rd, HSR Layout, Bengaluru 560102',
  },
  {
    id: 'jayanagar',
    title: 'Jayanagar 4th Block',
    meta: '11th Main Rd, Jayanagar, Bengaluru 560011',
  },
  {
    id: 'mg',
    title: 'MG Road',
    meta: 'Near Trinity Metro, Bengaluru 560001',
  },
  {
    id: 'whitefield',
    title: 'Whitefield Main Road',
    meta: 'ITPL Road, Whitefield, Bengaluru 560066',
  },
  {
    id: 'airport',
    title: 'Kempegowda International Airport',
    meta: 'Terminal 2, Devanahalli, Bengaluru 560300',
  },
];

const SAVED_PLACES = {
  home: {
    title: 'Home',
    meta: '12, Brigade Road, Ashok Nagar, Bengaluru 560025',
  },
  work: {
    title: 'Work',
    meta: 'Prestige Tech Park, Marathahalli, Bengaluru 560037',
  },
  mums: {
    title: "Mum's place",
    meta: '14th Cross, Malleshwaram, Bengaluru 560003',
  },
};

function filterSuggestions(query) {
  const q = query.trim().toLowerCase();
  if (!q) {
    return PLACE_SUGGESTIONS.slice(0, 5);
  }
  return PLACE_SUGGESTIONS.filter(
    item =>
      item.title.toLowerCase().includes(q) ||
      item.meta.toLowerCase().includes(q),
  ).slice(0, 6);
}

function AddressBlock({
  label,
  place,
  onChangePlace,
  editing,
  onStartEdit,
  onEndEdit,
  query,
  onChangeQuery,
  dotColor,
  contact,
  contactTrailing,
  styles,
  colors,
  inputRef,
}) {
  const suggestions = useMemo(() => filterSuggestions(query), [query]);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <View style={styles.card}>
        <View style={styles.placeRow}>
          <View style={[styles.placeDot, {backgroundColor: dotColor}]} />
          <View style={styles.placeCopy}>
            {editing ? (
              <TextInput
                ref={inputRef}
                value={query}
                onChangeText={onChangeQuery}
                style={styles.placeInput}
                placeholder="Search address"
                placeholderTextColor={colors.muted}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={() => {
                  if (query.trim()) {
                    onChangePlace({
                      title: query.trim(),
                      meta: 'Bengaluru',
                    });
                  }
                  onEndEdit();
                }}
              />
            ) : (
              <>
                <Text style={styles.placeTitle}>{place.title}</Text>
                <Text style={styles.placeMeta}>{place.meta}</Text>
              </>
            )}
          </View>
          <Pressable
            style={styles.editIconBtn}
            onPress={() => {
              if (editing) {
                if (query.trim()) {
                  onChangePlace({
                    title: query.trim(),
                    meta: place.meta || 'Bengaluru',
                  });
                }
                onEndEdit();
              } else {
                onStartEdit();
              }
            }}
            hitSlop={8}
            accessibilityLabel={editing ? 'Done editing' : 'Edit address'}>
            <Feather
              name={editing ? 'check' : 'edit-2'}
              size={16}
              color={editing ? colors.primary : colors.muted}
            />
          </Pressable>
        </View>

        {editing ? (
          <View style={styles.suggestBox}>
            {suggestions.length === 0 ? (
              <Text style={styles.suggestEmpty}>No places match “{query}”</Text>
            ) : (
              suggestions.map((item, index) => (
                <Pressable
                  key={item.id}
                  style={[
                    styles.suggestRow,
                    index === suggestions.length - 1 && styles.suggestRowLast,
                  ]}
                  onPress={() => {
                    onChangePlace({title: item.title, meta: item.meta});
                    onEndEdit();
                  }}>
                  <Feather name="map-pin" size={16} color={colors.muted} />
                  <View style={styles.suggestCopy}>
                    <Text style={styles.suggestTitle}>{item.title}</Text>
                    <Text style={styles.suggestMeta} numberOfLines={1}>
                      {item.meta}
                    </Text>
                  </View>
                </Pressable>
              ))
            )}
          </View>
        ) : (
          <>
            <View style={styles.divider} />
            <View style={styles.contactRow}>
              <Feather name="user" size={16} color={colors.muted} />
              <Text style={styles.contactCopy} numberOfLines={1}>
                {contact}
              </Text>
              {contactTrailing}
            </View>
          </>
        )}
      </View>
    </View>
  );
}

export default function PortalScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const navigation = useNavigation();
  const {showToast} = useToast();
  const pickupInputRef = useRef(null);
  const dropInputRef = useRef(null);

  const [note, setNote] = useState(
    'Ring the bell twice. Leave with security if no answer.',
  );
  const [savedId, setSavedId] = useState('home');
  const [pickup, setPickup] = useState({
    title: 'Indiranagar 100ft Road',
    meta: '402, Brigade Residency, Bengaluru 560038',
  });
  const [drop, setDrop] = useState({
    title: 'Koramangala 5th Block',
    meta: '18, 80 Feet Road, near Sony World, Bengaluru 560095',
  });
  const [editingField, setEditingField] = useState(null);
  const [pickupQuery, setPickupQuery] = useState('');
  const [dropQuery, setDropQuery] = useState('');

  const startEdit = field => {
    if (field === 'pickup') {
      setPickupQuery(pickup.title);
      setEditingField('pickup');
      setTimeout(() => pickupInputRef.current?.focus(), 50);
    } else {
      setDropQuery(drop.title);
      setEditingField('drop');
      setTimeout(() => dropInputRef.current?.focus(), 50);
    }
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
        <Text style={styles.headerTitle}>Send with Portal</Text>
        <Pressable
          style={styles.headerBtn}
          onPress={() => navigation.navigate('Help')}
          accessibilityRole="button"
          accessibilityLabel="Help"
          hitSlop={8}>
          <Feather name="help-circle" size={22} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.progressWrap}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressSeg, styles.progressSegActive]} />
          <View style={styles.progressSeg} />
          <View style={styles.progressSeg} />
        </View>
        <Text style={styles.stepText}>Step 1 of 3</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.scroll, {paddingBottom: 24}]}>
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Lucide name="briefcase" size={20} color={colors.primary} />
          </View>
          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>City-wide Portal delivery</Text>
            <Text style={styles.heroBody}>
              A rider collects it from you and hands it over in person.
            </Text>
          </View>
        </View>

        <AddressBlock
          label="PICK UP FROM"
          place={pickup}
          onChangePlace={setPickup}
          editing={editingField === 'pickup'}
          onStartEdit={() => startEdit('pickup')}
          onEndEdit={() => setEditingField(null)}
          query={pickupQuery}
          onChangeQuery={setPickupQuery}
          dotColor={colors.primary}
          contact="Aarav Mehta · +91 98450 21188"
          contactTrailing={<Text style={styles.youTag}>you</Text>}
          styles={styles}
          colors={colors}
          inputRef={pickupInputRef}
        />

        <AddressBlock
          label="DELIVER TO"
          place={drop}
          onChangePlace={setDrop}
          editing={editingField === 'drop'}
          onStartEdit={() => startEdit('drop')}
          onEndEdit={() => setEditingField(null)}
          query={dropQuery}
          onChangeQuery={setDropQuery}
          dotColor={colors.isDark ? colors.blue[400] : colors.navy[800]}
          contact="Priya Sharma · +91 98450 33119"
          contactTrailing={
            <Pressable
              onPress={() =>
                showToast({type: 'info', message: 'Edit recipient'})
              }
              hitSlop={8}>
              <Text style={styles.editText}>Edit</Text>
            </Pressable>
          }
          styles={styles}
          colors={colors}
          inputRef={dropInputRef}
        />

        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>Note for the rider</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            style={styles.noteInput}
            placeholder="Add a note for the rider"
            placeholderTextColor={colors.muted}
            multiline
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SAVED</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.savedScroll}>
            {SAVED.map(item => {
              const active = item.id === savedId;
              return (
                <Pressable
                  key={item.id}
                  style={[
                    styles.savedChip,
                    active && styles.savedChipActive,
                  ]}
                  onPress={() => {
                    if (item.id === 'new') {
                      showToast({type: 'info', message: 'Add saved place'});
                      return;
                    }
                    setSavedId(item.id);
                    const saved = SAVED_PLACES[item.id];
                    if (saved) {
                      setDrop(saved);
                      setEditingField(null);
                    }
                  }}>
                  <Text
                    style={[
                      styles.savedChipText,
                      active && styles.savedChipTextActive,
                    ]}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {paddingBottom: Math.max(insets.bottom, 12)},
        ]}>
        <View style={styles.footerCopy}>
          <Text style={styles.footerLabel}>Distance</Text>
          <Text style={styles.footerValue}>6.4 km · about 24 min</Text>
        </View>
        <Pressable
          style={styles.continueBtn}
          onPress={() => navigation.navigate('PortalStep2')}
          accessibilityRole="button"
          accessibilityLabel="Continue">
          <Text style={styles.continueText}>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}
