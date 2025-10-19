'use client';

import {
  Camera,
  ScanLine,
  ArrowLeft,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTranslation } from '@/app/i18n/client';
import { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import Image from 'next/image';

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
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <Card>
          <CardHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="mt-4">Merci pour votre contribution !</CardTitle>
            <CardDescription>
              Votre produit a été ajouté avec succès. Vous gagnez des points pour chaque contribution validée.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleStartOver}>Ajouter un autre produit</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'confirmation') {
    return (
      <div className="container mx-auto px-4 max-w-2xl">
        <Button variant="ghost" onClick={handleStartOver} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('startOver')}
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>{t('confirmDetails')}</CardTitle>
            <CardDescription>{t('confirmDetailsDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {productPhoto && (
                <div className="w-full h-48 relative rounded-md overflow-hidden border">
                  <Image
                    src={URL.createObjectURL(productPhoto)}
                    alt="Aperçu du produit"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="barcode">{t('barcode')}</Label>
                <Input id="barcode" placeholder={t('barcodePlaceholder')} defaultValue={barcode ?? ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productName">{t('productName')}</Label>
                <Input id="productName" placeholder={t('productNamePlaceholder')} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">{t('priceMAD')}</Label>
                  <Input id="price" type="number" step="0.01" placeholder={t('pricePlaceholder')} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeName">{t('storeName')}</Label>
                  <Input id="storeName" placeholder={t('storeNamePlaceholder')} required />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? t('submitting') : t('submitPrice')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 'selection' step
  return (
    <div className="container mx-auto px-4 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">{t('addNewPrice')}</h1>
        <p className="text-muted-foreground">{t('startByPhotoOrBarcode')}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          className="cursor-pointer hover:border-primary hover:shadow-lg transition-all"
          onClick={() => setIsCameraModalOpen(true)}
        >
          <CardHeader className="flex flex-col items-center justify-center text-center p-8">
            <Camera className="h-12 w-12 mb-4 text-primary" />
            <CardTitle>{t('takePhoto')}</CardTitle>
            <CardDescription className="mt-2">
              Prenez une photo claire du produit.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card
          className="cursor-pointer hover:border-primary hover:shadow-lg transition-all"
          onClick={() => setIsScannerModalOpen(true)}
        >
          <CardHeader className="flex flex-col items-center justify-center text-center p-8">
            <ScanLine className="h-12 w-12 mb-4 text-primary" />
            <CardTitle>{t('scanBarcode')}</CardTitle>
            <CardDescription className="mt-2">
              Scannez le code-barres pour une identification rapide.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* 
        The modals are rendered in the parent component `add-product/page.tsx`
        and controlled by the state of this component. This is a temporary
        workaround. A better solution would be to move the modals here or
        use a global state/context.
      */}
    </div>
  );
}