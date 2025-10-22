import Image from 'next/image';
import Link from 'next/link';
import { PriceRecord } from '@/lib/types';
import VoteButtons from '@/app/vote-buttons'; // Corrected path based on file list

interface ProductCardProps {
  record: PriceRecord;
}

const ProductCard: React.FC<ProductCardProps> = ({ record }) => {
  return (
    <Link href={`/prices/${record.id}`} className="block h-full">
      <div className="bg-card-bg rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-105 h-full flex flex-col">
        <div className="relative h-48 w-full">
          <Image
            src={record.imageUrl || 'https://res.cloudinary.com/db2ljqpdt/image/upload/v1719778335/placeholder_mummye.png'}
            alt={record.productName}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="p-4 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="font-heading text-lg font-bold text-text mb-1 truncate" title={record.productName}>{record.productName}</h3>
            <p className="text-sm text-gray-500 mb-2">{record.storeName}</p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="font-heading text-xl font-bold text-primary">{record.price.toFixed(2)} €</p>
            <VoteButtons priceRecord={record} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
