// app/(app)/index.tsx
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function AppHome() {
  const { userDoc, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{userDoc?.avatarEmoji ?? '👤'}</Text>
      <Text style={styles.title}>Welcome, {userDoc?.displayName ?? 'User'}!</Text>
      <Text style={styles.subtitle}>My Trips screen coming in Plan 2</Text>
      <Pressable style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e', padding: 24 },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#ffffff', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#a0a0b8', marginBottom: 32 },
  button: { backgroundColor: '#6a6aff', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});
