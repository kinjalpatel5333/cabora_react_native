import {StyleSheet} from 'react-native';

export default function createThemedStyles(colors, factory) {
  return StyleSheet.create(factory(colors));
}
