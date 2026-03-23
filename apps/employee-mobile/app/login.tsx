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

import { authenticateEmployee } from '@/lib/mock-auth';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function EmployeeLoginScreen() {
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
      setErrorText('Please enter your username.');
      return;
    }

    if (password.length < 4) {
      setErrorText('Password should have at least 4 characters.');
      return;
    }

    setIsSubmitting(true);
    await wait(650);

    const employee = authenticateEmployee(username, password);

    if (employee === null) {
      setIsSubmitting(false);
      setErrorText('Invalid username or password.');
      return;
    }

    setIsSubmitting(false);
    const message = `Welcome ${employee.fullName} (${employee.shopName})`;
    Alert.alert('Login success', message);
    router.replace('/(tabs)');
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
          <Text style={styles.pageTitle}>Welcome Back</Text>
          <Text style={styles.pageSubtitle}>Sign in to continue your shop operations.</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            style={[styles.input, activeField === 'username' && styles.inputActive]}
            placeholder="Enter your username"
            placeholderTextColor="#89A093"
            value={username}
            onChangeText={setUsername}
            onFocus={() => setActiveField('username')}
            onBlur={() => setActiveField(null)}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            secureTextEntry
            style={[styles.input, activeField === 'password' && styles.inputActive]}
            placeholder="Enter your password"
            placeholderTextColor="#89A093"
            value={password}
            onChangeText={setPassword}
            onFocus={() => setActiveField('password')}
            onBlur={() => setActiveField(null)}
          />

          {errorText.length > 0 && <Text style={styles.errorText}>{errorText}</Text>}

          <Pressable
            style={({ pressed }) => [
              styles.loginButton,
              (pressed || isSubmitting) && styles.loginButtonPressed,
            ]}
            onPress={handleLogin}
            disabled={isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </Pressable>

          <Text style={styles.helperText}>Use your assigned employee credentials to access your dashboard.</Text>
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
    width: 260,
    height: 260,
    backgroundColor: '#CBEBD7',
    top: -80,
    left: -70,
  },
  blobTwo: {
    width: 280,
    height: 280,
    backgroundColor: '#B5DFC4',
    right: -90,
    bottom: -90,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 20,
  },
  headerSection: {
    alignItems: 'center',
  },
  logoFrame: {
    width: 112,
    height: 112,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 12,
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
  pageTitle: {
    color: '#0E3D2A',
    fontSize: 31,
    fontWeight: '700',
    fontFamily: 'Georgia',
  },
  pageSubtitle: {
    color: '#3A634A',
    marginTop: 6,
    fontSize: 15,
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
