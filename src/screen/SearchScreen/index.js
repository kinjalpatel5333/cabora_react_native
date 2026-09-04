import React, {useState, useMemo} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {images} from '../../assets';
import {useSidebar} from '../../context/SidebarContext';
import styles from './style';

const ITEMS_LIST = [
  {
    id: '1',
    title: 'Gym & Fitness Transformation',
    category: 'Workout & Health',
    icon: '🏋️',
    color: '#4C1D95',
    tag: 'Fitness',
  },
  {
    id: '2',
    title: 'AI Productivity Tools 2026',
    category: 'Technology & Software',
    icon: '🤖',
    color: '#1E3A8A',
    tag: 'Tech',
  },
  {
    id: '3',
    title: 'Mobile App UI Design Figma',
    category: 'Design & Graphics',
    icon: '🎨',
    color: '#831843',
    tag: 'Design',
  },
  {
    id: '4',
    title: 'Personal Finance & Investing',
    category: 'Finance & Wealth',
    icon: '📈',
    color: '#064E3B',
    tag: 'Finance',
  },
  {
    id: '5',
    title: 'Healthy Meal Prep Routine',
    category: 'Nutrition & Diet',
    icon: '🥗',
    color: '#713F12',
    tag: 'Lifestyle',
  },
  {
    id: '6',
    title: 'React Native Cross-Platform Dev',
    category: 'Programming & Code',
    icon: '⚡',
    color: '#3B0764',
    tag: 'Development',
  },
  {
    id: '7',
    title: 'Travel & Photography Guide',
    category: 'Travel & Leisure',
    icon: '✈️',
    color: '#164E63',
    tag: 'Travel',
  },
  {
    id: '8',
    title: 'Daily Mindfulness & Yoga',
    category: 'Wellness & Health',
    icon: '🧘',
    color: '#701A75',
    tag: 'Wellness',
  },
];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const {openDrawer} = useSidebar();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return ITEMS_LIST;
    return ITEMS_LIST.filter(
      item =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.tag.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  return (
    <View style={styles.root}>
      {/* Top Header & Search Bar */}
      <View style={[styles.header, {paddingTop: Math.max(insets.top, 12)}]}>
        <View style={styles.headerTop}>
          <Pressable onPress={openDrawer} hitSlop={10} style={styles.menuBtn}>
            <Image source={images.iconMenu} style={styles.menuIcon} />
          </Pressable>
          <Text style={styles.headerTitle}>Search</Text>
          <View style={{width: 32}} />
        </View>

        {/* Normal Search Bar */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search items..."
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            autoCapitalize="none"
            returnKeyType="search"
            clearButtonMode="while-editing"
            style={styles.searchInput}
          />
          {searchQuery.length > 0 ? (
            <Pressable
              onPress={() => setSearchQuery('')}
              style={styles.clearBtn}
              hitSlop={8}>
              <Text style={styles.clearText}>✕</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Results Count */}
      <Text style={styles.countText}>
        {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
      </Text>

      {/* Simple Listing */}
      <FlatList
        data={filteredItems}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.list,
          {paddingBottom: insets.bottom + 20},
        ]}
        renderItem={({item}) => (
          <Pressable style={styles.listItem}>
            <View
              style={[
                styles.itemIconWrap,
                {backgroundColor: item.color || '#1E1B2E'},
              ]}>
              <Text style={styles.itemIconText}>{item.icon}</Text>
            </View>

            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemSubtitle}>{item.category}</Text>
            </View>

            <View style={styles.itemBadge}>
              <Text style={styles.itemBadgeText}>{item.tag}</Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No Results Found</Text>
            <Text style={styles.emptyText}>
              No items match "{searchQuery}".
            </Text>
          </View>
        }
      />
    </View>
  );
}
