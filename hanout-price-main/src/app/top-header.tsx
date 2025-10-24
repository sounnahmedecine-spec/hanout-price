
'use client';

import Image from 'next/image';
import Link from 'next/link';
import LanguageSwitcher from './language-switcher';
import { useUser } from '@/firebase';

export default function TopHeader() {
  const { user } = useUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/95 backdrop-blur-sm border-b">
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        {/* Empty div for spacing, to push the logo to the center */}
        <div className="w-16"></div> 
        
        <Link href={user ? "/dashboard" : "/"} className="flex items-center justify-center gap-2">
            <Image 
              src="https://res.cloudinary.com/db2ljqpdt/image/upload/v1760805185/logo-hanout-price_bgih8f.png" 
              alt="Hanout Price Logo" 
              width={150} 
              height={38}
              priority
            />
        </Link>

        <div className="w-16 flex justify-end">
            <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
