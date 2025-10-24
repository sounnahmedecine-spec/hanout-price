'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MapPin, Loader2 } from 'lucide-react';

const MapPage = () => {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeolocate = () => {
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError(`Erreur de géolocalisation : ${err.message}`);
        setLoading(false);
      }
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-grayLight">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h1 className="text-4xl font-bold text-grayDark">Carte des magasins</h1>
          <p className="text-lg text-gray-600">Trouvez les meilleures offres autour de vous.</p>

          {/* Placeholder for the map */}
          <div className="w-full h-96 bg-gray-300 rounded-xl shadow-md flex items-center justify-center">
            <p className="text-gray-500">[La carte interactive s&apos;affichera ici]</p>
          </div>

          <button
            onClick={handleGeolocate}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-blue text-white font-bold py-3 px-6 rounded-full hover:bg-opacity-90 transition-all mx-auto"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <MapPin className="h-5 w-5" />
            )}
            {loading ? 'Recherche...' : 'Me localiser'}
          </button>

          {location && (
            <div className="mt-4 p-4 bg-green bg-opacity-20 rounded-lg text-green-800">
              Position trouvée : Latitude {location.lat.toFixed(4)}, Longitude {location.lon.toFixed(4)}
            </div>
          )}
          {error && (
            <div className="mt-4 p-4 bg-coral bg-opacity-20 rounded-lg text-red-800">
              {error}
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default MapPage;
