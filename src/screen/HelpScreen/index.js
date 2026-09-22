import React, {useState} from 'react';
import {ScrollView, Text, TextInput, View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {Lucide} from '@react-native-vector-icons/lucide/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useToast} from '../../components/Toast';
import {
  PASSENGER_HELP_TOPICS as TOPICS,
  PASSENGER_HELP_FAQS as FAQS,
} from '../../config/staticData';
import {useApp} from '../../context/AppContext';
import useThemedStyles from '../../components/useThemedStyles';
import createStyles from './style';
import colors from '../../config/color';

function TopicIcon({item, styles, colors}) {
  if (item.iconType === 'text') {
    return <Text style={styles.currencyText}>{item.icon}</Text>;
  }
  if (item.iconType === 'lucide') {
    return <Lucide name={item.icon} size={18} color={colors.text} />;
  }
  return <Feather name={item.icon} size={18} color={colors.text} />;
}

export default function HelpScreen() {
  const insets = useSafeAreaInsets();
  const {colors} = useApp();
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
      <View style={[styles.header, {paddingTop: insets.top + 4}]}>
        <TouchableOpacity activeOpacity={0.7}
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help</Text>
        <TouchableOpacity activeOpacity={0.7}
          style={styles.headerBtn}
          onPress={() =>
            showToast({type: 'info', message: 'Help center information'})
          }
          accessibilityRole="button"
          accessibilityLabel="Help info"
          hitSlop={8}>
          <Feather name="help-circle" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {paddingBottom: Math.max(insets.bottom, 16) + 20},
        ]}>
        <View style={styles.searchBox}>
          <Feather name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search help topics"
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity activeOpacity={0.7}
          style={styles.lastTripCard}
          onPress={() => navigation.navigate('ReportIssue')}
          accessibilityRole="button"
          accessibilityLabel="Get help with your last trip">
          <View style={styles.lastTripIcon}>
            <Lucide name="car" size={20} color={colors.primary} />
          </View>
          <View style={styles.lastTripBody}>
            <Text style={styles.lastTripTitle}>
              Get help with your last trip
            </Text>
            <Text style={styles.lastTripSub}>
              Today 12:24 pm · Airport T2 · ₹241.50
            </Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>BROWSE BY TOPIC</Text>
        <View style={styles.topicsGrid}>
          {TOPICS.map(topic => (
            <TouchableOpacity activeOpacity={0.7}
              key={topic.id}
              style={styles.topicCard}
              onPress={() => onTopicPress(topic)}
              accessibilityRole="button"
              accessibilityLabel={topic.title}>
              <View style={styles.topicIcon}>
                <TopicIcon item={topic} styles={styles} colors={colors} />
              </View>
              <Text style={styles.topicTitle}>{topic.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>POPULAR QUESTIONS</Text>
        <View style={styles.faqCard}>
          {FAQS.map((faq, index) => (
            <TouchableOpacity activeOpacity={0.7}
              key={faq.id}
              style={[
                styles.faqItem,
                index < FAQS.length - 1 && styles.faqItemBorder,
              ]}
              onPress={() => onFaqPress(faq)}
              accessibilityRole="button"
              accessibilityLabel={faq.question}>
              <Text style={styles.faqText}>{faq.question}</Text>
              <Feather name="chevron-right" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View
        style={[styles.footer, {paddingBottom: Math.max(insets.bottom, 12)}]}>
        <TouchableOpacity activeOpacity={0.7}
          style={styles.chatBtn}
          onPress={() =>
            showToast({type: 'info', message: 'Connecting to support chat…'})
          }
          accessibilityRole="button"
          accessibilityLabel="Chat with support">
          <Text style={styles.chatBtnText}>Chat with support</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
