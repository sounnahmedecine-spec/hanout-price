'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { ShoppingBasket } from 'lucide-react'; // Changed from 'db' to 'firestore'

import { useUser, firestore } from '@/firebase'; // Changed 'db' to 'firestore'
import { PriceRecord } from '@/lib/types';
import Map from './map';
import ActionGrid from './action-grid';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from './ProductCard';

export default function Dashboard() {
    const { user } = useUser();
    const [latestPrices, setLatestPrices] = useState<PriceRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLatestPrices() {
            try {
                const pricesQuery = query(collection(firestore, 'price_records'), orderBy('dateRecorded', 'desc'), limit(8));
                const querySnapshot = await getDocs(pricesQuery);
                const prices: PriceRecord[] = [];
                querySnapshot.forEach((doc) => {
                    prices.push({ id: doc.id, ...doc.data() } as PriceRecord);
                });
                setLatestPrices(prices);
            } catch (error) {
                console.error("Erreur lors de la récupération des derniers prix: ", error);
            } finally {
                setLoading(false);
            }
        }

        fetchLatestPrices();
    }, []);

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-grayDark">
                    Bienvenue, {user?.displayName || user?.email || 'Contributeur'} !
                </h1>
                <p className="text-lg text-muted-foreground mt-2">Prêt à trouver les meilleures offres ou à en partager une ?</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Colonne de gauche : Actions et Carte */}
                <div className="lg:col-span-1 flex flex-col gap-8">
                    <section>
                        <h2 className="text-2xl font-bold text-grayDark mb-4">Actions rapides</h2>
                        <ActionGrid />
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold text-grayDark mb-4">Prix à proximité</h2>
                        <Card>
                            <CardContent className="p-2">
                                <Map priceRecords={latestPrices} />
                            </CardContent>
                        </Card>
                    </section>
                </div>

                {/* Colonne de droite : Derniers ajouts */}
                <div className="lg:col-span-2">
                    <section>
                        <h2 className="text-2xl font-bold text-grayDark mb-4">Derniers prix ajoutés</h2>
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <Card key={i}>
                                        <CardContent className="p-4">
                                            <Skeleton className="h-32 w-full mb-4" />
                                            <Skeleton className="h-5 w-3/4 mb-2" />
                                            <Skeleton className="h-4 w-1/2" />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : latestPrices.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {latestPrices.map(price => (
                                    <ProductCard key={price.id} product={price} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground">Aucun prix n&apos;a été ajouté récemment.</p>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}