'use client';

import Header from '@/components/Header';
import CategoryTabs from '@/components/CategoryTabs';
import ProductCard from '@/components/ProductCard';
import products from '@/data/products.mock.json';

export default function DashboardPage() {
  return (
    <div className="bg-bg min-h-screen">
      {/* The main header is now part of the layout, or we can add it here if we want it to be specific to this page */}
      {/* For this refactor, let's assume TopHeader/BottomNav from layout are replaced by a new structure */}
      
      {/* We will add the new Header here. The global one in layout.tsx should be removed later if this is the final structure. */}
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Category Filters */}
        <div className="mb-6">
          <CategoryTabs />
        </div>

        {/* Products Grid */}
        <div>
          <h2 className="text-2xl font-bold text-text mb-4">Les dernières offres</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}