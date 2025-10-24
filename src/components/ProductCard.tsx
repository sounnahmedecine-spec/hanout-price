'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PriceRecord } from '@/lib/types'; // Assuming this type is still relevant

interface ProductCardProps {
  product: PriceRecord;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full group"
    >
      <Link href={`/prices/${product.id}`} className="block">
        <div className="relative h-48 w-full">
          <Image
            src={product.imageUrl || 'https://via.placeholder.com/300'}
            alt={product.productName}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </Link>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-bold text-lg text-grayDark truncate" title={product.productName}>
          {product.productName}
        </h3>
        <p className="text-sm text-gray-500 mb-2">{product.shopName}</p>
        
        <div className="mt-auto flex justify-between items-center pt-4">
          <p className="font-bold text-xl text-green">{product.price.toFixed(2)} MAD</p>
          <Link href={`/prices/${product.id}`} className="block">
            <button className="bg-coral text-white text-sm font-bold py-2 px-4 rounded-full transform transition-transform duration-300 group-hover:scale-105">
              Voir le prix
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;