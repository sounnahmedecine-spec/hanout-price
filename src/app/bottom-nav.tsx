'use client';

import { cn } from '@/lib/utils';
import { useTranslation } from '@/app/i18n/client';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Search, Plus, User, Trophy } from 'lucide-react';
import { useModal } from '@/context/ModalContext'; // Import useModal

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { openModal } = useModal(); // Get openModal function

  const navItems = [
    { href: '/', icon: Home, label: t('home') },
    { href: '/search', icon: Search, label: t('search') },
    { name: 'add', icon: Plus, label: t('add') }, // Changed to name for special handling
    { href: '/leaderboard', icon: Trophy, label: t('leaderboard') },
    { href: '/profile', icon: User, label: t('profile') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50">
      {navItems.map((item) => {
        if (item.name === 'add') {
          return (
            <Button
              key={item.name}
              variant='ghost'
              size="icon"
              className='flex flex-col items-center justify-center text-xs h-auto'
              onClick={openModal} // Add onClick handler
            >
              <div className="bg-cta text-white rounded-full p-3 -mt-8 shadow-lg border-4 border-white">
                <item.icon className="h-6 w-6" />
              </div>
              <span className="mt-1 text-text">{item.label}</span>
            </Button>
          );
        }

        const isActive = pathname === item.href;
        return (
          <Link key={item.href} href={item.href!}>
            <Button variant={isActive ? 'default' : 'ghost'} size="icon" className={cn('flex flex-col items-center justify-center text-xs h-auto', isActive ? 'text-primary' : 'text-text')}>
              <item.icon className="h-5 w-5 mb-1" />
              <span>{item.label}</span>
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}
