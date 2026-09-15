import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Linking,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {images} from '../../assets';
import {Button} from '../../components';
import {APP_MARKET, APP_VERSION, STORE_URL} from '../../config/setting';
import useThemedStyles from '../../components/useThemedStyles';
import createStyles from './style';

/** Default is loading. Set one other flag to true to show that screen. */
const SHOW_LOADING = true;
const SHOW_NO_INTERNET = false;
const SHOW_UPDATE = false;
const SHOW_MAINTENANCE = false;

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const FIGMA_FRAME = 390;
const FIGMA_GLOW_WIDTH = 390;
const FIGMA_GLOW_HEIGHT = 520;
const SCALE = SCREEN_WIDTH / FIGMA_FRAME;
const GLOW_WIDTH = FIGMA_GLOW_WIDTH * SCALE;
const GLOW_HEIGHT = FIGMA_GLOW_HEIGHT * SCALE;
const RING_SIZE = 128 * SCALE;
const ICON_SIZE = 82 * SCALE;
const CARD_WIDTH = 326 * SCALE;
const CARD_RADIUS = 24 * SCALE;
const CARD_PAD_TOP = 28 * SCALE;
const CARD_PAD_X = 22 * SCALE;
const CARD_PAD_BOTTOM = 24 * SCALE;
const CARD_ICON_SIZE = 56 * SCALE;
const CARD_BTN_HEIGHT = 52 * SCALE;
const CARD_BTN_RADIUS = 16 * SCALE;

const COPY = {
  offline: {
    image: images.splashNoInternet,
    title: 'No internet connection',
    body: 'Cabora needs a connection to find drivers near you. Check Wi-Fi or mobile data and try again.',
    action: 'Retry',
    variant: 'primary',
  },
  update: {
    image: images.splashRefresh,
    title: 'Update Cabora to continue',
    body: 'This version is no longer supported. Version 2.1 adds live trip recovery and faster pickups.',
    action: 'Update now',
    variant: 'primary',
  },
  maintenance: {
    image: images.splashSetting,
    title: "We'll be right back",
    body: 'Cabora is under scheduled maintenance until 03:30 IST. Any trip in progress is safe and will resume.',
    action: 'Check again',
    variant: 'inverse',
  },
};

function statusFromFlags() {
  if (SHOW_NO_INTERNET) {
    return 'offline';
  }
  if (SHOW_UPDATE) {
    return 'update';
  }
  if (SHOW_MAINTENANCE) {
    return 'maintenance';
  }
  if (SHOW_LOADING) {
    return 'loading';
  }
  return 'loading';
}

export default function SplashScreen({
  status: statusProp,
  onRetry,
  onCheckAgain,
}) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const status = statusProp || statusFromFlags();
  const progress = useRef(new Animated.Value(0.12)).current;
  const copy = COPY[status];

  useEffect(() => {
    if (status !== 'loading') {
      progress.setValue(1);
      return undefined;
    }
    progress.setValue(0.12);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 0.86,
          duration: 1400,
          useNativeDriver: false,
        }),
        Animated.timing(progress, {
          toValue: 0.22,
          duration: 700,
          useNativeDriver: false,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [progress, status]);

  const fillWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const onAction = () => {
    if (status === 'offline') {
      onRetry?.();
      return;
    }
    if (status === 'maintenance') {
      onCheckAgain?.();
      return;
    }
    Linking.openURL(STORE_URL).catch(() => onRetry?.());
  };

  return (
    <ImageBackground
      source={images.splashGradient}
      resizeMode="cover"
      style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#08101E" />
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top,
            paddingBottom: Math.max(insets.bottom, 20),
          },
        ]}>
        <View
          style={[styles.brand, status === 'loading' && styles.brandLoading]}>
          <View
            style={[styles.logoStage, {width: RING_SIZE, height: RING_SIZE}]}>
            <Image
              source={images.brandGlow}
              pointerEvents="none"
              resizeMode="contain"
              style={[
                styles.glow,
                {
                  width: GLOW_WIDTH,
                  height: GLOW_HEIGHT,
                  top: (RING_SIZE - GLOW_HEIGHT) / 2,
                  left: (RING_SIZE - GLOW_WIDTH) / 2,
                },
              ]}
            />
            <View
              style={[
                styles.logoRing,
                {
                  width: RING_SIZE,
                  height: RING_SIZE,
                  borderRadius: RING_SIZE / 2,
                },
              ]}>
              <View
                style={[
                  styles.logoClip,
                  {
                    width: ICON_SIZE,
                    height: ICON_SIZE,
                    borderRadius: ICON_SIZE * 0.22,
                  },
                ]}>
                <Image
                  source={images.cabOraMark}
                  style={{width: ICON_SIZE, height: ICON_SIZE}}
                  resizeMode="cover"
                  accessibilityLabel="Cabora"
                />
              </View>
            </View>
          </View>
          <Text style={styles.title}>Cabora</Text>
          <Text style={styles.tagline}>Move through your city.</Text>
        </View>

        <View style={styles.footer}>
          {status === 'loading' ? (
            <View style={styles.loadingBlock}>
              <View style={styles.track}>
                <Animated.View style={[styles.fill, {width: fillWidth}]} />
              </View>
              <Text style={styles.finding}>Finding your city...</Text>
            </View>
          ) : copy ? (
            <View
              style={[
                styles.card,
                {
                  width: CARD_WIDTH,
                  borderRadius: CARD_RADIUS,
                  paddingTop: CARD_PAD_TOP,
                  paddingRight: CARD_PAD_X,
                  paddingBottom: CARD_PAD_BOTTOM,
                  paddingLeft: CARD_PAD_X,
                },
              ]}>
              <Image
                source={copy.image}
                style={[
                  styles.cardIcon,
                  {width: CARD_ICON_SIZE, height: CARD_ICON_SIZE},
                ]}
                resizeMode="contain"
              />
              <Text style={styles.cardTitle}>{copy.title}</Text>
              <Text style={styles.cardBody}>{copy.body}</Text>
              <Button
                title={copy.action}
                variant={copy.variant}
                onPress={onAction}
                style={[
                  styles.cardButton,
                  copy.variant === 'primary' && styles.cardButtonPrimary,
                  copy.variant === 'inverse' && styles.cardButtonInverse,
                  {
                    minHeight: CARD_BTN_HEIGHT,
                    height: CARD_BTN_HEIGHT,
                    borderRadius: CARD_BTN_RADIUS,
                  },
                ]}
              />
            </View>
          ) : null}
          <Text style={styles.version}>
            v{APP_VERSION} · {APP_MARKET}
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}
