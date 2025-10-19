/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produit un export statique dans le dossier 'out'
  output: 'export',

  // Requis pour que les images fonctionnent après l'export statique
  images: {
    unoptimized: true,
  },
};

export default nextConfig;