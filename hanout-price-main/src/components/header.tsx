'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, PlusCircle } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/dashboard" className="flex-shrink-0">
            <Image
              src="/logo-hanout-price.png"
              alt="Hanout Price Logo"
              width={150}
              height={40}
              className="h-8 w-auto md:h-10"
              priority
            />
          </Link>

          {/* Search Bar */}
          <div className="flex-grow mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                className="w-full px-4 py-2 pl-10 border rounded-full bg-card-bg focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Add Button */}
          <Link href="/add-product">
            <button className="flex items-center gap-2 bg-cta text-white font-bold py-2 px-4 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap">
              <PlusCircle className="h-5 w-5" />
              <span className="hidden md:inline">Ajouter un prix</span>
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;