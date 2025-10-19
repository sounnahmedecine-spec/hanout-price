'use client';

import Link from 'next/link';
import { Camera, LogIn, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/firebase';
import { useTranslation } from '@/app/i18n/client';
import { Skeleton } from '@/components/ui/skeleton';
import AddProductFlow from '@/components/add-product-flow';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useZxing } from 'react-zxing';

function AddProductPage() {
  const { user, isUserLoading } = useUser();

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <main className="flex-grow py-12">
        {isUserLoading ? (
          <AddProductSkeleton />
        ) : user ? (
          <AddProductFlow />
        ) : (
          <LoggedOutAddProduct />
        )}
      </main>
    </div>
  );
}

function LoggedOutAddProduct() {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto px-4 max-w-2xl mt-8">
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{t('signInToContribute')}</CardTitle>
          <CardDescription>{t('createAccountToAddPrice')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/login?redirect=/add-product">
              <LogIn className="mr-2 h-4 w-4" />
              {t('signIn')}
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/register?redirect=/add-product">{t('signUp')}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function AddProductSkeleton() {
  return (
    <div className="container mx-auto px-4 max-w-2xl">
      <Skeleton className="h-8 w-24 mb-4" />
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full mt-2" />
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

function CameraModal({
  isOpen,
  onOpenChange,
  onPhotoTaken
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPhotoTaken: (file: File) => void;
}) {
  const { toast } = useToast();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null!);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    const startCamera = async () => {
      if (isOpen && !capturedImage) {
        if (streamRef.current) stopCamera();

        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setHasCameraPermission(true);
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Accès à la caméra refusé',
            description: "Veuillez autoriser l'accès à la caméra dans les paramètres de votre navigateur."
          });
          onOpenChange(false);
        }
      }
    };
    startCamera();
    return () => {
      if (!isOpen) {
        stopCamera();
      }
    };
  }, [isOpen, capturedImage, stopCamera, onOpenChange, toast]);

  useEffect(() => {
    if (!isOpen) {
      setCapturedImage(null);
      setHasCameraPermission(undefined);
      stopCamera();
    }
  }, [isOpen, stopCamera]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const handleConfirm = () => {
    if (capturedImage) {
      fetch(capturedImage)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
          onPhotoTaken(file);
          onOpenChange(false);
        });
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setHasCameraPermission(undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Prendre une photo</DialogTitle>
          <DialogDescription>Cadrez le produit et prenez une photo claire.</DialogDescription>
        </DialogHeader>
        <div className="relative aspect-video w-full bg-black rounded-md overflow-hidden flex items-center justify-center">
          {capturedImage ? (
            <Image src={capturedImage} alt="Captured product" fill className="object-contain" />
          ) : (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          )}
          <canvas ref={canvasRef} className="hidden" />
          {hasCameraPermission === false && (
            <Alert variant="destructive" className="absolute bottom-4 left-4 right-4 w-auto">
              <AlertTitle>Accès à la caméra requis</AlertTitle>
              <AlertDescription>Veuillez autoriser l'accès à la caméra.</AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          {capturedImage ? (
            <div className="flex w-full justify-between">
              <Button variant="outline" onClick={handleRetake}>
                Reprendre
              </Button>
              <Button onClick={handleConfirm}>Confirmer</Button>
            </div>
          ) : (
            <Button onClick={handleCapture} disabled={hasCameraPermission !== true}>
              <Camera className="mr-2 h-4 w-4" /> Capturer
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BarcodeScannerModal({
  isOpen,
  onOpenChange,
  onBarcodeScanned
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onBarcodeScanned: (barcode: string) => void;
}) {
  const { toast } = useToast();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
  const { ref: zxingRef } = useZxing({
    onDecodeResult(result) {
      onBarcodeScanned(result.getText());
    },
    onError(error) {
      console.error('Error with barcode scanner:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur du scanner',
        description: "Impossible d'accéder à la caméra ou de scanner le code."
      });
      onOpenChange(false);
    }
  });

  const videoRef = useRef<HTMLVideoElement>(null!);

  useEffect(() => {
    let stream: MediaStream | undefined;

    const getCameraPermission = async () => {
      if (!isOpen) return;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Accès à la caméra refusé',
          description: "Veuillez autoriser l'accès à la caméra pour utiliser le scanner."
        });
        onOpenChange(false);
      }
    };

    getCameraPermission();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, onOpenChange, toast]);

  useEffect(() => {
    if (typeof zxingRef === 'function') {
      zxingRef(videoRef.current);
    }
  }, [zxingRef, videoRef]);


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Scanner le code-barres</DialogTitle>
          <DialogDescription>
            Placez le code-barres du produit dans le cadre. La détection est automatique.
          </DialogDescription>
        </DialogHeader>
        <div className="relative aspect-video w-full bg-black rounded-md overflow-hidden flex items-center justify-center">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-4/5 h-3/5 border-4 border-dashed border-primary/70 rounded-lg" />
          </div>
          {hasCameraPermission === false && (
            <Alert variant="destructive" className="absolute bottom-4 left-4 right-4 w-auto">
              <AlertTitle>Accès à la caméra requis</AlertTitle>
              <AlertDescription>
                Veuillez autoriser l'accès à la caméra pour utiliser cette fonctionnalité.
              </AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            <X className="mr-2 h-4 w-4" /> Annuler
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddProductPage;