
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, User, Search, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/app/i18n/client';
import { Button } from './ui/button';

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems = [
    { href: '/dashboard', label: t('dashboard'), Icon: Home },
    { href: '/leaderboard', label: t('leaderboard'), Icon: Trophy },
    { href: '/search', label: t('search', 'Rechercher'), Icon: Search },
    { href: '/profile', label: t('profile'), Icon: User },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard' && pathname === '/') return true;
    if (href === '/search' && pathname.startsWith('/search')) return true;
    return pathname === href;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-sm border-t border-border z-40">
      <div className="grid grid-cols-5 items-center h-full">
        {navItems.slice(0, 2).map(({ href, label, Icon }) => (
          <Link href={href} key={href} className={cn(
            'flex flex-col items-center justify-center text-xs gap-1 h-full transition-colors',
            isActive(href) ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
          )}>
            <Icon className="h-5 w-5" />
            <span className="text-[10px]">{label}</span>
          </Link>
        ))}

        <div className="flex justify-center items-center">
            <Button asChild size="icon" className="w-16 h-16 rounded-full -translate-y-4 shadow-lg">
                <Link href="/add-product" aria-label="Ajouter un prix">
                    <Plus className="h-8 w-8" />
                </Link>
            </Button>
        </div>

        {navItems.slice(2).map(({ href, label, Icon }) => (
          <Link href={href} key={href} className={cn(
            'flex flex-col items-center justify-center text-xs gap-1 h-full transition-colors',
            isActive(href) ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
          )}>
            <Icon className="h-5 w-5" />
            <span className="text-[10px]">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
