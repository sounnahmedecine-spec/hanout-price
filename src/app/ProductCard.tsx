'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { doc, runTransaction, increment } from 'firebase/firestore'; // Changed from 'db' to 'firestore'
import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react'; // Changed from 'db' to 'firestore'

import { PriceRecord } from '@/lib/types';
import { firestore, useUser } from '@/firebase'; // Changed 'db' to 'firestore'
import { cn } from '@/lib/utils';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

interface ProductCardProps {
    product: PriceRecord;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { user } = useUser();
    const { toast } = useToast();
    const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null);
    const [isVoting, setIsVoting] = useState(false);

    const handleVote = async (voteType: 'up' | 'down') => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Connectez-vous pour voter.' });
            return;
        }
        if (user.uid === product.userId) {
            toast({ variant: 'destructive', title: 'Vous ne pouvez pas voter pour votre propre contribution.' });
            return;
        }
        if (voteStatus) {
            toast({ title: 'Vous avez déjà voté.' });
            return;
        }

        setIsVoting(true);
        const priceRecordRef = doc(firestore, 'price_records', product.id);

        try {
            await runTransaction(firestore, async (transaction) => {
                // Note: This is a simplified client-side implementation.
                // For a production app, this logic should be in a Cloud Function
                // to securely update user points and prevent multiple votes.
                const fieldToIncrement = voteType === 'up' ? 'upvotes' : 'downvotes';
                transaction.update(priceRecordRef, { [fieldToIncrement]: increment(1) });
            });

            setVoteStatus(voteType);
            toast({ title: 'Merci pour votre vote !' });
        } catch (error) {
            console.error('Erreur de vote:', error);
            toast({ variant: 'destructive', title: 'Erreur lors du vote.' });
        } finally {
            setIsVoting(false);
        }
    };

    const netVotes = (product.upvotes || 0) - (product.downvotes || 0);

    return (
        <Card className="flex flex-col h-full overflow-hidden transition-shadow hover:shadow-lg">
            <Link href={`/prices/${product.id}`} className="block">
                <div className="relative h-48 w-full bg-muted">
                    <Image
                        src={product.imageUrl || 'https://via.placeholder.com/300x200?text=Pas+d\'image'}
                        alt={product.productName}
                        fill
                        className="object-cover"
                    />
                </div>
            </Link>
            <CardContent className="p-4 flex-grow">
                <CardTitle className="text-lg font-bold truncate" title={product.productName}>
                    <Link href={`/prices/${product.id}`}>{product.productName}</Link>
                </CardTitle>
                <p className="text-sm text-muted-foreground">{product.shopName}</p>
            </CardContent>
            <CardFooter className="p-4 bg-muted/50 flex justify-between items-center">
                <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleVote('up')} disabled={isVoting || !!voteStatus} className={cn(voteStatus === 'up' && 'bg-green-100 text-green-700')}>
                        <ThumbsUp className="h-4 w-4 mr-2" /> {product.upvotes || 0}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleVote('down')} disabled={isVoting || !!voteStatus} className={cn(voteStatus === 'down' && 'bg-red-100 text-red-700')}>
                        <ThumbsDown className="h-4 w-4 mr-2" /> {product.downvotes || 0}
                    </Button>
                </div>
                <Badge variant="secondary" className="text-lg font-semibold">
                    {product.price.toFixed(2)} MAD
                </Badge>
            </CardFooter>
        </Card>
    );
}