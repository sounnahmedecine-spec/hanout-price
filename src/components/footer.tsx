'use client';

import Link from 'next/link';
const Footer = () => { 
  return (
    <footer className="bg-green text-white">
      <div className="container mx-auto py-8 px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-center md:text-left">&copy; {new Date().getFullYear()} Hanout Price. Tous droits réservés.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="/about" className="hover:text-coral transition-colors">À propos</Link>
          <Link href="/contact" className="hover:text-coral transition-colors">Contact</Link>
          <Link href="/privacy" className="hover:text-coral transition-colors">Confidentialité</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;