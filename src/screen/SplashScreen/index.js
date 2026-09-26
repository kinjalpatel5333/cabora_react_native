import React, {useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, Image, ImageBackground, Linking, Text, useWindowDimensions, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {images} from '../../assets';
import {AppStatusModal} from '../../components';
import {APP_MARKET, APP_VERSION, STORE_URL} from '../../config/setting';
import useThemedStyles from '../../components/useThemedStyles';
import {bottomSafePad} from '../../utils/safeArea';
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
  const {width: windowWidth, height: windowHeight} = useWindowDimensions();
  const screen = Dimensions.get('screen');
  const styles = useThemedStyles(createStyles);
  const status = statusProp || statusFromFlags();
  const progress = useRef(new Animated.Value(0.12)).current;

  // Full device screen — covers gesture/nav inset so white strip doesn't show under navy.
  const pageWidth = screen.width || windowWidth;
  const pageHeight = screen.height || windowHeight;

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

  const [actionLoading, setActionLoading] = useState(false);

  const onAction = async () => {
    if (actionLoading) {
      return;
    }
    setActionLoading(true);
    try {
      if (status === 'offline') {
        await onRetry?.();
        return;
      }
      if (status === 'maintenance') {
        await onCheckAgain?.();
        return;
      }
      await Linking.openURL(STORE_URL).catch(() => onRetry?.());
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <ImageBackground
      source={images.splashGradient}
      resizeMode="cover"
      style={[styles.root, {width: pageWidth, height: pageHeight}]}>
      {/* Dark under gesture bar — removes the thick white safe-area strip */}
      <View
        pointerEvents="none"
        style={[styles.bottomFill, {height: Math.max(insets.bottom, 24)}]}
      />
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top,
            paddingBottom: bottomSafePad(insets),
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
          ) : (
            <AppStatusModal
              isModal={false}
              type={status}
              onAction={onAction}
              loading={actionLoading}
              style={{marginBottom: 24}}
            />
          )}
          <Text style={styles.version}>
            v {APP_VERSION} · {APP_MARKET}
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}
