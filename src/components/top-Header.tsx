'use client';

import Image from 'next/image';
import Link from 'next/link';
import LanguageSwitcher from './language-switcher';

export default function TopHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/95 backdrop-blur-sm border-b">
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        {/* Empty div for spacing, to push the logo to the center */}
        <div className="w-10"></div> 
        
        <Link href="/" className="flex items-center justify-center gap-2">
            <Image 
              src="https://res.cloudinary.com/db2ljqpdt/image/upload/v1760319434/Logo_moderne__Hanout_Price__tlhl4w_skaxpt.png" 
              alt="Hanout Price Logo" 
              width={150} 
              height={38}
              priority
            />
        </Link>

        <LanguageSwitcher />
      </div>
    </header>
  );
}
