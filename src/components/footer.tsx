
'use client';
import Link from 'next/link';
import { ShoppingBasket } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';

// Ce composant est conservé pour une utilisation potentielle sur des pages desktop ou admin,
// mais n'est plus utilisé dans la navigation principale de l'application mobile.
export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-secondary text-secondary-foreground hidden sm:block">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <ShoppingBasket className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold font-headline">Hanout Price</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4 md:mb-0">
            <Link href="/" className="text-sm hover:text-primary transition-colors">{t('home')}</Link>
            <Link href="/dashboard" className="text-sm hover:text-primary transition-colors">{t('explore')}</Link>
            <Link href="/add-product" className="text-sm hover:text-primary transition-colors">{t('contribute')}</Link>
            <Link href="/profile" className="text-sm hover:text-primary transition-colors">{t('profile')}</Link>
          </nav>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Hanout Price. {t('allRightsReserved')}
          </div>
        </div>
      </div>
    </footer>
  );
}
