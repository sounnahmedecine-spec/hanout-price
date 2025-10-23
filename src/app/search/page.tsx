
'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, LogIn, ShoppingBasket, ArrowLeft } from 'lucide-react';
import type { Hit as AlgoliaHit } from 'instantsearch.js';
import { InstantSearch, SearchBox, Hits, Highlight, Snippet } from 'react-instantsearch-hooks-web';
import algoliasearch from 'algoliasearch/lite';
import type { MultipleQueriesQuery } from '@algolia/client-search';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/firebase';
import { PriceRecord } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import VoteButtons from '@/components/vote-buttons';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

// IMPORTANT: Replace with your own Algolia credentials
const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY;

if (!appId || !apiKey) {
    console.warn("Algolia credentials are not set in environment variables. Search will not work. Please set NEXT_PUBLIC_ALGOLIA_APP_ID and NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY.");
}

const searchClient = appId && apiKey ? algoliasearch(appId, apiKey) : {
    search(requests: readonly MultipleQueriesQuery[]) {
        return Promise.resolve({
            results: requests.map(() => ({
                hits: [],
                nbHits: 0,
                nbPages: 0,
                page: 0,
                processingTimeMS: 0,
                hitsPerPage: 0,
                exhaustiveNbHits: true,
                query: '',
                params: '',
            })),
        });
    },
};


function Hit({ hit }: { hit: AlgoliaHit<PriceRecord> }) {
  const router = useRouter();
  
  // Algolia returns all properties, but we need to ensure our VoteButtons component gets the 'id'
  const priceRecordWithId = { ...hit, id: hit.objectID };

  return (
    <Link href={`/prices/${hit.objectID}`} className="grid grid-cols-[auto,1fr,auto] items-center gap-4 p-4 hover:bg-secondary transition-colors rounded-lg cursor-pointer">
        <div className="w-12 h-12 rounded-md bg-muted flex-shrink-0 relative">
            {hit.imageUrl ? (
            <Image src={hit.imageUrl} alt={hit.productName} fill className="object-cover rounded-md" />
            ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <ShoppingBasket className="w-6 h-6"/>
            </div>
            )}
        </div>
        <div className="flex-1 overflow-hidden">
            <h3 className="font-semibold text-base">
            <Highlight attribute="productName" hit={hit} />
            </h3>
            <p className="text-sm text-muted-foreground truncate">
            chez <Highlight attribute="storeName" hit={hit} />
            </p>
            <div className="md:hidden mt-2">
            <VoteButtons priceRecord={priceRecordWithId} />
            </div>
        </div>
        <div className="flex flex-col items-end gap-1 text-right">
            <p className="font-semibold text-lg text-primary">
                {Number(hit.price).toFixed(2)} MAD
            </p>
            <div className="hidden md:block">
            <VoteButtons priceRecord={priceRecordWithId} />
            </div>
        </div>
    </Link>
  );
}


function SearchResults() {
  const searchParams = useSearchParams();
  const { user, isUserLoading } = useUser();
  const searchQuery = searchParams.get('q');
  
  if (isUserLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
       <Card className="text-center">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Accès restreint</CardTitle>
          <CardDescription>
            Veuillez vous connecter pour rechercher des produits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href={`/login?redirect=/search?q=${searchQuery || ''}`}>
              <LogIn className="mr-2 h-4 w-4" />
              Se connecter
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!appId || !apiKey) {
      return (
           <Alert variant="destructive">
            <Search className="h-4 w-4" />
            <AlertTitle>Configuration de la recherche incomplète</AlertTitle>
            <AlertDescription>
                La fonctionnalité de recherche n'est pas encore activée. L'administrateur doit configurer les clés API Algolia dans les variables d'environnement.
            </AlertDescription>
        </Alert>
      )
  }

  return (
     <InstantSearch
        searchClient={searchClient}
        indexName="priceRecords"
        initialUiState={{
          priceRecords: {
            query: searchQuery || '',
          },
        }}
      >
        <Card>
            <CardHeader>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <SearchBox
                        placeholder="Rechercher un produit ou un commerce..."
                        classNames={{
                            root: 'w-full',
                            input: 'w-full pl-9 h-10 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                            submit: 'hidden',
                            reset: 'hidden',
                        }}
                    />
                </div>
            </CardHeader>
            <CardContent>
               <Hits
                hitComponent={Hit}
                classNames={{
                    list: 'divide-y divide-border',
                    root: 'min-h-[300px]',
                    emptyRoot: 'min-h-0'
                }}
               />
                 <div className="ais-Hits--empty text-center py-12">
                    <Search className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">Aucun résultat trouvé</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Nous n'avons trouvé aucun produit correspondant à votre recherche.
                    </p>
                    <Button asChild className="mt-6">
                        <Link href="/add-product">
                            Soyez le premier à ajouter ce prix
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
      </InstantSearch>
  )
}

export default function SearchPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 max-w-4xl">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <SearchResults />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
