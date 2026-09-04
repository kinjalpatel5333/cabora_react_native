import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import styles from './style';

export default function Screen({children, scroll = true}) {
  const insets = useSafeAreaInsets();
  const content = (
    <View style={[styles.inner, {paddingBottom: Math.max(insets.bottom, 24)}]}>
      {children}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {scroll ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={styles.grow}
          showsVerticalScrollIndicator={false}>
          <Pressable style={styles.grow} onPress={Keyboard.dismiss}>
            {content}
          </Pressable>
        </ScrollView>
      ) : (
        content
      )}
    </KeyboardAvoidingView>
  );
}
