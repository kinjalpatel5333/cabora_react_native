import { PASSENGER_NOTIFICATIONS_TODAY, PASSENGER_NOTIFICATIONS_EARLIER, PASSENGER_NOTIFICATIONS_CATEGORIES } from '../../config/staticData';
import React, {useState} from 'react';
import {ScrollView, Text, View, TouchableOpacity} from 'react-native';
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

const INITIAL_TODAY = PASSENGER_NOTIFICATIONS_TODAY;

const INITIAL_EARLIER = PASSENGER_NOTIFICATIONS_EARLIER;

const CATEGORIES = PASSENGER_NOTIFICATIONS_CATEGORIES;

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
  const {colors} = useApp();
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

      {/* Header */}
      <View style={[styles.headerRow, {paddingTop: Math.max(insets.top, 20) + 8}]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity activeOpacity={0.7}
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={8}>
            <Feather name="arrow-left" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>

        <TouchableOpacity activeOpacity={0.7}
          style={styles.markAllBtn}
          onPress={markAllRead}
          accessibilityRole="button"
          accessibilityLabel="Mark all read"
          hitSlop={8}>
          <Text style={styles.markAllText}>Mark all read</Text>
        </TouchableOpacity>
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
              <TouchableOpacity activeOpacity={0.7}
                key={cat.id}
                style={[styles.pill, isActive && styles.pillActive]}
                onPress={() => setActiveCategory(cat.id)}
                accessibilityRole="button"
                accessibilityLabel={cat.label}>
                <Text
                  style={[styles.pillText, isActive && styles.pillTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
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
              <TouchableOpacity activeOpacity={0.7}
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
              </TouchableOpacity>
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
              <TouchableOpacity activeOpacity={0.7}
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
              </TouchableOpacity>
            ))}
          </View>
        )}

        {!hasItems && (
          <View style={styles.emptyBox}>
            <Feather name="bell-off" size={40} color={colors.slate[300]} />
            <Text style={styles.emptyText}>No notifications found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
