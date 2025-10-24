'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PriceRecord } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ContributionsListProps {
    contributions: PriceRecord[];
}

export default function ContributionsList({ contributions }: ContributionsListProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Mes Contributions</h2>
            {contributions.length > 0 ? (
                contributions.map(item => (
                    <Link href={`/prices/${item.id}`} key={item.id}>
                        <Card className="hover:bg-muted/50 transition-colors flex items-center">
                            <CardContent className="p-4 flex-grow">
                                <div className="flex items-center gap-4">
                                    {item.imageUrl && <Image src={item.imageUrl} alt={item.productName} width={64} height={64} className="rounded-md object-cover" />}
                                    <div>
                                        <p className="font-semibold">{item.productName}</p>
                                        <p className="text-sm text-muted-foreground">{item.shopName}</p>
                                    </div>
                                </div>
                            </CardContent>
                            <div className="p-4 text-right">
                                <Badge variant="secondary" className="text-lg">{item.price.toFixed(2)} MAD</Badge>
                            </div>
                        </Card>
                    </Link>
                ))
            ) : (
                <p className="text-muted-foreground text-center py-8">Vous n&apos;avez pas encore contribué.</p>
            )}
        </div>
    );
}