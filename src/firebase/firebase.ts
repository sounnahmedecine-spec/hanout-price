import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage'; // Import getStorage and FirebaseStorage type
import { firebaseConfig } from './config';

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let storage: FirebaseStorage; // Declare storage instance

// Initialise l'application Firebase si elle ne l'est pas déjà
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialise Auth et Firestore
auth = getAuth(app);
firestore = getFirestore(app);
storage = getStorage(app); // Initialize storage

export { app, auth, firestore, storage };