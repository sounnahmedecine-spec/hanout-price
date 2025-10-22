'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

/**
 * Initializes and returns Firebase services.
 * This function handles both client-side rendering and server-side/test environments.
 * It ensures that Firebase is initialized only once (singleton pattern).
 */
export function initializeFirebase() {
  // Check if Firebase has already been initialized.
  if (getApps().length) {
    app = getApp();
  } else {
    // In a local development environment, we fall back to using our firebaseConfig object.
    app = initializeApp(firebaseConfig);
  }

  auth = getAuth(app);
  firestore = getFirestore(app);

  return { app, auth, firestore };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';

// --- Export initialized services ---
// We rename the exports to avoid conflicts with the internal variables.
const { app: firebaseApp, auth: firebaseAuth, firestore: firebaseDB } = initializeFirebase();

export { firebaseApp, firebaseAuth, firebaseDB };
