'use client';

import { FirebaseProvider } from '@/firebase';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/app/i18n/client';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '@/firebase/config';

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const firestore = getFirestore(app);
const auth = getAuth(app);

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <FirebaseProvider firebaseApp={app} firestore={firestore} auth={auth}>
        {children}
      </FirebaseProvider>
    </I18nextProvider>
  );
}