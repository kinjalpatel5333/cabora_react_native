import React, {useState} from 'react';
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
import createStyles from './style';

const TOPICS = [
  {id: 'fares', title: 'Fares & payments', iconType: 'text', icon: '₹'},
  {id: 'safety', title: 'Safety', iconType: 'feather', icon: 'shield'},
  {id: 'lost', title: 'Lost an item', iconType: 'feather', icon: 'shopping-bag'},
  {id: 'account', title: 'Account & profile', iconType: 'feather', icon: 'user'},
  {id: 'driver', title: 'Driver behaviour', iconType: 'lucide', icon: 'car'},
  {id: 'offers', title: 'Offers & referrals', iconType: 'feather', icon: 'gift'},
];

const FAQS = [
  {id: 'cancel', question: 'Why was I charged a cancellation fee?'},
  {id: 'surge', question: 'How do surge prices work?'},
];

function TopicIcon({item, styles}) {
  if (item.iconType === 'text') {
    return <Text style={styles.currencyText}>{item.icon}</Text>;
  }
  if (item.iconType === 'lucide') {
    return <Lucide name={item.icon} size={18} color="#0F2840" />;
  }
  return <Feather name={item.icon} size={18} color="#0F2840" />;
}

export default function HelpScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const navigation = useNavigation();
  const {showToast} = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const onTopicPress = topic => {
    if (topic.id === 'safety') {
      navigation.navigate('Safety');
      return;
    }
    showToast({type: 'info', message: `Help for ${topic.title}`});
  };

  const onFaqPress = faq => {
    showToast({type: 'info', message: faq.question});
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={[styles.header, {paddingTop: insets.top + 4}]}>
        <Pressable
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}>
          <Feather name="arrow-left" size={22} color="#0F2840" />
        </Pressable>
        <Text style={styles.headerTitle}>Help</Text>
        <Pressable
          style={styles.headerBtn}
          onPress={() =>
            showToast({type: 'info', message: 'Help center information'})
          }
          accessibilityRole="button"
          accessibilityLabel="Help info"
          hitSlop={8}>
          <Feather name="help-circle" size={22} color="#0F2840" />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {paddingBottom: Math.max(insets.bottom, 16) + 20},
        ]}>
        <View style={styles.searchBox}>
          <Feather name="search" size={18} color="#8A96A6" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search help topics"
            placeholderTextColor="#8A96A6"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <Pressable
          style={styles.lastTripCard}
          onPress={() => navigation.navigate('ReportIssue')}
          accessibilityRole="button"
          accessibilityLabel="Get help with your last trip">
          <View style={styles.lastTripIcon}>
            <Lucide name="car" size={20} color="#FF7006" />
          </View>
          <View style={styles.lastTripBody}>
            <Text style={styles.lastTripTitle}>
              Get help with your last trip
            </Text>
            <Text style={styles.lastTripSub}>
              Today 12:24 pm · Airport T2 · ₹241.50
            </Text>
          </View>
          <Feather name="chevron-right" size={20} color="#8EA3B7" />
        </Pressable>

        <Text style={styles.sectionLabel}>BROWSE BY TOPIC</Text>
        <View style={styles.topicsGrid}>
          {TOPICS.map(topic => (
            <Pressable
              key={topic.id}
              style={styles.topicCard}
              onPress={() => onTopicPress(topic)}
              accessibilityRole="button"
              accessibilityLabel={topic.title}>
              <View style={styles.topicIcon}>
                <TopicIcon item={topic} styles={styles} />
              </View>
              <Text style={styles.topicTitle}>{topic.title}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionLabel}>POPULAR QUESTIONS</Text>
        <View style={styles.faqCard}>
          {FAQS.map((faq, index) => (
            <Pressable
              key={faq.id}
              style={[
                styles.faqItem,
                index < FAQS.length - 1 && styles.faqItemBorder,
              ]}
              onPress={() => onFaqPress(faq)}
              accessibilityRole="button"
              accessibilityLabel={faq.question}>
              <Text style={styles.faqText}>{faq.question}</Text>
              <Feather name="chevron-right" size={18} color="#8A96A6" />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View
        style={[styles.footer, {paddingBottom: Math.max(insets.bottom, 12)}]}>
        <Pressable
          style={styles.chatBtn}
          onPress={() =>
            showToast({type: 'info', message: 'Connecting to support chat…'})
          }
          accessibilityRole="button"
          accessibilityLabel="Chat with support">
          <Text style={styles.chatBtnText}>Chat with support</Text>
        </Pressable>
      </View>
    </View>
  );
}
