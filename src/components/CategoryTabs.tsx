'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

const categories = [
  'Tout',
  'Boissons',
  'Produits laitiers',
  'Boulangerie',
  'Snacks',
  'Épicerie',
];

const CategoryTabs = () => {
  const [activeTab, setActiveTab] = useState('Tout');

  return (
    <div className="mb-8">
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={cn(
              'px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-colors duration-200',
              activeTab === category
                ? 'bg-primary text-white'
                : 'bg-card-bg text-text hover:bg-gray-200'
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;