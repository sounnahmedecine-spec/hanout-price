import Link from 'next/link';
import Image from 'next/image';
import { Highlight } from 'react-instantsearch-hooks-web';
import { Hit as AlgoliaHit } from 'instantsearch.js';

import { PriceRecord } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type HitProps = {
    hit: AlgoliaHit<PriceRecord>;
};

export default function Hit({ hit }: HitProps) {
    return (
        <Link href={`/prices/${hit.objectID}`}>
            <Card className="hover:bg-muted/50 transition-colors flex items-center p-3">
                <div className="relative w-16 h-16 rounded-md overflow-hidden mr-4 bg-muted">
                    <Image src={hit.imageUrl || 'https://via.placeholder.com/150'} alt={hit.productName} fill className="object-cover" />
                </div>
                <div className="flex-grow">
                    <h3 className="font-semibold">
                        <Highlight attribute="productName" hit={hit} />
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        <Highlight attribute="shopName" hit={hit} />
                    </p>
                </div>
                <Badge variant="secondary" className="text-md font-semibold">{hit.price.toFixed(2)} MAD</Badge>
            </Card>
        </Link>
    );
}