'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, documentId } from 'firebase/firestore';
import Image from 'next/image';
import { Award, Loader2 } from 'lucide-react';
import { firestore } from '@/firebase'; // Changed from 'db' to 'firestore'
import { Badge } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BadgesGalleryProps {
  badgeIds: string[];
}

const BadgesGallery = ({ badgeIds }: BadgesGalleryProps) => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (badgeIds.length === 0) {
      setLoading(false);
      return;
    }

    const fetchBadges = async () => {
      setLoading(true);
      try {
        const badgesRef = collection(firestore, 'badges');
        const q = query(badgesRef, where(documentId(), 'in', badgeIds));
        const querySnapshot = await getDocs(q);
        const fetchedBadges = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Badge));
        setBadges(fetchedBadges);
      } catch (error) {
        console.error("Erreur lors de la récupération des badges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, [badgeIds]);

  if (badgeIds.length === 0) {
    return null; // On n'affiche rien si l'utilisateur n'a pas de badges
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-6 w-6 text-green" />
          Mes Badges
        </CardTitle>
        <CardDescription>Vos récompenses pour vos contributions à la communauté.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-24"><Loader2 className="h-8 w-8 animate-spin text-green" /></div>
        ) : (
          <TooltipProvider>
            <div className="flex flex-wrap gap-4">
              {badges.map((badge) => (
                <Tooltip key={badge.id}>
                  <TooltipTrigger asChild>
                    <Image src={badge.imageUrl} alt={badge.name} width={64} height={64} className="rounded-full bg-gray-200 p-1 transition-transform hover:scale-110" />
                  </TooltipTrigger>
                  <TooltipContent><p>{badge.name}: {badge.description}</p></TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        )}
      </CardContent>
    </Card>
  );
};

export default BadgesGallery;