import React, {useMemo, useState} from 'react';
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
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useToast} from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import createStyles from './style';
import colors from '../../config/color';

const PORTAL_TYPES = [
  {id: 'documents', label: 'Documents', icon: 'file-text'},
  {id: 'clothes', label: 'Clothes', icon: 'briefcase'},
  {id: 'gift', label: 'Gift', icon: 'gift'},
  {id: 'electronics', label: 'Electronics', icon: 'smartphone'},
  {id: 'medicines', label: 'Medicines', icon: 'pill'},
  {id: 'other', label: 'Other', icon: 'more-vertical'},
];

const SIZES = [
  {
    id: 'small',
    title: 'Small',
    weight: 'up to 3 kg',
    hint: 'fits a bike box',
    vehicle: 'Bike is enough',
  },
  {
    id: 'medium',
    title: 'Medium',
    weight: '3–10 kg',
    hint: 'needs an auto',
    vehicle: 'Auto is enough',
  },
  {
    id: 'large',
    title: 'Large',
    weight: '10–25 kg',
    hint: 'needs a cab',
    vehicle: 'Cab is needed',
  },
];

function TypeIcon({name, color}) {
  if (name === 'gift') {
    return <Feather name="gift" size={22} color={color} />;
  }
  if (name === 'smartphone') {
    return <Feather name="smartphone" size={22} color={color} />;
  }
  if (name === 'pill') {
    return <MaterialDesignIcons name="pill" size={22} color={color} />;
  }
  if (name === 'briefcase') {
    return <Lucide name="briefcase" size={22} color={color} />;
  }
  if (name === 'more-vertical') {
    return <Feather name="more-vertical" size={22} color={color} />;
  }
  return <Feather name="file-text" size={22} color={color} />;
}

export default function PortalStep2Screen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const navigation = useNavigation();
  const {showToast} = useToast();
  const [typeId, setTypeId] = useState('documents');
  const [sizeId, setSizeId] = useState('small');
  const [value, setValue] = useState('2400');
  const [confirmed, setConfirmed] = useState(true);

  const selectedType = useMemo(
    () => PORTAL_TYPES.find(t => t.id === typeId) || PORTAL_TYPES[0],
    [typeId],
  );
  const selectedSize = useMemo(
    () => SIZES.find(s => s.id === sizeId) || SIZES[0],
    [sizeId],
  );

  const formattedValue = useMemo(() => {
    const n = Number(String(value).replace(/[^\d]/g, '')) || 0;
    return `₹${n.toLocaleString('en-IN')}`;
  }, [value]);

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
        <Text style={styles.headerTitle} numberOfLines={1}>
          What are you sending?
        </Text>
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
          <View style={[styles.progressSeg, styles.progressSegActive]} />
          <View style={styles.progressSeg} />
        </View>
        <Text style={styles.stepText}>Step 2 of 3</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.scroll, {paddingBottom: 24}]}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PORTAL TYPE</Text>
          <View style={styles.typeGrid}>
            {[0, 1].map(rowIndex => (
              <View key={rowIndex} style={styles.typeRow}>
                {PORTAL_TYPES.slice(rowIndex * 3, rowIndex * 3 + 3).map(
                  item => {
                    const active = item.id === typeId;
                    const tint = active
                      ? colors.primary
                      : colors.muted;
                    return (
                      <Pressable
                        key={item.id}
                        style={[
                          styles.typeCard,
                          active && styles.typeCardActive,
                        ]}
                        onPress={() => setTypeId(item.id)}
                        accessibilityRole="button"
                        accessibilityState={{selected: active}}>
                        <TypeIcon name={item.icon} color={tint} />
                        <Text
                          style={[
                            styles.typeLabel,
                            active && styles.typeLabelActive,
                          ]}>
                          {item.label}
                        </Text>
                      </Pressable>
                    );
                  },
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SIZE & WEIGHT</Text>
          <View style={styles.sizeList}>
            {SIZES.map(item => {
              const active = item.id === sizeId;
              return (
                <Pressable
                  key={item.id}
                  style={[styles.sizeCard, active && styles.sizeCardActive]}
                  onPress={() => setSizeId(item.id)}
                  accessibilityRole="radio"
                  accessibilityState={{selected: active}}>
                  <View style={[styles.radio, active && styles.radioActive]}>
                    {active ? <View style={styles.radioDot} /> : null}
                  </View>
                  <View style={styles.sizeCopy}>
                    <Text style={styles.sizeTitle}>{item.title}</Text>
                    <Text style={styles.sizeMeta}>{item.weight}</Text>
                  </View>
                  <Text style={styles.sizeHint}>{item.hint}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.valueCard}>
          <Text style={styles.valueLabel}>Declared value</Text>
          <TextInput
            value={formattedValue}
            onChangeText={text => {
              const digits = text.replace(/[^\d]/g, '');
              setValue(digits);
            }}
            style={styles.valueAmount}
            keyboardType="number-pad"
            accessibilityLabel="Declared value"
          />
        </View>
        <Text style={styles.valueNote}>
          Cover up to ₹5,000 is included free. Higher cover costs ₹19.
        </Text>

        <Pressable
          style={styles.confirmCard}
          onPress={() => setConfirmed(v => !v)}
          accessibilityRole="checkbox"
          accessibilityState={{checked: confirmed}}>
          <View style={[styles.checkbox, confirmed && styles.checkboxActive]}>
            {confirmed ? (
              <Feather name="check" size={14} color={colors.white} />
            ) : null}
          </View>
          <View style={styles.confirmCopy}>
            <Text style={styles.confirmText}>
              I confirm this package has no cash, alcohol, liquids, fragile
              glass or anything illegal.{' '}
              <Text
                style={styles.confirmLink}
                onPress={() =>
                  showToast({type: 'info', message: 'Restricted items list'})
                }>
                See the full list
              </Text>
            </Text>
          </View>
        </Pressable>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {paddingBottom: Math.max(insets.bottom, 12)},
        ]}>
        <View style={styles.footerCopy}>
          <Text style={styles.footerMeta} numberOfLines={1}>
            {selectedType.label} · {selectedSize.title} · {selectedSize.weight}
          </Text>
          <Text style={styles.footerTitle}>{selectedSize.vehicle}</Text>
        </View>
        <Pressable
          style={[styles.pricesBtn, !confirmed && styles.pricesBtnDisabled]}
          disabled={!confirmed}
          onPress={() => navigation.navigate('PortalStep3')}
          accessibilityRole="button"
          accessibilityLabel="See prices">
          <Text style={styles.pricesText}>See prices</Text>
        </Pressable>
      </View>
    </View>
  );
}
