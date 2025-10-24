'use client';

import {
  Camera,
  ScanLine,
  ArrowLeft,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';
import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';


// NOTE: The Modal components are defined in `add-product/page.tsx`.
// For a better structure, they could be moved to their own files.
// We assume they are passed as props or available in the context for now.

type FlowStep = 'selection' | 'confirmation';

/**
 * AddProductFlow
 * Manages the user flow for adding a new product, either by photo or barcode.
 * This component is displayed when the user is logged in.
 */
export default function AddProductFlow() {
  const { t } = useTranslation();
  const [step, setStep] = useState<FlowStep>('selection');
  const [barcode, setBarcode] = useState<string | null>(null);
  const [productPhoto, setProductPhoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // State for controlling modals (defined in parent page.tsx)
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);

  const handlePhotoTaken = (file: File) => {
    setProductPhoto(file);
    setStep('confirmation');
    setIsCameraModalOpen(false);
  };

  const handleBarcodeScanned = (scannedBarcode: string) => {
    setBarcode(scannedBarcode);
    setStep('confirmation');
    setIsScannerModalOpen(false);
  };

  const handleStartOver = () => {
    setStep('selection');
    setBarcode(null);
    setProductPhoto(null);
    setIsSubmitting(false);
    setIsSubmitted(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    // TODO: Implement the actual submission logic to Firebase
    // (upload image, save product data, etc.)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 max-w-2xl text-center flex flex-col items-center justify-center h-full py-12">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green">
            <CheckCircle className="h-16 w-16 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-grayDark">Merci pour votre contribution !</h2>
          <p className="mt-2 text-lg text-gray-600">
            Votre produit a été ajouté avec succès. Vous gagnez des points pour chaque contribution validée.
          </p>
          <button onClick={handleStartOver} className="mt-8 bg-coral text-white font-bold py-3 px-6 rounded-full hover:bg-opacity-90 transition-all">
            Ajouter un autre produit
          </button>
        </motion.div>
      </div>
    );
  }

  if (step === 'confirmation') {
    return (
      <div className="container mx-auto px-4 max-w-2xl">
        <button onClick={handleStartOver} className="mb-4 text-gray-600 hover:text-grayDark flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('startOver')}
        </button>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-grayDark">{t('confirmDetails')}</h2>
            <p className="text-gray-600">{t('confirmDetailsDescription')}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {productPhoto && (
              <div className="w-full h-48 relative rounded-lg overflow-hidden border-2 border-dashed">
                <Image
                  src={URL.createObjectURL(productPhoto)}
                  alt="Aperçu du produit"
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="barcode" className="font-medium text-grayDark">{t('barcode')}</label>
              <input id="barcode" placeholder={t('barcodePlaceholder')} defaultValue={barcode ?? ''} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green" />
            </div>
            <div className="space-y-2">
              <label htmlFor="productName" className="font-medium text-grayDark">{t('productName')}</label>
              <input id="productName" placeholder={t('productNamePlaceholder')} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="price" className="font-medium text-grayDark">{t('priceMAD')}</label>
                <input id="price" type="number" step="0.01" placeholder={t('pricePlaceholder')} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green" />
              </div>
              <div className="space-y-2">
                <label htmlFor="storeName" className="font-medium text-grayDark">{t('storeName')}</label>
                <input id="storeName" placeholder={t('storeNamePlaceholder')} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green" />
              </div>
            </div>
            <button type="submit" className="w-full bg-green text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? t('submitting') : t('submitPrice')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 'selection' step
  return (
    <div className="container mx-auto px-4 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-grayDark">{t('addNewPrice')}</h1>
        <p className="text-lg text-gray-600 mt-2">{t('startByPhotoOrBarcode')}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Take Photo Option */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer"
          onClick={() => setIsCameraModalOpen(true)}
        >
          <Camera className="h-16 w-16 mb-4 text-green" />
          <h2 className="text-2xl font-bold text-grayDark">{t('takePhoto')}</h2>
          <p className="mt-2 text-gray-600">
            Prenez une photo claire du produit.
          </p>
        </motion.div>

        {/* Scan Barcode Option */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer"
          onClick={() => setIsScannerModalOpen(true)}
        >
          <ScanLine className="h-16 w-16 mb-4 text-coral" />
          <h2 className="text-2xl font-bold text-grayDark">{t('scanBarcode')}</h2>
          <p className="mt-2 text-gray-600">
            Scannez le code-barres pour une identification rapide.
          </p>
        </motion.div>
      </div>

      {/* Modals are handled in the parent component */}
    </div>
  );
}