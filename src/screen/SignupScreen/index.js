import React, {useState} from 'react';
import {Alert, Image, Text, View} from 'react-native';
import {images} from '../../assets';
import {Button, Input, Screen} from '../../components';
import {useAppDispatch} from '../../redux/hooks';
import {signupUser} from '../../redux/slices/authSlice';
import {isValidEmail, isValidPassword} from '../../utils/validators';
import styles from './style';

export default function SignupScreen({navigation}) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    const nextErrors = {};
    if (!name.trim()) {
      nextErrors.name = 'Name is required';
    }
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
    try {
      const result = await dispatch(
        signupUser({name: name.trim(), email: email.trim(), password}),
      );
      if (signupUser.rejected.match(result)) {
        const errorMsg =
          typeof result.payload === 'string'
            ? result.payload
            : result.error?.message || 'Try again';
        Alert.alert('Sign up failed', errorMsg);
      }
    } catch (err) {
      Alert.alert('Sign up failed', err?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={styles.hero}>
        <Image source={images.logo} style={styles.logo} />
        <Text style={styles.kicker}>CABORA</Text>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>
          Sign up stores a local session. No API is called.
        </Text>
      </View>

      <Input
        label="Name"
        value={name}
        onChangeText={setName}
        placeholder="Your name"
        autoCapitalize="words"
        error={errors.name}
      />
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

      <Button title="Sign up" onPress={onSubmit} loading={loading} />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <Text
          style={styles.link}
          onPress={() => navigation.navigate('Login')}>
          {' '}Log in
        </Text>
      </View>
    </Screen>
  );
}
