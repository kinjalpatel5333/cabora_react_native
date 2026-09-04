import React, {useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {images} from '../../assets';
import {Button} from '../../components';
import {useAppDispatch} from '../../redux/hooks';
import {completeWalkthrough} from '../../redux/slices/appSlice';
import styles from './style';

const {width} = Dimensions.get('window');

const SLIDES = [
  {
    key: 'welcome',
    image: images.walk1,
    kicker: 'WELCOME',
    title: 'Build faster',
    body: 'A ready React Native starter with auth, navigation, and a dummy API you can swap out.',
  },
  {
    key: 'navigate',
    image: images.walk2,
    kicker: 'NAVIGATION',
    title: 'Tabs and a sidebar',
    body: 'Move around with a bottom tab bar, or open the side menu from the header.',
  },
  {
    key: 'account',
    image: images.walk3,
    kicker: 'ACCOUNT',
    title: 'Your profile',
    body: 'Sign in, update settings, and keep a local session while you wire a real backend.',
  },
];

export default function WalkthroughScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const listRef = useRef(null);
  const [index, setIndex] = useState(0);
  const last = index === SLIDES.length - 1;

  const finish = () => dispatch(completeWalkthrough());

  const goNext = () => {
    if (last) {
      finish();
      return;
    }
    listRef.current?.scrollToIndex({index: index + 1, animated: true});
  };

  return (
    <View style={[styles.root, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
      <View style={styles.skipWrap}>
        <Pressable onPress={finish} hitSlop={12}>
          <Text style={styles.skip}>Skip</Text>
        </Pressable>
      </View>

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
          <View style={[styles.slide, {width}]}>
            <Image source={item.image} style={styles.image} resizeMode="contain" />
            <Text style={styles.kicker}>{item.kicker}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((slide, i) => (
            <View
              key={slide.key}
              style={[styles.dot, i === index && styles.dotActive]}
            />
          ))}
        </View>
        <Button title={last ? 'Get started' : 'Next'} onPress={goNext} />
      </View>
    </View>
  );
}
