'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Plus, User, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/locations', label: 'Localisation', Icon: MapPin },
    { href: '/search', label: 'Recherche', Icon: Search },
    // Placeholder for the central "Add" button
    { href: '/add-product', label: 'Ajouter', Icon: Plus, isCentral: true },
    { href: '/profile', label: 'Profil', Icon: User },
    { href: '/home', label: 'Accueil', Icon: Home },
  ];

  const isActive = (href: string) => {
    if (href === '/home' && (pathname === '/' || pathname === '/home')) return true;
    return pathname === href;
  };

  // Reorder for display: Home, Search, Add, Locations, Profile
  const displayItems = [
    navItems.find(item => item.label === 'Accueil')!,
    navItems.find(item => item.label === 'Recherche')!,
    navItems.find(item => item.isCentral)!,
    navItems.find(item => item.label === 'Localisation')!,
    navItems.find(item => item.label === 'Profil')!,
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-sm border-t border-border z-40">
      <div className="grid grid-cols-5 items-center h-full">
        {displayItems.map(({ href, label, Icon, isCentral }) => {
          if (isCentral) {
            return (
              <div key={label} className="flex justify-center items-center">
                <Button asChild size="icon" className="w-14 h-14 rounded-full -translate-y-4 shadow-lg bg-primary hover:bg-primary/90">
                  <Link href={href} aria-label="Ajouter un prix">
                    <Icon className="h-7 w-7" />
                  </Link>
                </Button>
              </div>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center text-xs gap-1 h-full transition-colors',
                isActive(href) ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px]">{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}