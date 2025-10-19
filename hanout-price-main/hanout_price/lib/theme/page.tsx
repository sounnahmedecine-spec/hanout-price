"use client";

import { useState, useEffect } from "react";
import { ProductCard, ProductCardSkeleton } from "@/components/product-card";
import { getProducts, Product } from "@/lib/firebase/services";
import { SearchBar } from "@/app/search-bar";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const productList = await getProducts();
        setProducts(productList);
        setFilteredProducts(productList);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
        // Optionnel: gérer l'état d'erreur dans l'UI
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(lowercasedQuery) ||
      (product.storeName && product.storeName.toLowerCase().includes(lowercasedQuery))
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  return (
    <div className="bg-white min-h-screen">
      <main className="container mx-auto px-4 py-6">
        <SearchBar
          onSearch={setSearchQuery}
          className="mb-6"
        />

        <h2 className="text-2xl font-bold mb-4 text-gray-800">Derniers prix ajoutés</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <p className="text-muted-foreground">Aucun produit trouvé pour "<strong>{searchQuery}</strong>".</p>
              <p className="text-sm text-muted-foreground mt-2">Essayez avec un autre terme de recherche.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}