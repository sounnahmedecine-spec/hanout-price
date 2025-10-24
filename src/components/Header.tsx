'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 50, damping: 20 }}
      className="bg-green text-white shadow-lg sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="https://res.cloudinary.com/db2ljqpdt/image/upload/v1760805185/logo-hanout-price_bgih8f.png"
            alt="Hanout Price Logo"
            width={150}
            height={40}
            priority
          />
        </Link>

        {/* CTA Button */}
        <Link href="/add-price">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-coral text-white font-bold py-2 px-4 rounded-full shadow-md transition-colors duration-300"
          >
            Ajouter un prix
          </motion.button>
        </Link>
      </div>
    </motion.header>
  );
};

export default Header;
