import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { authenticateOwner } from '@/lib/mock-owner-auth';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function OwnerLoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [activeField, setActiveField] = useState<'username' | 'password' | null>(null);

  const handleLogin = async () => {
    if (isSubmitting) {
      return;
    }

    setErrorText('');

    if (username.trim().length === 0) {
      setErrorText('Please enter your owner username.');
      return;
    }

    if (password.length < 4) {
      setErrorText('Password should have at least 4 characters.');
      return;
    }

    setIsSubmitting(true);
    await wait(650);

    const owner = authenticateOwner(username, password);

    if (owner === null) {
      setIsSubmitting(false);
      setErrorText('Invalid username or password.');
      return;
    }

    setIsSubmitting(false);
    Alert.alert('Login success', `Welcome ${owner.fullName} (${owner.businessName})`);
    router.replace('./(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundLayer}>
        <View style={[styles.blob, styles.blobOne]} />
        <View style={[styles.blob, styles.blobTwo]} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={styles.container}>
        <View style={styles.headerSection}>
          <View style={styles.logoFrame}>
            <Image source={require('@/assets/images/Swerise.png')} style={styles.logo} resizeMode="contain" />
          </View>
          <Text style={styles.badge}>OWNER PORTAL</Text>
          <Text style={styles.pageTitle}>Swerise Owner</Text>
          <Text style={styles.pageSubtitle}>
            Monitor all shops, sales, and staff in one place.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            style={[styles.input, activeField === 'username' && styles.inputActive]}
            placeholder="Enter owner username"
            placeholderTextColor="#9B8D73"
            value={username}
            onChangeText={setUsername}
            onFocus={() => setActiveField('username')}
            onBlur={() => setActiveField(null)}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            secureTextEntry
            style={[styles.input, activeField === 'password' && styles.inputActive]}
            placeholder="Enter password"
            placeholderTextColor="#9B8D73"
            value={password}
            onChangeText={setPassword}
            onFocus={() => setActiveField('password')}
            onBlur={() => setActiveField(null)}
          />

          {errorText.length > 0 && <Text style={styles.errorText}>{errorText}</Text>}

          <Pressable
            style={({ pressed }) => [styles.loginButton, (pressed || isSubmitting) && styles.loginButtonPressed]}
            onPress={handleLogin}
            disabled={isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </Pressable>

          <Text style={styles.helperText}>Demo credentials: `owner01` / `1234`</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E8F3EC',
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.8,
  },
  blobOne: {
    width: 280,
    height: 280,
    backgroundColor: '#CBEBD7',
    top: -90,
    left: -90,
  },
  blobTwo: {
    width: 300,
    height: 300,
    backgroundColor: '#B5DFC4',
    right: -100,
    bottom: -100,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 20,
  },
  headerSection: {
    alignItems: 'center',
    gap: 6,
  },
  logoFrame: {
    width: 112,
    height: 112,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#CFE5D6',
  },
  logo: {
    width: 84,
    height: 84,
  },
  badge: {
    color: '#1F7A4C',
    fontSize: 11,
    letterSpacing: 1.2,
    fontWeight: '800',
  },
  pageTitle: {
    color: '#0E3D2A',
    fontSize: 32,
    fontWeight: '800',
  },
  pageSubtitle: {
    color: '#3A634A',
    fontSize: 14.5,
    textAlign: 'center',
  },
  formCard: {
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D2E4D9',
    paddingHorizontal: 18,
    paddingVertical: 20,
    shadowColor: '#184B33',
    shadowOpacity: 0.14,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 4,
  },
  label: {
    color: '#13442F',
    fontWeight: '700',
    marginBottom: 7,
    marginTop: 8,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#C4D8CA',
    borderRadius: 14,
    backgroundColor: '#F9FCFA',
    color: '#123827',
    fontSize: 15,
    paddingHorizontal: 13,
    paddingVertical: 12,
  },
  inputActive: {
    borderColor: '#2E8B57',
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    color: '#A31919',
    marginTop: 12,
    fontSize: 13.5,
    fontWeight: '600',
  },
  loginButton: {
    marginTop: 18,
    borderRadius: 14,
    backgroundColor: '#1F7A4C',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  loginButtonPressed: {
    opacity: 0.9,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16.5,
    fontWeight: '800',
  },
  helperText: {
    color: '#567565',
    marginTop: 12,
    fontSize: 12.5,
    textAlign: 'center',
  },
});
