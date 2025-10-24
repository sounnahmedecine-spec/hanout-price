
'use client';

import { useDoc, useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { PriceRecord, Comment } from '@/lib/types';
import { doc, collection, query, orderBy } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShoppingBasket, MessageCircle, Send, User as UserIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import VoteButtons from '@/components/vote-buttons';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { addDoc, serverTimestamp } from 'firebase/firestore';

function PriceRecordSkeleton() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Skeleton className="w-16 h-16 rounded-lg" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center">
                    <Skeleton className="h-10 w-28" />
                    <Skeleton className="h-10 w-36" />
                </div>
            </CardContent>
        </Card>
    )
}

function CommentList({ priceRecordId }: { priceRecordId: string }) {
    const firestore = useFirestore();
    const commentsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'priceRecords', priceRecordId, 'comments'), orderBy('timestamp', 'desc'));
    }, [firestore, priceRecordId]);

    const { data: comments, isLoading } = useCollection<Comment>(commentsQuery);
    
    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                         <Skeleton className="h-4 w-full" />
                         <Skeleton className="h-4 w-2/3" />
                    </div>
                </div>
                 <div className="flex gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                         <Skeleton className="h-4 w-full" />
                         <Skeleton className="h-4 w-2/3" />
                    </div>
                </div>
            </div>
        )
    }

    if (!comments || comments.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="mx-auto h-8 w-8 mb-2" />
                <p className="text-sm">Aucun commentaire pour l'instant.</p>
                <p className="text-sm">Soyez le premier à réagir !</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {comments.map(comment => (
                <div key={comment.id} className="flex gap-3">
                    <Avatar>
                        <AvatarImage src={comment.userProfilePictureUrl} />
                        <AvatarFallback>
                            <UserIcon className="h-5 w-5" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm">{comment.username}</p>
                            <p className="text-xs text-muted-foreground">
                                {comment.timestamp ? formatDistanceToNow(comment.timestamp.toDate(), { addSuffix: true, locale: fr }) : ''}
                            </p>
                        </div>
                        <p className="text-sm text-foreground/90 mt-1">{comment.text}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default function PriceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const firestore = useFirestore();
    const { user, userProfile } = useUser();
    const { toast } = useToast();
    
    const [newComment, setNewComment] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    const priceRecordId = params.id as string;

    const priceRecordRef = useMemoFirebase(() => {
        if (!firestore || !priceRecordId) return null;
        return doc(firestore, 'priceRecords', priceRecordId);
    }, [firestore, priceRecordId]);

    const { data: priceRecord, isLoading, error } = useDoc<PriceRecord>(priceRecordRef);
    
    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !userProfile || !firestore || !newComment.trim()) return;

        setIsSubmittingComment(true);
        const commentsCollectionRef = collection(firestore, 'priceRecords', priceRecordId, 'comments');
        
        try {
            await addDoc(commentsCollectionRef, {
                text: newComment,
                userId: user.uid,
                username: userProfile.username,
                userProfilePictureUrl: userProfile.profilePictureUrl,
                priceRecordId: priceRecordId,
                timestamp: serverTimestamp(),
            });
            setNewComment('');
            toast({ title: "Commentaire ajouté !", description: "Merci pour votre contribution." });
        } catch (error) {
            console.error("Error adding comment: ", error);
            toast({ variant: 'destructive', title: "Erreur", description: "Impossible d'ajouter le commentaire." });
        } finally {
            setIsSubmittingComment(false);
        }
    };


    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen bg-secondary">
                <main className="flex-grow py-8">
                    <div className="container mx-auto px-4 max-w-2xl">
                         <PriceRecordSkeleton />
                    </div>
                </main>
            </div>
        )
    }

    if (!priceRecord) {
        return (
            <div className="flex flex-col min-h-screen bg-secondary">
                <main className="flex-grow py-8 flex items-center">
                    <div className="container mx-auto px-4 max-w-2xl text-center">
                         <Card>
                            <CardHeader>
                                <CardTitle>Oups !</CardTitle>
                                <CardDescription>Cet enregistrement de prix n'a pas pu être trouvé.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button asChild>
                                    <Link href="/dashboard">Retour au tableau de bord</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-secondary">
            <main className="flex-grow py-8">
                <div className="container mx-auto px-4 max-w-2xl space-y-6">
                    <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour
                    </Button>
                    <Card>
                         <CardHeader>
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0 flex items-center justify-center">
                                    {priceRecord.imageUrl ? (
                                        <Image src={priceRecord.imageUrl} alt={priceRecord.productName} width={64} height={64} className="w-full h-full object-cover rounded-lg" />
                                    ) : (
                                        <ShoppingBasket className="w-8 h-8 text-muted-foreground"/>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <CardTitle className="font-headline text-2xl">{priceRecord.productName}</CardTitle>
                                    <CardDescription>Trouvé chez {priceRecord.storeName}</CardDescription>
                                     <p className="text-xs text-muted-foreground mt-1">
                                        {priceRecord.timestamp ? `Ajouté ${formatDistanceToNow(priceRecord.timestamp.toDate(), { addSuffix: true, locale: fr })}` : ''}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center">
                                <p className="text-3xl font-bold text-accent">{priceRecord.price.toFixed(2)} MAD</p>
                                <VoteButtons priceRecord={priceRecord} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-xl">Commentaires</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CommentList priceRecordId={priceRecord.id} />
                        </CardContent>
                        {user && (
                        <CardFooter>
                           <form onSubmit={handleCommentSubmit} className="w-full flex items-start gap-3">
                                <Avatar className="mt-1">
                                    <AvatarImage src={userProfile?.profilePictureUrl} />
                                    <AvatarFallback><UserIcon className="h-5 w-5" /></AvatarFallback>
                                </Avatar>
                                <div className="flex-1 relative">
                                    <Textarea
                                        placeholder="Écrire un commentaire..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        className="pr-12"
                                        rows={1}
                                        disabled={isSubmittingComment}
                                        onFocus={(e) => e.target.rows = 3}
                                        onBlur={(e) => { if(!e.target.value) e.target.rows = 1} }
                                    />
                                    <Button type="submit" size="icon" className="absolute right-2 top-2 h-8 w-8" disabled={!newComment.trim() || isSubmittingComment}>
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                           </form>
                        </CardFooter>
                         )}
                    </Card>
                </div>
            </main>
        </div>
    );
}
