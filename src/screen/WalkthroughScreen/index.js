import React, {useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {images} from '../../assets';
import {Button} from '../../components';
import {useAppDispatch} from '../../redux/hooks';
import {completeWalkthrough} from '../../redux/slices/appSlice';
import useThemedStyles from '../../components/useThemedStyles';
import createStyles from './style';

const {width} = Dimensions.get('window');
const CURVE_HEIGHT = (96 / 390) * width;

const SLIDES = [
  {
    key: 'booking',
    image: images.walkBooking,
    curve: images.walkCurveBooking,
    kicker: 'FAST BOOKING',
    title: 'Book a ride\nin three taps.',
    body: 'Set your drop, pick a vehicle, confirm. No forms, no waiting on hold.',
    action: 'Continue',
  },
  {
    key: 'tracking',
    image: images.walkTracking,
    curve: images.walkCurveTracking,
    kicker: 'LIVE TRACKING',
    title: 'See every metre\nof the way.',
    body: 'Live driver position, honest ETAs, and a link your family can follow.',
    action: 'Continue',
  },
  {
    key: 'payments',
    image: images.walkPayments,
    curve: images.walkCurvePayments,
    contain: true,
    kicker: 'SECURE PAYMENTS',
    title: 'Pay however\nsuits you.',
    body: 'UPI, cards, wallet or cash. Fares are locked before you book — no surprises.',
    action: 'Get started',
  },
];

export default function WalkthroughScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const dispatch = useAppDispatch();
  const listRef = useRef(null);
  const [index, setIndex] = useState(0);
  const last = index === SLIDES.length - 1;

  const finish = () => dispatch(completeWalkthrough());

  const goTo = next => {
    if (next === index || next < 0 || next >= SLIDES.length) {
      return;
    }
    setIndex(next);
    listRef.current?.scrollToIndex({index: next, animated: true});
  };

  const goNext = () => {
    if (last) {
      finish();
      return;
    }
    goTo(index + 1);
  };

  const renderHero = item => (
    <Image
      source={item.image}
      style={item.contain ? styles.payImage : styles.heroImage}
      resizeMode={item.contain ? 'contain' : 'cover'}
    />
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFD4AA" />
      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={item => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, i) => ({length: width, offset: width * i, index: i})}
        onMomentumScrollEnd={event => {
          const next = Math.round(event.nativeEvent.contentOffset.x / width);
          setIndex(next);
        }}
        renderItem={({item}) => (
          <View style={[styles.page, {width}]}>
            <View style={[styles.hero, {paddingTop: insets.top + 8}]}>
              <View
                style={[
                  styles.heroFill,
                  item.contain && styles.heroFillPay,
                  item.contain && {paddingBottom: CURVE_HEIGHT * 0.5},
                ]}>
                {renderHero(item)}
              </View>
              <Image
                source={item.curve}
                style={[styles.wave, {height: CURVE_HEIGHT}]}
                resizeMode="stretch"
              />
            </View>
            <View
              style={[
                styles.panel,
                {paddingBottom: Math.max(insets.bottom, 16)},
              ]}>
              <View style={styles.badge}>
                <View style={styles.badgeDot} />
                <Text style={styles.badgeLabel}>{item.kicker}</Text>
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body}>{item.body}</Text>
              <View style={styles.dots}>
                {SLIDES.map((slide, i) => (
                  <Pressable
                    key={slide.key}
                    hitSlop={12}
                    onPress={() => goTo(i)}
                    accessibilityRole="button"
                    accessibilityLabel={`Go to slide ${i + 1}`}>
                    <View
                      style={[styles.dot, i === index && styles.dotActive]}
                    />
                  </Pressable>
                ))}
              </View>
              <Button
                title={item.action}
                onPress={goNext}
                style={styles.cta}
              />
            </View>
          </View>
        )}
      />
      <View
        pointerEvents="box-none"
        style={[styles.header, {top: insets.top + 8}]}>
        <Image
          source={images.walkLogo}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="Cabora"
        />
        <Pressable onPress={finish} hitSlop={8} style={styles.skip}>
          <Text style={styles.skipLabel}>Skip</Text>
        </Pressable>
      </View>
    </View>
  );
}
