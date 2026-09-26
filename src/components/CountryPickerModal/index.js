import React, { useMemo, useState } from 'react';
import { FlatList, Image, KeyboardAvoidingView, Modal, Platform, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { Feather } from '@react-native-vector-icons/feather/static';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { images } from '../../assets';
import { useApp } from '../../context/AppContext';
import { COUNTRIES } from '../../utils/countries';
import useThemedStyles from '../useThemedStyles';
import createStyles from './style';


export default function CountryPickerModal({
  visible,
  selectedCountry,
  onSelect,
  onClose,
}) {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const styles = useThemedStyles(createStyles);
  const [search, setSearch] = useState('');

  const filteredCountries = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return COUNTRIES;
    }
    return COUNTRIES.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.includes(q) ||
        c.code.toLowerCase().includes(q),
    );
  }, [search]);

  const handleSelect = country => {
    onSelect(country);
    setSearch('');
    onClose();
  };

  const handleClose = () => {
    setSearch('');
    onClose();
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedCountry?.code === item.code;
    return (
      <TouchableOpacity activeOpacity={0.7}
        accessibilityRole="button"
        onPress={() => handleSelect(item)}
        style={[styles.item, isSelected ? styles.itemSelected : null]}>
        {item.code === 'IN' ? (
          <Image
            source={images.indiaFlag}
            style={styles.flagImg}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.flagEmoji}>{item.flag}</Text>
        )}
        <Text
          style={[
            styles.countryName,
            isSelected ? styles.countryNameSelected : null,
          ]}
          numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.dialCode}>{item.dialCode}</Text>
        {isSelected ? (
          <Feather name="check" size={18} color={colors.primary} />
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}>
        <TouchableOpacity activeOpacity={0.7} style={{ flex: 1 }} onPress={handleClose} />
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <View style={styles.dragHandle} />
          <View style={styles.header}>
            <Text style={styles.title}>Select Country</Text>
            <TouchableOpacity activeOpacity={0.7}
              accessibilityRole="button"
              onPress={handleClose}
              style={styles.closeButton}>
              <Feather name="x" size={18} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Feather name="search" size={18} color={colors.muted} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search country or code..."
              placeholderTextColor={colors.muted}
              style={styles.searchInput}
              clearButtonMode="while-editing"
              autoCorrect={false}
            />
            {search ? (
              <TouchableOpacity activeOpacity={0.7} onPress={() => setSearch('')}>
                <Feather name="x-circle" size={16} color={colors.muted} />
              </TouchableOpacity>
            ) : null}
          </View>

          <FlatList
            data={filteredCountries}
            keyExtractor={item => item.code}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No countries found</Text>
              </View>
            }
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
