'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useAuth, useUser } from '@/firebase'; // Import useAuth and useUser
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  // Redirect if user is already logged in
  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // The onAuthStateChanged listener in FirebaseProvider will handle the redirect
      // after successful login, but we can push optimistically.
      router.push('/');
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      // Handle error, e.g., show a toast notification
    }
  };

  // Don't render the login page if the user state is loading or user exists
  if (isUserLoading || user) {
    return (
        <div className="flex flex-col h-screen w-full items-center justify-center bg-background">
            {/* You can put a loading spinner here */}
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg p-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src="https://res.cloudinary.com/db2ljqpdt/image/upload/v1760805185/logo-hanout-price_bgih8f.png"
          alt="Hanout Price Logo"
          width={250}
          height={60}
          priority
        />
      </motion.div>

      <motion.p
        className="font-heading text-xl text-text mt-4 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Scannez • Comparez • Économisez
      </motion.p>

      <div className="space-y-4 w-full max-w-xs">
        <Button onClick={handleGoogleSignIn} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg">
          Se connecter avec Google
        </Button>
        <p className="text-xs text-gray-500">ou</p>
        <Button variant="outline" className="w-full py-6 text-lg" disabled>
          Se connecter avec l'email (bientôt)
        </Button>
      </div>
    </div>
  );
}