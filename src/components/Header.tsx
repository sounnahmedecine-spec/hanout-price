'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { user, userProfile } = useUser();

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-card-bg shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="https://res.cloudinary.com/db2ljqpdt/image/upload/v1760805185/logo-hanout-price_bgih8f.png"
            alt="Hanout Price Logo"
            width={150}
            height={40}
            priority
          />
        </Link>

        {/* Search Bar */}
        <div className="w-1/2">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
            className="w-full px-4 py-2 border rounded-full bg-bg focus:outline-none focus-ring-2 focus:ring-primary"
          />
        </div>

        {/* Profile Icon */}
        <div>
          {userProfile ? (
            <Link href="/profile">
              <Avatar>
                <AvatarImage src={userProfile.profilePictureUrl} alt={userProfile.username} />
                <AvatarFallback>{userProfile.username?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;