import React from 'react';
import {Alert, Image, Text, View} from 'react-native';
import {images} from '../../assets';
import {Button, Screen} from '../../components';
import {useAuth} from '../../hooks/useAuth';
import styles from './style';

function Row({label, value, last}) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const {user} = useAuth();

  return (
    <Screen>
      <View style={styles.hero}>
        <Image source={images.avatar} style={styles.avatar} />
        <Text style={styles.kicker}>PROFILE</Text>
        <Text style={styles.name}>{user?.name || 'Demo user'}</Text>
        <Text style={styles.email}>{user?.email || 'you@email.com'}</Text>
      </View>

      <View style={styles.card}>
        <Row label="Name" value={user?.name || 'Demo user'} />
        <Row label="Email" value={user?.email || 'you@email.com'} />
        <Row label="Member since" value="Demo session" last />
      </View>

      <Button
        title="Edit profile"
        variant="outline"
        onPress={() =>
          Alert.alert('Demo', 'Replace this with your edit-profile flow.')
        }
      />
    </Screen>
  );
}
