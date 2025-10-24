
'use client';

import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUser, useFirestore } from '@/firebase';
import { PriceRecord } from '@/lib/types';
import { doc, runTransaction, arrayUnion, arrayRemove, increment, getDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface VoteButtonsProps {
  priceRecord: PriceRecord;
  className?: string;
}

export default function VoteButtons({ priceRecord, className }: VoteButtonsProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Connexion requise',
        description: 'Vous devez être connecté pour voter.',
      });
      return;
    }

    const priceRecordRef = doc(firestore, 'priceRecords', priceRecord.id);

    try {
      await runTransaction(firestore, async (transaction) => {
        const freshRecordSnap = await transaction.get(priceRecordRef);
        if (!freshRecordSnap.exists()) {
          throw 'Ce document n\'existe pas !';
        }
        const freshRecord = freshRecordSnap.data() as PriceRecord;
        const userId = user.uid;

        const hasUpvoted = freshRecord.upvotedBy?.includes(userId);
        const hasDownvoted = freshRecord.downvotedBy?.includes(userId);

        let upvotesChange = 0;
        let downvotesChange = 0;
        
        let upvotedByUpdate = {};
        let downvotedByUpdate = {};

        if (voteType === 'upvote') {
          if (hasUpvoted) { // User is retracting their upvote
            upvotesChange = -1;
            upvotedByUpdate = { upvotedBy: arrayRemove(userId) };
          } else { // New upvote
            upvotesChange = 1;
            upvotedByUpdate = { upvotedBy: arrayUnion(userId) };
            if (hasDownvoted) { // Was previously downvoted, remove downvote
              downvotesChange = -1;
              downvotedByUpdate = { downvotedBy: arrayRemove(userId) };
            }
          }
        } else if (voteType === 'downvote') {
          if (hasDownvoted) { // User is retracting their downvote
            downvotesChange = -1;
            downvotedByUpdate = { downvotedBy: arrayRemove(userId) };
          } else { // New downvote
            downvotesChange = 1;
            downvotedByUpdate = { downvotedBy: arrayUnion(userId) };
            if (hasUpvoted) { // Was previously upvoted, remove upvote
              upvotesChange = -1;
              upvotedByUpdate = { upvotedBy: arrayRemove(userId) };
            }
          }
        }
        
        const updateData: any = {
            ...upvotedByUpdate,
            ...downvotedByUpdate,
        };
        
        if (upvotesChange !== 0) updateData.upvotes = increment(upvotesChange);
        if (downvotesChange !== 0) updateData.downvotes = increment(downvotesChange);

        transaction.update(priceRecordRef, updateData);
      });
    } catch (error) {
      console.error('Erreur lors du vote :', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Une erreur est survenue lors du vote.',
      });
    }
  };

  const userUpvoted = user && priceRecord.upvotedBy?.includes(user.uid);
  const userDownvoted = user && priceRecord.downvotedBy?.includes(user.uid);
  const score = (priceRecord.upvotes || 0) - (priceRecord.downvotes || 0);

  return (
    <div className={cn('flex items-center gap-2 text-muted-foreground', className)}>
      <Button
        variant="ghost"
        size="sm"
        className={cn('flex items-center gap-1', userUpvoted && 'text-green-500')}
        onClick={() => handleVote('upvote')}
        disabled={!user}
      >
        <ThumbsUp 
          className="h-4 w-4" 
          fill={userUpvoted ? 'currentColor' : 'none'} 
        />
        <span className="text-xs">{priceRecord.upvotes || 0}</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn('flex items-center gap-1', userDownvoted && 'text-red-500')}
        onClick={() => handleVote('downvote')}
        disabled={!user}
      >
        <ThumbsDown 
          className="h-4 w-4" 
          fill={userDownvoted ? 'currentColor' : 'none'} 
        />
         <span className="text-xs">{priceRecord.downvotes || 0}</span>
      </Button>
       <span className={cn(
           'text-sm font-bold',
            score > 0 ? 'text-green-600' : score < 0 ? 'text-red-600' : 'text-muted-foreground'
       )}>
        ({score > 0 ? '+' : ''}{score})
      </span>
    </div>
  );
}
