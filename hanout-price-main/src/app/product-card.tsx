"use client";

import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  storeName: string;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-card-bg rounded-lg overflow-hidden group transition-all" style={{ boxShadow: 'var(--shadow)' }}>
      <div className="relative w-full h-32">
        <Image
          src={product.imageUrl || "https://via.placeholder.com/150"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-sm text-foreground truncate">{product.name}</h3>
        <p className="text-xs text-muted-foreground mb-2">{product.storeName}</p>
        <p className="text-lg font-extrabold text-cta">
          {product.price.toFixed(2)} <span className="text-sm font-medium">MAD</span>
        </p>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-card-bg rounded-lg overflow-hidden p-3" style={{ boxShadow: 'var(--shadow)' }}>
      <Skeleton className="h-32 w-full mb-4" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2 mb-3" />
      <Skeleton className="h-6 w-1/3" />
    </div>
  );
}