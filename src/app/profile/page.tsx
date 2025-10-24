'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { LogIn, Loader2 } from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useUser, firestore } from '@/firebase'; // Changed from 'db' to 'firestore'
import { PriceRecord, UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProfileHeader from '@/components/ProfileHeader';
import ContributionsList from '@/components/ContributionsList';
import BadgesGallery from '@/components/BadgesGallery';

function ProfilePageContent() {
    const { user, isUserLoading } = useUser();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [contributions, setContributions] = useState<PriceRecord[]>([]);
    const [loadingProfile, setLoadingProfile] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchProfileData = async () => {
                setLoadingProfile(true);
                try {
                    const userDocRef = doc(firestore, 'users', user.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        setUserProfile(userDocSnap.data() as UserProfile);
                    }
                    const q = query(collection(firestore, 'price_records'), where('userId', '==', user.uid), orderBy('dateRecorded', 'desc'));
                    const querySnapshot = await getDocs(q);
                    const userContributions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PriceRecord));
                    setContributions(userContributions);
                } catch (error) {
                    console.error("Erreur de chargement du profil:", error);
                } finally {
                    setLoadingProfile(false);
                }
            };
            fetchProfileData();
        } else {
            setLoadingProfile(false);
        }
    }, [user]);

    if (isUserLoading || loadingProfile) {
        return <div className="container mx-auto py-12 px-4 max-w-3xl"><Skeleton className="h-[500px] w-full" /></div>;
    }

    if (!user) {
        return (
            <div className="container mx-auto py-12 px-4">
                <Card className="w-full max-w-md mx-auto text-center">
                    <CardHeader><CardTitle>Connectez-vous pour voir votre profil</CardTitle></CardHeader>
                    <CardContent>
                        <Button asChild><Link href="/login?redirect=/profile"><LogIn className="mr-2 h-4 w-4" /> Se connecter</Link></Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12 px-4 max-w-3xl space-y-8">
            {userProfile && <ProfileHeader userProfile={userProfile} contributionsCount={contributions.length} />}
            {userProfile && <BadgesGallery badgeIds={userProfile.badges || []} />}
            <ContributionsList contributions={contributions} />
        </div>
    );
}

function ProfilePage() {
    return (
        <div className="flex flex-col min-h-screen bg-grayLight">
            <Header />
            <main className="flex-grow"><ProfilePageContent /></main>
            <Footer />
        </div>
    );
}

export default ProfilePage;
