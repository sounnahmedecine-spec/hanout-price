'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  AuthError,
  updateProfile,
  UserCredential,
} from 'firebase/auth';
import { toast } from '@/hooks/use-toast';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  // CRITICAL: Call signInAnonymously directly. Do NOT use 'await signInAnonymously(...)'.
  signInAnonymously(authInstance);
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-up (non-blocking). Returns a promise with the user credential. */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): Promise<UserCredential | void> {
  // CRITICAL: Call createUserWithEmailAndPassword directly. Do NOT use 'await createUserWithEmailAndPassword(...)'.
  return createUserWithEmailAndPassword(authInstance, email, password)
    .catch((error: AuthError) => {
        toast({
            variant: "destructive",
            title: "Erreur d'inscription",
            description: error.message || "Une erreur est survenue lors de la création du compte.",
        });
    });
}


/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): void {
  // CRITICAL: Call signInWithEmailAndPassword directly. Do NOT use 'await signInWithEmailAndPassword(...)'.
  signInWithEmailAndPassword(authInstance, email, password)
   .catch((error: AuthError) => {
        toast({
            variant: "destructive",
            title: "Erreur de connexion",
            description: "Email ou mot de passe incorrect.",
        });
    });
}

/** Initiate Google Sign-In (non-blocking). */
export function initiateGoogleSignIn(authInstance: Auth): void {
  const provider = new GoogleAuthProvider();
  // CRITICAL: Call signInWithPopup directly. Do NOT use 'await signInWithPopup(...)'.
  signInWithPopup(authInstance, provider)
    .catch((error: AuthError) => {
      // Handle Errors here.
      // The auth/popup-closed-by-user error occurs when the user closes the
      // popup before completing the sign-in flow. We can safely ignore this error.
      if (error.code !== 'auth/popup-closed-by-user') {
         toast({
            variant: "destructive",
            title: "Erreur de connexion Google",
            description: error.message || "Une erreur est survenue.",
        });
      }
    });
}

/** Updates the user's profile displayName. */
export function updateUserProfile(authInstance: Auth, displayName: string): Promise<void> {
    if (!authInstance.currentUser) {
        return Promise.reject(new Error("No user is currently signed in."));
    }
    return updateProfile(authInstance.currentUser, { displayName });
}
