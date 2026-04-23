// contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserDoc } from '../models/types';

interface AuthContextValue {
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
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

    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid),
      (snap) => {
        setUserDoc(snap.exists() ? (snap.data() as UserDoc) : null);
        setLoading(false);
      },
      () => {
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [user]);

  async function login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(auth, email, password);
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
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username.toLowerCase().trim()));
    const existing = await getDocs(q);
    if (!existing.empty) {
      throw new Error('That username is already taken.');
    }

    // Create Firebase Auth account
    const cred = await createUserWithEmailAndPassword(auth, email, password);
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
    await setDoc(doc(db, 'users', uid), newUserDoc);
  }

  async function logout(): Promise<void> {
    await signOut(auth);
  }

  async function resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
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
