import React, { createContext, useContext, useEffect, useState } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { UserDoc } from '../models/types';

interface AuthContextValue {
  user: FirebaseAuthTypes.User | null;
  userDoc: UserDoc | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    displayName: string,
    username: string,
    avatarEmoji: string,
    color: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setUserDoc(null);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  // Listen to user's Firestore profile when authenticated
  useEffect(() => {
    if (!user) return;

    const unsubscribe = firestore()
      .collection('users')
      .doc(user.uid)
      .onSnapshot(
        (snap) => {
          setUserDoc(snap.exists ? (snap.data() as UserDoc) : null);
          setLoading(false);
        },
        () => {
          setLoading(false);
        },
      );
    return unsubscribe;
  }, [user]);

  async function login(email: string, password: string): Promise<void> {
    await auth().signInWithEmailAndPassword(email, password);
  }

  async function register(
    email: string,
    password: string,
    displayName: string,
    username: string,
    avatarEmoji: string,
    color: string,
  ): Promise<void> {
    // Check username uniqueness
    const existing = await firestore()
      .collection('users')
      .where('username', '==', username.toLowerCase().trim())
      .get();
    if (!existing.empty) {
      throw new Error('That username is already taken.');
    }

    // Create Firebase Auth account
    const cred = await auth().createUserWithEmailAndPassword(email, password);
    const uid = cred.user.uid;

    // Write Firestore user profile
    const newUserDoc: UserDoc = {
      displayName: displayName.trim(),
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      avatarEmoji,
      color,
      createdAt: Date.now(),
    };
    await firestore().collection('users').doc(uid).set(newUserDoc);
  }

  async function logout(): Promise<void> {
    await auth().signOut();
  }

  async function resetPassword(email: string): Promise<void> {
    await auth().sendPasswordResetEmail(email);
  }

  return (
    <AuthContext.Provider
      value={{ user, userDoc, loading, login, register, logout, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
