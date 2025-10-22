import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "./client-providers";

// Configuration de la police Inter, comme recommandé pour les projets modernes
const inter = Inter({ subsets: ["latin"] });

// Métadonnées du site (titre de l'onglet, description pour le SEO)
export const metadata: Metadata = {
  title: "Hanout Price",
  description: "Scannez • Comparez • Économisez",
};

// Le composant RootLayout qui doit être exporté par défaut
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}