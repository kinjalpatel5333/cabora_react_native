import React, {useState} from 'react';
import {Alert, Image, Text, View} from 'react-native';
import {images} from '../../assets';
import {Button, Input, Screen} from '../../components';
import {DEMO_CREDENTIALS} from '../../config/setting';
import {useAppDispatch} from '../../redux/hooks';
import {loginUser} from '../../redux/slices/authSlice';
import {isValidEmail, isValidPassword} from '../../utils/validators';
import styles from './style';

export default function LoginScreen({navigation}) {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState(DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.password);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    const nextErrors = {};
    if (!isValidEmail(email)) {
      nextErrors.email = 'Enter a valid email';
    }
    if (!isValidPassword(password)) {
      nextErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      return;
    }

    setLoading(true);
    const result = await dispatch(loginUser({email: email.trim(), password}));
    setLoading(false);
    if (loginUser.rejected.match(result)) {
      Alert.alert('Login failed', result.payload || 'Try again');
    }
  };

  return (
    <Screen>
      <View style={styles.hero}>
        <Image source={images.logo} style={styles.logo} />
        <Text style={styles.kicker}>CABORA</Text>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          Sign in to continue. Auth is local for now — no API is called.
        </Text>
      </View>

      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@email.com"
        keyboardType="email-address"
        error={errors.email}
      />
      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        secureTextEntry
        error={errors.password}
      />

      <Button title="Log in" onPress={onSubmit} loading={loading} />


      <View style={styles.footer}>
        <Text style={styles.footerText}>New here?</Text>
        <Text
          style={styles.link}
          onPress={() => navigation.navigate('Signup')}>
          {' '}Create an account
        </Text>
      </View>
    </Screen>
  );
}
