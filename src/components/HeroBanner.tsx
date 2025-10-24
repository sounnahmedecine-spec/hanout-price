'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const HeroBanner = () => {
  return (
    <div className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-center bg-cover bg-center"
         style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop')" }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 text-white px-4"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          Scannez, Comparez, Économisez
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Trouvez les meilleurs prix pour vos produits préférés en un instant.
        </p>
        <Link href="/search">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-coral text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-transform duration-300"
          >
            Trouver la meilleure offre
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default HeroBanner;
