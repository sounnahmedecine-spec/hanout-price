
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, PlusCircle, LogIn, ShoppingBasket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { PriceRecord } from '@/lib/types';
import { useState, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import VoteButtons from '@/components/vote-buttons';
import { useTranslation } from '@/app/i18n/client';
import Map from '@/components/map';
import { cn } from '@/lib/utils';

function RecentDealsTable({ 
    priceRecords, 
    isLoading,
    onRecordSelect,
    selectedRecordId
}: { 
    priceRecords: PriceRecord[] | null, 
    isLoading: boolean,
    onRecordSelect: (record: PriceRecord) => void,
    selectedRecordId: string | null
}) {
    if (isLoading) {
        return (
            <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        );
    }

    if (!priceRecords || priceRecords.length === 0) {
        return <p className="text-center text-muted-foreground py-8">Aucune offre récente trouvée. Soyez le premier à en ajouter une !</p>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead className="text-right">Prix</TableHead>
                    <TableHead>Commerce</TableHead>
                    <TableHead>Votes</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {priceRecords.map(deal => (
                    <TableRow 
                        key={deal.id} 
                        onClick={() => onRecordSelect(deal)} 
                        className={cn(
                            "cursor-pointer",
                            selectedRecordId === deal.id && 'bg-primary/10'
                        )}
                    >
                        <TableCell className="font-medium flex items-center gap-3">
                           <div className="w-10 h-10 rounded-md bg-muted flex-shrink-0">
                             {deal.imageUrl ? (
                               <Image src={deal.imageUrl} alt={deal.productName} width={40} height={40} className="w-full h-full object-cover rounded-md" />
                             ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                    <ShoppingBasket className="w-5 h-5"/>
                                </div>
                             )}
                           </div>
                           <span>{deal.productName}</span>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-accent">{deal.price.toFixed(2)} MAD</TableCell>
                        <TableCell className="text-muted-foreground">{deal.storeName}</TableCell>
                        <TableCell>
                            <VoteButtons priceRecord={deal} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

function SearchButton() {
  const router = useRouter();

  return (
    <Button variant="outline" className="flex-1 justify-start gap-2 bg-accent/90 text-accent-foreground hover:bg-accent" onClick={() => router.push('/search')}>
      <Search className="h-4 w-4" />
      <span>Rechercher un produit...</span>
    </Button>
  )
}

function LoggedOutDashboard() {
  const { t } = useTranslation();
  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{t('welcomeToHanoutPrice')}</CardTitle>
        <CardDescription>{t('pleaseSignInToContribute')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link href="/login">
            <LogIn className="mr-2 h-4 w-4" />
            {t('signIn')}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const firestore = useFirestore();
  const { user, userProfile, isUserLoading } = useUser();
  const { t } = useTranslation();
  const [selectedRecord, setSelectedRecord] = useState<PriceRecord | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);


  const priceRecordsQuery = useMemoFirebase(() => {
    // Only run the query if the user is logged in and firestore is available
    if (!firestore || !user) return null;
    return query(collection(firestore, 'priceRecords'), orderBy('timestamp', 'desc'), limit(10));
  }, [firestore, user]);
  

  const { data: priceRecords, isLoading: areDealsLoading } = useCollection<PriceRecord>(priceRecordsQuery);
  
  const isLoading = isUserLoading || (!!user && areDealsLoading);
  
  const handleRecordSelect = (record: PriceRecord) => {
      setSelectedRecord(record);
      mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="lg:w-2/3 space-y-8">
              {isUserLoading ? (
                 <Card>
                   <CardHeader><Skeleton className="h-8 w-48" /></CardHeader>
                   <CardContent><Skeleton className="h-24 w-full" /></CardContent>
                 </Card>
              ) : !user ? (
                 <LoggedOutDashboard />
              ) : (
                <>
                  <Card>
                    <CardHeader className="text-center">
                      <CardTitle className="font-headline text-2xl">{t('helloUser', { name: userProfile?.username || user.email })}</CardTitle>
                      <CardDescription>{t('whatDoYouWantToDo')}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row gap-4">
                      <Button asChild className="flex-1">
                        <Link href="/add-product">
                          <PlusCircle className="mr-2" />
                          {t('contribute')}
                        </Link>
                      </Button>
                      <SearchButton />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="text-center">
                      <CardTitle className="font-headline text-xl">{t('latestPricesAdded')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RecentDealsTable 
                            priceRecords={priceRecords} 
                            isLoading={isLoading} 
                            onRecordSelect={handleRecordSelect}
                            selectedRecordId={selectedRecord?.id || null}
                        />
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Sidebar/Map */}
            <div className="lg:w-1/3" ref={mapRef}>
              <Card className={cn(
                  "sticky top-24 transition-all duration-500",
                  selectedRecord && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
              )}>
                <CardHeader>
                  <CardTitle className="font-headline text-xl text-center">{t('storesMap')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Map priceRecords={priceRecords} selectedRecord={selectedRecord} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

    
