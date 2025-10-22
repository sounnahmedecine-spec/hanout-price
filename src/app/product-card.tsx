"use client";

import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { PriceRecord } from "@/lib/types";

export function ProductCard({ record }: { record: PriceRecord }) {
  return (
    <Link href={`/prices/${record.id}`} className="block h-full">
      <div className="bg-card-bg rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-105 h-full flex flex-col">
        <div className="relative h-40 w-full">
          <Image
            src={record.imageUrl || "https://res.cloudinary.com/db2ljqpdt/image/upload/v1719778335/placeholder_mummye.png"}
            alt={record.productName}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-3 flex-grow flex flex-col justify-between">
          <h3 className="font-heading text-base font-bold text-text mb-1 truncate" title={record.productName}>
            {record.productName}
          </h3>
          <p className="text-xs text-gray-500 mb-2">{record.storeName}</p>
          <p className="font-heading text-lg font-bold text-primary">
            {record.price.toFixed(2)} MAD
          </p>
        </div>
      </div>
    </Link>
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