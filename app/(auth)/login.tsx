// app/(auth)/login.tsx
import { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, Alert, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
  const { login, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace('/(app)');
    } catch (err: any) {
      Alert.alert('Login Failed', err.message ?? 'Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    if (!resetEmail.trim()) {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }
    try {
      await resetPassword(resetEmail.trim());
      Alert.alert('Email Sent', 'Check your inbox for a password reset link.');
      setShowReset(false);
      setResetEmail('');
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Could not send reset email.');
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.logo}>Triplan</Text>
        <Text style={styles.subtitle}>Plan trips together</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#707090"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#707090"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="password"
        />

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Log In'}</Text>
        </Pressable>

        <Pressable onPress={() => setShowReset(true)}>
          <Text style={styles.link}>Forgot password?</Text>
        </Pressable>

        <Link href="/(auth)/register" asChild>
          <Pressable>
            <Text style={styles.link}>Don't have an account? Sign up</Text>
          </Pressable>
        </Link>

        {showReset && (
          <View style={styles.resetBox}>
            <Text style={styles.resetTitle}>Reset Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#707090"
              value={resetEmail}
              onChangeText={setResetEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <View style={styles.resetRow}>
              <Pressable style={styles.resetButton} onPress={handleResetPassword}>
                <Text style={styles.buttonText}>Send Reset Link</Text>
              </Pressable>
              <Pressable onPress={() => setShowReset(false)}>
                <Text style={styles.link}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#1a1a2e' },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logo: { fontSize: 36, fontWeight: '700', color: '#ffffff', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#a0a0b8', textAlign: 'center', marginBottom: 32 },
  input: {
    backgroundColor: '#252540', borderWidth: 1, borderColor: '#3a3a5c', borderRadius: 12,
    padding: 14, fontSize: 16, color: '#e8e8e8', marginBottom: 12,
  },
  button: {
    backgroundColor: '#6a6aff', borderRadius: 12, padding: 16,
    alignItems: 'center', marginBottom: 16,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  link: { color: '#8a8aff', textAlign: 'center', fontSize: 14, marginBottom: 12 },
  resetBox: {
    marginTop: 16, padding: 16, backgroundColor: '#252540',
    borderRadius: 12, borderWidth: 1, borderColor: '#3a3a5c',
  },
  resetTitle: { fontSize: 16, fontWeight: '600', color: '#ffffff', marginBottom: 12 },
  resetRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  resetButton: {
    backgroundColor: '#6a6aff', borderRadius: 12, paddingHorizontal: 20,
    paddingVertical: 10, flex: 1, alignItems: 'center',
  },
});
