
'use client';

import { useState } from 'react';

const categories = [
  'Tout',
  'Boissons',
  'Épicerie',
  'Frais',
  'Nettoyage',
  'Hygiène',
];

const CategoryTabs = () => {
  const [activeTab, setActiveTab] = useState('Tout');

  return (
    <div className="px-4 py-2 overflow-x-auto whitespace-nowrap">
      <div className="flex items-center space-x-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
              activeTab === category
                ? 'bg-primary text-white shadow'
                : 'bg-card-bg text-text hover:bg-gray-100'
            }`}>
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
