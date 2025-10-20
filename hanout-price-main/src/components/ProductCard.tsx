
import Image from 'next/image';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    unit: string;
    image: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-card-bg rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 ease-in-out">
      <div className="relative h-40 w-full">
        <Image
          src={product.image}
          alt={product.name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-text truncate">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.unit}</p>
        <div className="mt-4 flex items-center justify-between">
          <p className="font-bold text-primary text-xl">{product.price.toFixed(2)} <span className="text-sm font-normal">MAD</span></p>
          <button className="bg-cta text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity">
            Voir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
