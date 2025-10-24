
import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { I18nProvider } from '@/app/i18n/client';
import BottomNav from '@/components/bottom-nav';
import TopHeader from '@/components/top-header';

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
    <html lang="fr" className="">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&family=Belleza&family=Tajawal:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body bg-background text-foreground antialiased min-h-screen flex flex-col">
        <I18nProvider>
          <FirebaseClientProvider>
            <TopHeader />
            <main className="flex-grow pt-16 pb-16 sm:pb-0">{children}</main>
            <BottomNav />
          </FirebaseClientProvider>
        </I18nProvider>
        <Toaster />
      </body>
    </html>
  );
}
