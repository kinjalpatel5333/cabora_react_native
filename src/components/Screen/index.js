import React from 'react';
import {Keyboard, KeyboardAvoidingView, Platform, ScrollView, View, TouchableOpacity} from 'react-native';
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
          <TouchableOpacity activeOpacity={0.7} style={styles.grow} onPress={Keyboard.dismiss}>
            {content}
          </TouchableOpacity>
        </ScrollView>
      ) : (
        content
      )}
    </KeyboardAvoidingView>
  );
}
