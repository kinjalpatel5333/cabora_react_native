import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, RefreshControl, ScrollView, Text, TextInput, View, TouchableOpacity} from 'react-native';
import {useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useToast} from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import {deleteSavedAddressApi, getSavedAddressesApi} from '../../services/userApi';
import createStyles from './style';

function mapAddressToPlace(item) {
  const type = (item.type || item.tag || item.title || item.name || item.label || '').toLowerCase();
  let icon = 'map-pin';
  let tone = 'gray';
  let section = item.isPinned || item.pinned || type === 'home' || type === 'work' ? 'pinned' : 'other';

  if (type.includes('home')) {
    icon = 'home';
    tone = 'orange';
    section = 'pinned';
  } else if (type.includes('work') || type.includes('office')) {
    icon = 'briefcase';
    tone = 'orange';
    section = 'pinned';
  } else if (type.includes('gym') || type.includes('fitness')) {
    icon = 'activity';
  } else if (type.includes('fav') || type.includes('star')) {
    icon = 'star';
  }

  return {
    id: item._id || item.id || `addr_${Math.random()}`,
    name: item.name || item.title || item.label || (type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Saved Place'),
    address: item.address || item.formattedAddress || item.street || item.location?.address || item.fullAddress || '',
    landmark: item.landmark || '',
    tag: item.tag || item.type || item.label || '',
    section: item.section || section,
    icon: item.icon || icon,
    tone: item.tone || tone,
    raw: item,
  };
}

export default function SavedPlacesScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const navigation = useNavigation();
  const route = useRoute();
  const {showToast} = useToast();
  const [query, setQuery] = useState('');
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchAddresses = useCallback(async (isPull = false) => {
    try {
      if (isPull) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const res = await getSavedAddressesApi();
      const rawList =
        (Array.isArray(res?.data?.addresses) && res.data.addresses) ||
        (Array.isArray(res?.data?.data) && res.data.data) ||
        (Array.isArray(res?.data) && res.data) ||
        (Array.isArray(res?.addresses) && res.addresses) ||
        (Array.isArray(res) && res) ||
        [];
      const mapped = rawList.map(mapAddressToPlace);
      setPlaces(mapped);
    } catch (err) {
      console.warn('Failed to fetch addresses:', err);
      setPlaces([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [fetchAddresses]),
  );

  const onRefresh = () => {
    fetchAddresses(true);
  };

  useEffect(() => {
    const action = route.params?.placeAction;
    if (!action) {
      return;
    }

    if (action.type === 'delete' && action.placeId) {
      setPlaces(prev =>
        prev.filter(
          p => p.id !== action.placeId && p.raw?._id !== action.placeId,
        ),
      );
    } else if (action.place) {
      setPlaces(prev => {
        const idx = prev.findIndex(p => p.id === action.place.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = {...next[idx], ...action.place};
          return next;
        }
        return [action.place, ...prev];
      });
    }

    navigation.setParams({placeAction: undefined});
  }, [navigation, route.params?.placeAction]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return places;
    }
    return places.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        (p.tag && p.tag.toLowerCase().includes(q)),
    );
  }, [places, query]);

  const pinned = filtered.filter(p => p.section === 'pinned');
  const other = filtered.filter(p => p.section === 'other');

  const onDelete = async place => {
    const targetId = place?.raw?._id || place?.raw?.id || place?.id;
    if (!targetId || deletingId) {
      return;
    }
    try {
      setDeletingId(place.id);
      await deleteSavedAddressApi(targetId);
      setPlaces(prev =>
        prev.filter(p => p.id !== place.id && p.raw?._id !== targetId),
      );
      showToast({type: 'success', message: 'Place removed successfully'});
    } catch (err) {
      console.warn('Failed to delete address:', err);
      showToast({
        type: 'error',
        message: err?.message || 'Failed to remove place',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const openSave = (mode, place) => {
    navigation.navigate('SaveThisPlace', {mode, place});
  };

  const renderPlace = place => {
    const iconBg =
      place.tone === 'orange' ? colors.orange[100] : colors.gray[100];
    const iconColor =
      place.tone === 'orange' ? colors.orange[600] : colors.navy[700];
    const description = place.landmark
      ? `${place.landmark} · ${place.address}`
      : place.address;
    const isDeleting = deletingId === place.id;

    return (
      <View key={place.id} style={styles.placeCard}>
        <View style={[styles.placeIcon, {backgroundColor: iconBg}]}>
          <Feather name={place.icon} size={18} color={iconColor} />
        </View>
        <View style={styles.placeCopy}>
          <View style={styles.placeTitleRow}>
            <Text style={styles.placeName} numberOfLines={1}>
              {place.name}
            </Text>
            {place.tag ? (
              <View style={styles.tagPill}>
                <Text style={styles.tagText}>{place.tag}</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.placeAddress} numberOfLines={2}>
            {description}
          </Text>
        </View>
        <TouchableOpacity activeOpacity={0.7}
          style={styles.actionBtn}
          onPress={() => openSave('edit', place)}
          hitSlop={8}
          disabled={isDeleting}
          accessibilityRole="button"
          accessibilityLabel={`Edit ${place.name}`}>
          <Feather name="edit-2" size={16} color={colors.gray[500]} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7}
          style={styles.actionBtn}
          onPress={() => onDelete(place)}
          hitSlop={8}
          disabled={isDeleting}
          accessibilityRole="button"
          accessibilityLabel={`Delete ${place.name}`}>
          {isDeleting ? (
            <ActivityIndicator size="small" color={colors.red[500]} />
          ) : (
            <Feather name="trash-2" size={16} color={colors.red[500]} />
          )}
        </TouchableOpacity>
      </View>
    );
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
        <Text style={styles.headerTitle}>Saved places</Text>
        <View style={styles.headerBtn} />
      </View>

      <View style={styles.searchBox}>
        <Feather name="search" size={18} color={colors.muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search your saved places"
          placeholderTextColor={colors.muted}
          style={styles.searchInput}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={[
          styles.scroll,
          {paddingBottom: Math.max(insets.bottom, 12) + 90},
        ]}>
        {loading && !refreshing ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : (
          <>
            {pinned.length > 0 ? (
              <>
                <Text style={styles.sectionLabel}>PINNED</Text>
                <View style={styles.list}>{pinned.map(renderPlace)}</View>
              </>
            ) : null}

            {other.length > 0 ? (
              <>
                <Text
                  style={[
                    styles.sectionLabel,
                    pinned.length > 0 && styles.sectionSpaced,
                  ]}>
                  OTHER PLACES
                </Text>
                <View style={styles.list}>{other.map(renderPlace)}</View>
              </>
            ) : null}

            {filtered.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Feather name="map-pin" size={36} color={colors.muted} style={styles.emptyIcon} />
                <Text style={styles.emptyText}>
                  {query ? 'No places match your search' : 'No saved places yet'}
                </Text>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>

      <View
        style={[
          styles.footer,
          {paddingBottom: Math.max(insets.bottom, 12)},
        ]}>
        <TouchableOpacity activeOpacity={0.7}
          style={styles.addBtn}
          onPress={() => openSave('add')}
          accessibilityRole="button"
          accessibilityLabel="Add a place">
          <Text style={styles.addText}>Add a place</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
