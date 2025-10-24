'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useAuth, useUser } from '@/firebase';
import { initiateEmailSignIn, initiateGoogleSignIn } from '@/firebase/non-blocking-login';
import { Mail, Lock, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if user is already logged in
  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await initiateEmailSignIn(auth, email, password);
      // The onAuthStateChanged listener will handle the redirect
    } catch (error) {
      console.error("Email sign-in error:", error);
    }
    // In a real app, you might want to handle the submitting state more robustly
    // For now, we assume the listener will trigger a re-render and redirect.
    // We can set a timeout to reset the button if login fails silently.
    setTimeout(() => setIsSubmitting(false), 3000);
  };

  const handleGoogleSignIn = () => {
    initiateGoogleSignIn(auth);
  };

  if (isUserLoading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-grayLight">
        <Loader2 className="h-12 w-12 animate-spin text-green" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-grayLight p-4">
      <div className="w-full max-w-md space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Image
            src="https://res.cloudinary.com/db2ljqpdt/image/upload/v1760805185/logo-hanout-price_bgih8f.png"
            alt="Hanout Price Logo"
            width={250}
            height={60}
            priority
            className="mx-auto"
          />
          <p className="mt-4 text-lg text-gray-600">Scannez • Comparez • Économisez</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-xl shadow-lg"
        >
          <form onSubmit={handleEmailSignIn} className="space-y-6">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Adresse e-mail"
                  className="w-full rounded-lg border-gray-300 py-3 pl-10 pr-3 focus:border-green focus:ring-green"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mot de passe"
                  className="w-full rounded-lg border-gray-300 py-3 pl-10 pr-3 focus:border-green focus:ring-green"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full justify-center rounded-lg bg-green px-4 py-3 font-semibold text-white transition hover:bg-opacity-90 disabled:opacity-50 flex items-center"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
              Se connecter
            </button>
          </form>

          <div className="my-6 flex items-center text-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 flex-shrink text-sm text-gray-500">OU</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 flex items-center"
          >
            <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google Logo" width={20} height={20} className="mr-3" />
            Continuer avec Google
          </button>
        </motion.div>
      </div>
    </div>
  );
}
