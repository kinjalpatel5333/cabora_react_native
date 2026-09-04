import React from 'react';
import {Image, Text, View} from 'react-native';
import {images} from '../../assets';
import {Screen} from '../../components';
import {useAuth} from '../../hooks/useAuth';
import styles from './style';

export default function HomeScreen() {
  const {user} = useAuth();

  return (
    <Screen>
      <View style={styles.card}>
        <Image source={images.avatar} style={styles.avatar} />
        <Text style={styles.kicker}>HOME</Text>
        <Text style={styles.title}>Hello, {user?.name || 'there'}</Text>
        <Text style={styles.body}>
          Open the side menu from the header, or use the tab bar to reach
          Profile and Settings.
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>
      <Image
        source={images.empty}
        style={styles.empty}
        resizeMode="contain"
      />
    </Screen>
  );
}
