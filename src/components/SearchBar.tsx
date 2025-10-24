'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          placeholder="Rechercher un produit, une marque..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-6 py-3 border-2 border-gray-200 rounded-full bg-white text-grayDark focus:outline-none focus:ring-2 focus:ring-green transition-all duration-300 shadow-sm"
        />
        <button type="submit" className="absolute right-0 top-0 h-full px-5 text-gray-500 hover:text-green">
          <Search size={24} />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
