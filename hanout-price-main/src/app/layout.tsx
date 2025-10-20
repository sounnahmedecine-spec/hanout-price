
import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import '../styles/tokens.css';
import '../styles/theme.css';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { I18nProvider } from '@/app/i18n/client';
import { Inter, Poppins } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});


export const metadata: Metadata = {
  title: 'Hanout Price',
  description: 'Trouvez les meilleurs prix autour de vous.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        {/* Font links are now handled by next/font */}
      </head>
      <body className="font-sans bg-bg text-text antialiased min-h-screen flex flex-col">
        <I18nProvider>
          <FirebaseClientProvider>
            <main className="flex-grow">{children}</main>
          </FirebaseClientProvider>
        </I18nProvider>
        <Toaster />
      </body>
    </html>
  );
}
