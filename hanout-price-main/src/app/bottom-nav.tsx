'use client';

import { cn } from '@/lib/utils';
import { useTranslation } from '@/app/i18n/client';
import { Button } from '@/components/ui/button'; // ✅ chemin corrigé
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Search, Plus, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems = [
    { href: '/', icon: Home, label: t('home') },
    { href: '/search', icon: Search, label: t('search') },
    { href: '/add-product', icon: Plus, label: t('add') },
    { href: '/profile', icon: User, label: t('profile') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50">
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href;
        return (
          <Link key={href} href={href}>
            <Button variant={isActive ? 'default' : 'ghost'} size="icon" className={cn('flex flex-col items-center justify-center text-xs', isActive && 'text-primary')}>
              <Icon className="h-5 w-5 mb-1" />
              <span>{label}</span>
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}
