import React, {useState} from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {Lucide} from '@react-native-vector-icons/lucide/static';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useToast} from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import createStyles from './style';

const INITIAL_TODAY = [
  {
    id: '1',
    category: 'rides',
    title: 'Your ride is complete',
    subtitle: 'CBR-88214 · ₹428 paid from wallet',
    time: '18:52',
    unread: true,
    iconType: 'lucide',
    iconName: 'car',
    iconColor: '#FF7006',
    iconBg: '#FFF5ED',
  },
  {
    id: '2',
    category: 'safety',
    title: 'Safety check',
    subtitle: "We noticed a long stop. Tap to confirm you're okay.",
    time: '18:41',
    unread: true,
    iconType: 'mdi',
    iconName: 'alarm-light-outline',
    iconColor: '#EF4444',
    iconBg: '#FEECEC',
  },
  {
    id: '3',
    category: 'offers',
    title: '₹75 cashback credited',
    subtitle: 'From code RIDE30 on your last trip',
    time: '14:20',
    unread: false,
    iconType: 'mdi',
    iconName: 'gift-outline',
    iconColor: '#F59E0B',
    iconBg: '#FFF9EB',
  },
];

const INITIAL_EARLIER = [
  {
    id: '4',
    category: 'offers',
    title: '40% off with MONSOON40',
    subtitle: 'Valid on Comfort rides until 30 Sep',
    time: 'Yesterday',
    unread: false,
    iconType: 'feather',
    iconName: 'percent',
    iconColor: '#FF7006',
    iconBg: '#FFF5ED',
  },
  {
    id: '5',
    category: 'safety',
    title: 'Trusted contact added',
    subtitle: 'Priya Sharma can now see your live trips',
    time: 'Yesterday',
    unread: false,
    iconType: 'mdi',
    iconName: 'shield-check-outline',
    iconColor: '#10B981',
    iconBg: '#ECFDF5',
  },
  {
    id: '6',
    category: 'rides',
    title: 'September invoice ready',
    subtitle: 'Zenith Labs · ₹2,74,924 · due 16 Oct',
    time: '09 Sep',
    unread: false,
    iconType: 'mdi',
    iconName: 'file-document-outline',
    iconColor: '#3B82F6',
    iconBg: '#EFF6FF',
  },
  {
    id: '7',
    category: 'rides',
    title: 'Rohit joined your ride',
    subtitle: 'He was added as a co-rider on CBR-87990',
    time: '08 Sep',
    unread: false,
    iconType: 'feather',
    iconName: 'users',
    iconColor: '#3B82F6',
    iconBg: '#EFF6FF',
  },
];

const CATEGORIES = [
  {id: 'all', label: 'All 12'},
  {id: 'rides', label: 'Rides'},
  {id: 'offers', label: 'Offers'},
  {id: 'safety', label: 'Safety'},
];

function NotificationIcon({type, name, color}) {
  if (type === 'lucide') {
    return <Lucide name={name} size={20} color={color} />;
  }
  if (type === 'mdi') {
    return <MaterialDesignIcons name={name} size={22} color={color} />;
  }
  return <Feather name={name} size={20} color={color} />;
}

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const navigation = useNavigation();
  const {showToast} = useToast();

  const [activeCategory, setActiveCategory] = useState('all');
  const [todayList, setTodayList] = useState(INITIAL_TODAY);
  const [earlierList, setEarlierList] = useState(INITIAL_EARLIER);

  const markAllRead = () => {
    setTodayList(prev => prev.map(item => ({...item, unread: false})));
    setEarlierList(prev => prev.map(item => ({...item, unread: false})));
    showToast({type: 'info', message: 'All notifications marked as read'});
  };

  const handleCardPress = item => {
    if (item.unread) {
      setTodayList(prev =>
        prev.map(n => (n.id === item.id ? {...n, unread: false} : n)),
      );
      setEarlierList(prev =>
        prev.map(n => (n.id === item.id ? {...n, unread: false} : n)),
      );
    }
    if (item.category === 'safety') {
      navigation.navigate('Safety');
    } else {
      showToast({type: 'info', message: item.title});
    }
  };

  const filteredToday =
    activeCategory === 'all'
      ? todayList
      : todayList.filter(item => item.category === activeCategory);

  const filteredEarlier =
    activeCategory === 'all'
      ? earlierList
      : earlierList.filter(item => item.category === activeCategory);

  const hasItems = filteredToday.length > 0 || filteredEarlier.length > 0;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F6FA" />

      {/* Header */}
      <View style={[styles.headerRow, {paddingTop: Math.max(insets.top, 20) + 8}]}>
        <View style={styles.headerLeft}>
          <Pressable
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={8}>
            <Feather name="arrow-left" size={20} color="#0F2840" />
          </Pressable>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>

        <Pressable
          style={styles.markAllBtn}
          onPress={markAllRead}
          accessibilityRole="button"
          accessibilityLabel="Mark all read"
          hitSlop={8}>
          <Text style={styles.markAllText}>Mark all read</Text>
        </Pressable>
      </View>

      {/* Filter Tabs */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsScroll}>
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <Pressable
                key={cat.id}
                style={[styles.pill, isActive && styles.pillActive]}
                onPress={() => setActiveCategory(cat.id)}
                accessibilityRole="button"
                accessibilityLabel={cat.label}>
                <Text
                  style={[styles.pillText, isActive && styles.pillTextActive]}>
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Notifications List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {paddingBottom: Math.max(insets.bottom, 16) + 30},
        ]}>
        {filteredToday.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>TODAY</Text>
            {filteredToday.map(item => (
              <Pressable
                key={item.id}
                style={[styles.card, item.unread && styles.cardUnread]}
                onPress={() => handleCardPress(item)}
                accessibilityRole="button"
                accessibilityLabel={item.title}>
                <View
                  style={[styles.iconBox, {backgroundColor: item.iconBg}]}>
                  <NotificationIcon
                    type={item.iconType}
                    name={item.iconName}
                    color={item.iconColor}
                  />
                </View>
                <View style={styles.cardBody}>
                  <View style={styles.titleRow}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemTime}>{item.time}</Text>
                  </View>
                  <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {filteredEarlier.length > 0 && (
          <View>
            <Text
              style={[
                styles.sectionTitle,
                filteredToday.length > 0 && styles.sectionTitleLater,
              ]}>
              EARLIER THIS WEEK
            </Text>
            {filteredEarlier.map(item => (
              <Pressable
                key={item.id}
                style={[styles.card, item.unread && styles.cardUnread]}
                onPress={() => handleCardPress(item)}
                accessibilityRole="button"
                accessibilityLabel={item.title}>
                <View
                  style={[styles.iconBox, {backgroundColor: item.iconBg}]}>
                  <NotificationIcon
                    type={item.iconType}
                    name={item.iconName}
                    color={item.iconColor}
                  />
                </View>
                <View style={styles.cardBody}>
                  <View style={styles.titleRow}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemTime}>{item.time}</Text>
                  </View>
                  <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {!hasItems && (
          <View style={styles.emptyBox}>
            <Feather name="bell-off" size={40} color="#CBD5E1" />
            <Text style={styles.emptyText}>No notifications found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
