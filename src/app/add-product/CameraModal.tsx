'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Camera } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { Camera as CapacitorCamera } from '@capacitor/camera';

// ----------------------------------------------------------
// ✅ Hook réutilisable pour la caméra (web + mobile Capacitor)
// ----------------------------------------------------------
function useCamera({
  isOpen,
  videoRef,
}: {
  isOpen: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
}) {
  const [hasPermission, setHasPermission] = useState<boolean | undefined>(undefined);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const startCamera = async () => {
      if (!isOpen) return;

      try {
        // Sur mobile, demande la permission native
        if (Capacitor.isNativePlatform()) {
          const permission = await CapacitorCamera.requestPermissions();
          if (permission.camera !== 'granted') {
            throw new Error('Permission caméra refusée');
          }
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setHasPermission(true);
      } catch (error) {
        console.error('Erreur d’accès à la caméra :', error);
        setHasPermission(false);
        toast({
          variant: 'destructive',
          title: 'Accès à la caméra refusé',
          description:
            "Veuillez autoriser l'accès à la caméra dans les paramètres du navigateur ou de l'application.",
        });
      }
    };

    const stopCamera = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };

    if (isOpen) startCamera();
    return () => stopCamera();
  }, [isOpen, videoRef, toast]);

  return { hasPermission };
}

// ----------------------------------------------------------
// ✅ Composant Modal pour la caméra
// ----------------------------------------------------------
export default function CameraModal({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { hasPermission } = useCamera({ isOpen, videoRef });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Prendre une photo</DialogTitle>
          <DialogDescription>Cadrez le produit et prenez une photo claire.</DialogDescription>
        </DialogHeader>
        <div className="relative aspect-video bg-black rounded-md overflow-hidden flex items-center justify-center">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          {hasPermission === false && (
            <Alert variant="destructive" className="absolute bottom-4 left-4 right-4 w-auto">
              <AlertTitle>Accès à la caméra requis</AlertTitle>
              <AlertDescription>Veuillez autoriser l’accès à la caméra.</AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            <Camera className="mr-2 h-4 w-4" /> Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}