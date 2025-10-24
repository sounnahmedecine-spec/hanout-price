'use client';

import { useState, useEffect } from 'react';
import { MapPin, Loader } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PriceRecord } from '@/lib/types';
import { cn } from '@/lib/utils';

type Coordinates = {
    latitude: number;
    longitude: number;
};

interface MapProps {
    priceRecords: PriceRecord[] | null;
    selectedRecord?: PriceRecord | null;
}

export default function Map({ priceRecords, selectedRecord }: MapProps) {
    const [userCoords, setUserCoords] = useState<Coordinates | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserCoords({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                    setIsLoading(false);
                },
                (error) => {
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            setError("Vous avez refusé l'accès à la géolocalisation.");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            setError("Les informations de localisation ne sont pas disponibles.");
                            break;
                        case error.TIMEOUT:
                            setError("La demande de géolocalisation a expiré.");
                            break;
                        default:
                            setError("Une erreur inconnue est survenue.");
                            break;
                    }
                    setIsLoading(false);
                }
            );
        } else {
            setError('La géolocalisation n\'est pas supportée par votre navigateur.');
            setIsLoading(false);
        }
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Loader className="h-8 w-8 animate-spin mb-2" />
                    <p className="text-sm">Chargement de la carte...</p>
                </div>
            );
        }

        if (error && !selectedRecord?.location) {
             return (
                 <Alert variant="destructive">
                    <MapPin className="h-4 w-4"/>
                    <AlertTitle>Erreur de géolocalisation</AlertTitle>
                    <AlertDescription>
                        {error} Veuillez activer la localisation pour utiliser cette fonctionnalité.
                    </AlertDescription>
                </Alert>
            );
        }

        const centerCoords = selectedRecord?.location ?? userCoords;

        if (centerCoords) {
            const allMarkers: string[] = [];
            
            // Add user's location marker if available and not selected
            if(userCoords) {
                 allMarkers.push(`marker=lonlat:${userCoords.longitude},${userCoords.latitude};color:gray;size:small;`);
            }

            // Add other price records
            priceRecords?.forEach(record => {
                if (record.location && record.id !== selectedRecord?.id) {
                    allMarkers.push(`marker=lonlat:${record.location.longitude},${record.location.latitude};color:red;size:medium`);
                }
            });

            // Add selected record marker last to ensure it's on top
            if(selectedRecord?.location) {
                allMarkers.push(`marker=lonlat:${selectedRecord.location.longitude},${selectedRecord.location.latitude};color:blue;size:large`);
            }
            
            const markersString = allMarkers.join('|');
            const mapboxStaticUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${markersString}/${centerCoords.longitude},${centerCoords.latitude},14,0/600x600?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;
            const openstreetmapLink = `https://www.openstreetmap.org/?mlat=${centerCoords.latitude}&mlon=${centerCoords.longitude}#map=15/${centerCoords.latitude}/${centerCoords.longitude}`;

            if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
                 return (
                     <a href={openstreetmapLink} target="_blank" rel="noopener noreferrer" className="w-full h-full">
                        <div className="relative aspect-square w-full bg-muted rounded-md flex items-center justify-center overflow-hidden">
                           <iframe
                                width="100%"
                                height="100%"
                                className="border-0 rounded-md pointer-events-none"
                                loading="lazy"
                                src={`https://www.openstreetmap.org/export/embed.html?bbox=${centerCoords.longitude - 0.05},${centerCoords.latitude - 0.05},${centerCoords.longitude + 0.05},${centerCoords.latitude + 0.05}&layer=mapnik&marker=${centerCoords.latitude},${centerCoords.longitude}`}
                                title="Carte des commerces à proximité"
                            ></iframe>
                            <div className="absolute inset-0 bg-black/10 hover:bg-black/30 transition-colors flex items-center justify-center text-white text-center p-4">
                                <p className="font-bold">Voir sur OpenStreetMap</p>
                            </div>
                        </div>
                     </a>
                 )
            }

            return (
                 <a href={openstreetmapLink} target="_blank" rel="noopener noreferrer" className="block w-full h-full group">
                    <div className="w-full h-full bg-cover bg-center rounded-md relative" style={{ backgroundImage: `url(${mapboxStaticUrl})` }}>
                         <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center text-white text-center p-4 opacity-0 group-hover:opacity-100">
                                <p className="font-bold drop-shadow-md">Agrandir la carte</p>
                         </div>
                    </div>
                 </a>
            );
        }

        return (
             <div className="flex flex-col items-center justify-center text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto" />
                <p className="mt-2 text-sm font-semibold">Activez la géolocalisation pour voir la carte.</p>
            </div>
        );
    };

    return (
        <div className="relative aspect-square w-full bg-muted rounded-md flex items-center justify-center overflow-hidden">
            {renderContent()}
        </div>
    );
}
