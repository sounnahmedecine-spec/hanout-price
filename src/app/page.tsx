'use client';

import { InstantSearch, SearchBox, Hits, Configure } from 'react-instantsearch-hooks-web';
import { Search as SearchIcon } from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { searchClient } from '@/lib/algolia';
import Hit from '@/components/Hit';

function SearchPage() {
    if (!searchClient.appId) {
        return (
            <div className="text-center text-red-500 py-10">
                La recherche n&apos;est pas disponible car les clés Algolia ne sont pas configurées.
            </div>
        );
    }

    return (
        <InstantSearch searchClient={searchClient} indexName="price_records" initialUiState={{ configure: { hitsPerPage: 15 } }}>
            {/* <Configure hitsPerPage={15} /> */}
            <div className="max-w-3xl mx-auto">
                <div className="sticky top-16 bg-background/80 backdrop-blur-sm z-10 py-4">
                    <SearchBox
                        placeholder="Rechercher un produit, un magasin..."
                        classNames={{
                            root: 'relative',
                            input: 'w-full h-12 pl-12 pr-4 rounded-full border shadow-sm focus:ring-2 focus:ring-primary focus:outline-none',
                            submitIcon: 'absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground',
                            resetIcon: 'hidden',
                        }}
                        submitIconComponent={() => <SearchIcon />}
                    />
                </div>
                <div className="mt-6">
                    <Hits hitComponent={Hit} classNames={{ list: 'space-y-4' }} />
                </div>
            </div>
        </InstantSearch>
    );
}

export default function Search() {
    return (
        <div className="flex flex-col min-h-screen bg-grayLight">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <SearchPage />
            </main>
            <Footer />
        </div>
    );
}