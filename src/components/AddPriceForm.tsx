'use client';

import { useState, FormEvent, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { Camera as CameraIcon, Barcode, MapPin, Send, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { firestore, storage, useUser } from '@/firebase'; // Changed 'db' to 'firestore'
import { PriceRecord, GeoPoint } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';

type SubmissionStatus = 'idle' | 'loading' | 'success' | 'error';

export default function AddPriceForm() {
    const { user } = useUser();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [shopName, setShopName] = useState('');
    const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
    const [location, setLocation] = useState<GeoPoint | null>(null);
    const [status, setStatus] = useState<SubmissionStatus>('idle');

    const method = searchParams.get('method') || 'manual';

    const handleTakePhoto = useCallback(async () => {
        try {
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: true,
                resultType: CameraResultType.DataUrl,
                source: CameraSource.Camera,
            });
            setPhotoDataUrl(image.dataUrl || null);
            // TODO: Call Genkit AI flow here to pre-fill fields
            toast({
                title: 'Photo capturée !',
                description: "Remplissez les détails restants.",
            });
        } catch (error) {
            console.error('Erreur caméra:', error);
            toast({
                variant: "destructive",
                title: 'Erreur Caméra',
                description: "Impossible d'accéder à la caméra.",
            });
            router.push('/add-price?method=manual');
        }
    }, [router, toast]);

    useEffect(() => {
        if (method === 'photo') {
            handleTakePhoto();
        }
        // TODO: Implement barcode scanning for 'barcode' method
    }, [method, handleTakePhoto]);

    const handleGeolocate = async () => {
        try {
            const position = await Geolocation.getCurrentPosition();
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
            toast({
                title: "Position acquise",
                description: "Votre localisation a été ajoutée.",
            });
        } catch (error) {
            console.error('Erreur géolocalisation:', error);
            toast({
                variant: "destructive",
                title: "Erreur de localisation",
                description: "Impossible d'obtenir votre position.",
            });
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast({ variant: "destructive", title: "Vous n'êtes pas connecté." });
            return;
        }
        setStatus('loading');

        try {
            let imageUrl = '';
            if (photoDataUrl) {
                const imageRef = ref(storage, `products/${user.uid}/${Date.now()}.jpg`);
                const snapshot = await uploadString(imageRef, photoDataUrl, 'data_url');
                imageUrl = await getDownloadURL(snapshot.ref);
            }

            const priceRecord: Omit<PriceRecord, 'id'> = {
                productName,
                price: parseFloat(price),
                shopName,
                userId: user.uid,
                imageUrl,
                location: location || undefined,
                timestamp: serverTimestamp(),
                upvotes: 0,
                downvotes: 0,
            };

            await addDoc(collection(firestore, 'price_records'), priceRecord);

            setStatus('success');
            toast({
                title: "Succès !",
                description: "Votre prix a été ajouté. Merci pour votre contribution !",
                className: "bg-green-100 border-green-400",
            });
            router.push('/dashboard');

        } catch (error) {
            console.error("Erreur lors de l'ajout du prix: ", error);
            setStatus('error');
            toast({
                variant: "destructive",
                title: "Erreur de soumission",
                description: "Une erreur s'est produite. Veuillez réessayer.",
            });
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {method === 'photo' && <CameraIcon className="h-6 w-6" />}
                    {method === 'barcode' && <Barcode className="h-6 w-6" />}
                    Ajouter un nouveau prix
                </CardTitle>
                <CardDescription>
                    Remplissez les informations ci-dessous pour partager un prix avec la communauté.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {photoDataUrl && (
                        <div className="mb-4">
                            <Label>Aperçu de la photo</Label>
                            <div className="mt-2 relative w-full h-48 rounded-lg overflow-hidden border">
                                <Image src={photoDataUrl} alt="Aperçu du produit" layout="fill" objectFit="contain" />
                            </div>
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="productName">Nom du produit</Label>
                        <Input id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Ex: Bouteille d'eau Sidi Ali 1.5L" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Prix (MAD)</Label>
                            <Input id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Ex: 6.00" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="shopName">Nom du magasin (Hanout)</Label>
                            <Input id="shopName" value={shopName} onChange={(e) => setShopName(e.target.value)} placeholder="Ex: Hanout Omar" required />
                        </div>
                    </div>

                    <Button type="button" variant="outline" className="w-full" onClick={handleGeolocate} disabled={!!location}>
                        {location ? <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> : <MapPin className="mr-2 h-4 w-4" />}
                        {location ? 'Position enregistrée' : 'Utiliser ma position actuelle'}
                    </Button>

                    <Button type="submit" className="w-full" disabled={status === 'loading'}>
                        {status === 'loading' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        Soumettre le prix
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}