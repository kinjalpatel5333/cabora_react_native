import { PASSENGER_WALKTHROUGH_SLIDES } from '../../config/staticData';
import React, {useMemo, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {images} from '../../assets';
import {Button} from '../../components';
import {useAppDispatch} from '../../redux/hooks';
import {completeWalkthrough} from '../../redux/slices/appSlice';
import useThemedStyles from '../../components/useThemedStyles';
import createStyles from './style';

const SLIDES = PASSENGER_WALKTHROUGH_SLIDES;

export default function WalkthroughScreen() {
  const insets = useSafeAreaInsets();
  const {width: windowWidth, height: windowHeight} = useWindowDimensions();
  const screen = Dimensions.get('screen');
  const styles = useThemedStyles(createStyles);
  const dispatch = useAppDispatch();
  const listRef = useRef(null);
  const [index, setIndex] = useState(0);
  const last = index === SLIDES.length - 1;

  // Full device screen — covers gesture/nav inset so no white strip shows under navy.
  const pageWidth = screen.width || windowWidth;
  const pageHeight = screen.height || windowHeight;

  const topPad = Math.max(insets.top, 12);
  // Thin bottom inset: CTA above home indicator, minimal dead space.
  const bottomPad = Math.max(insets.bottom, 8);
  const compact = pageHeight < 780;

  const metrics = useMemo(() => {
    const curveHeight = Math.min((96 / 390) * pageWidth, compact ? 64 : 96);
    return {
      curveHeight,
      heroTopPad: topPad + (compact ? 40 : 48),
      titleSize: compact ? 28 : 32,
      titleLine: compact ? 34 : 38,
      bodyMb: compact ? 14 : 22,
      badgeMb: compact ? 10 : 16,
      dotsMb: compact ? 12 : 16,
      panelPt: compact ? 4 : 8,
    };
  }, [pageWidth, compact, topPad]);

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
    <View style={[styles.root, {width: pageWidth, height: pageHeight}]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      {/* Navy under gesture bar — removes the thick white safe-area strip */}
      <View
        pointerEvents="none"
        style={[styles.bottomFill, {height: Math.max(insets.bottom, 20)}]}
      />
      <FlatList
        ref={listRef}
        style={styles.list}
        data={SLIDES}
        keyExtractor={item => item.key}
        horizontal
        pagingEnabled
        bounces={false}
        overScrollMode="never"
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, i) => ({
          length: pageWidth,
          offset: pageWidth * i,
          index: i,
        })}
        onMomentumScrollEnd={event => {
          const next = Math.round(
            event.nativeEvent.contentOffset.x / pageWidth,
          );
          setIndex(next);
        }}
        renderItem={({item}) => (
          <View style={[styles.page, {width: pageWidth, height: pageHeight}]}>
            <View style={[styles.hero, {paddingTop: metrics.heroTopPad}]}>
              <View
                style={[
                  styles.heroFill,
                  item.contain && styles.heroFillPay,
                  item.contain && {
                    paddingBottom: metrics.curveHeight * 0.35,
                  },
                ]}>
                {renderHero(item)}
              </View>
              <Image
                source={item.curve}
                style={[styles.wave, {height: metrics.curveHeight}]}
                resizeMode="stretch"
              />
            </View>

            <View
              style={[
                styles.panel,
                {paddingTop: metrics.panelPt, paddingBottom: bottomPad},
              ]}>
              <View style={[styles.badge, {marginBottom: metrics.badgeMb}]}>
                <View style={styles.badgeDot} />
                <Text style={styles.badgeLabel}>{item.kicker}</Text>
              </View>
              <Text
                style={[
                  styles.title,
                  {
                    fontSize: metrics.titleSize,
                    lineHeight: metrics.titleLine,
                  },
                ]}>
                {item.title}
              </Text>
              <Text style={[styles.body, {marginBottom: metrics.bodyMb}]}>
                {item.body}
              </Text>
              <View style={[styles.dots, {marginBottom: metrics.dotsMb}]}>
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

      <View pointerEvents="box-none" style={[styles.header, {top: topPad}]}>
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
