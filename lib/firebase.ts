// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
  browserLocalPersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyAEt6rfdkUIH4rG_oqo7jnmsPeCtlE30i0",
  authDomain: "triplan-2e249.firebaseapp.com",
  projectId: "triplan-2e249",
  storageBucket: "triplan-2e249.firebasestorage.app",
  messagingSenderId: "229337450325",
  appId: "1:229337450325:android:8a7d6fa3e01aef984dd1dc",
};

const app = initializeApp(firebaseConfig);

// Use platform-appropriate auth persistence
let auth: ReturnType<typeof initializeAuth>;
if (Platform.OS === 'web') {
  auth = initializeAuth(app, {
    persistence: browserLocalPersistence,
  });
} else {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const AsyncStorage =
    require('@react-native-async-storage/async-storage').default;
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export { auth };
export const db = getFirestore(app);
