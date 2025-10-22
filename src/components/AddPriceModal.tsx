'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, ScanBarcode } from 'lucide-react';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import Image from 'next/image';

interface AddPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddPriceModal: React.FC<AddPriceModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const [price, setPrice] = useState('');
  const [storeName, setStoreName] = useState('');
  const [productName, setProductName] = useState('');
  const [imageData, setImageData] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user || !firestore || !price || !storeName || !productName) {
      toast({
        variant: 'destructive',
        title: 'Champs manquants',
        description: 'Veuillez remplir tous les champs.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // In a real app, you would upload the imageData to a cloud storage (like Firebase Storage)
      // and get a URL back. For now, we'll just pretend.
      const imageUrl = imageData ? 'https://example.com/placeholder.jpg' : undefined;

      const priceRecordsCol = collection(firestore, 'priceRecords');
      await addDoc(priceRecordsCol, {
        productName,
        storeName,
        price: parseFloat(price),
        userId: user.uid,
        timestamp: serverTimestamp(),
        upvotes: 0,
        downvotes: 0,
        upvotedBy: [],
        downvotedBy: [],
        imageUrl,
      });

      toast({
        title: 'Prix ajouté !',
        description: 'Merci pour votre contribution.',
      });
      
      // Reset form and close modal
      setPrice('');
      setStoreName('');
      setProductName('');
      setImageData(null);
      onClose();

    } catch (error) {
      console.error("Error adding price record: ", error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: "Une erreur est survenue lors de l'ajout du prix.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCamera = async () => {
    try {
      const image = await CapacitorCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });
      setImageData(image.dataUrl || null);
    } catch (error) {
      console.error("Error taking photo:", error);
      toast({
        variant: 'destructive',
        title: 'Erreur Caméra',
        description: "Impossible d'accéder à la caméra. Assurez-vous que les permissions sont accordées.",
      });
    }
  };

  const handleScan = () => {
    onClose();
    router.push('/scan');
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card-bg">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Ajouter un prix</DialogTitle>
          <DialogDescription>
            Remplissez les détails du produit que vous avez trouvé.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {imageData ? (
            <div className="relative">
              <Image src={imageData} alt="Aperçu du produit" width={400} height={300} className="rounded-lg object-cover" />
              <Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => setImageData(null)}>
                Changer
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-24 flex flex-col" onClick={handleCamera}>
                  <Camera className="h-8 w-8 mb-2" />
                  <span>Prendre une photo</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col" onClick={handleScan}>
                  <ScanBarcode className="h-8 w-8 mb-2" />
                  <span>Scanner le code</span>
              </Button>
            </div>
          )}

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="productName" className="font-heading">Nom du produit</Label>
            <Input id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Ex: Coca-Cola 1.5L" />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="price" className="font-heading">Prix (€)</Label>
            <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="1.25" />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="store" className="font-heading">Magasin</Label>
            <Input id="store" value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="Ex: Hanout Omar" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
            {isSubmitting ? 'Envoi en cours...' : 'Soumettre le prix'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPriceModal;