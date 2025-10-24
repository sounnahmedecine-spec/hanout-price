'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore, doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import type { UserProfile } from '@/lib/types';


// Combined state for the Firebase context
export interface FirebaseContextState {
  areServicesAvailable: boolean;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  user: User | null;
  userProfile: UserProfile | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Return type for useFirebase()
export interface FirebaseServicesAndUser extends Omit<FirebaseContextState, 'areServicesAvailable'> {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

export interface UserHookResult {
  user: User | null;
  userProfile: UserProfile | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

// Helper function to create a user profile document if it doesn't exist
const createUserProfileIfNeeded = async (firestore: Firestore, user: User) => {
  const userProfileRef = doc(firestore, 'users', user.uid);
  const userProfileSnap = await getDoc(userProfileRef);

  if (!userProfileSnap.exists()) {
    try {
      const newUserProfile: Omit<UserProfile, 'id'> = {
        email: user.email || '',
        username: user.displayName || user.email?.split('@')[0] || `user_${user.uid.substring(0, 6)}`,
        profilePictureUrl: user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`,
        createdAt: serverTimestamp() as any, // Will be converted on server
        points: 0,
        badges: [],
      };
      await setDoc(userProfileRef, newUserProfile);
    } catch (error) {
      console.error("Failed to create user profile:", error);
    }
  }
};


export const FirebaseProvider: React.FC<{
  children: ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}> = ({ children, firebaseApp, firestore, auth }) => {
  const [authState, setAuthState] = useState<{
    user: User | null;
    userProfile: UserProfile | null;
    isUserLoading: boolean;
    userError: Error | null;
  }>({
    user: null,
    userProfile: null,
    isUserLoading: true,
    userError: null,
  });

  useEffect(() => {
    if (!auth) {
      setAuthState({ user: null, userProfile: null, isUserLoading: false, userError: new Error("Auth service not provided.") });
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (firebaseUser) {
          await createUserProfileIfNeeded(firestore, firebaseUser);
          const userProfileRef = doc(firestore, 'users', firebaseUser.uid);
          
          // Set up a real-time listener for the user profile
          const unsubscribeProfile = onSnapshot(userProfileRef, 
            (docSnap) => {
              if (docSnap.exists()) {
                setAuthState({
                  user: firebaseUser,
                  userProfile: { id: docSnap.id, ...docSnap.data() } as UserProfile,
                  isUserLoading: false,
                  userError: null,
                });
              } else {
                 // Profile might still be creating, wait for next snapshot
                 setAuthState(s => ({ ...s, user: firebaseUser, isUserLoading: false }));
              }
            },
            (error) => {
              console.error("FirebaseProvider: Profile listener error:", error);
              setAuthState({ user: firebaseUser, userProfile: null, isUserLoading: false, userError: error });
            }
          );
          
          return () => unsubscribeProfile(); // Return cleanup for profile listener
        } else {
          setAuthState({ user: null, userProfile: null, isUserLoading: false, userError: null });
        }
      },
      (error) => {
        console.error("FirebaseProvider: onAuthStateChanged error:", error);
        setAuthState({ user: null, userProfile: null, isUserLoading: false, userError: error });
      }
    );
    
    return () => unsubscribeAuth(); // Return cleanup for auth listener
  }, [auth, firestore]);

  const contextValue = useMemo((): FirebaseContextState => {
    const servicesAvailable = !!(firebaseApp && firestore && auth);
    return {
      areServicesAvailable: servicesAvailable,
      firebaseApp: servicesAvailable ? firebaseApp : null,
      firestore: servicesAvailable ? firestore : null,
      auth: servicesAvailable ? auth : null,
      ...authState,
    };
  }, [firebaseApp, firestore, auth, authState]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseServicesAndUser => {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }

  if (!context.areServicesAvailable || !context.firebaseApp || !context.firestore || !context.auth) {
    throw new Error('Firebase core services not available. Check FirebaseProvider props.');
  }

  return context as FirebaseServicesAndUser;
};

export const useAuth = (): Auth => useFirebase().auth;
export const useFirestore = (): Firestore => useFirebase().firestore;
export const useFirebaseApp = (): FirebaseApp => useFirebase().firebaseApp;

export const useUser = (): UserHookResult => {
  const { user, userProfile, isUserLoading, userError } = useFirebase();
  return { user, userProfile, isUserLoading, userError };
};

type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T {
  const memoized = useMemo(factory, [factory, ...deps]);
  
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true; // This seems to be for a specific purpose, leaving it as is.
  
  return memoized;
}
