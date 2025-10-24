'use client';

import { useState, useEffect, FormEvent } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { Send, Loader2, MessageSquare } from 'lucide-react';

import { firestore, useUser } from '@/firebase';
import { Comment } from '@/lib/types';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

interface CommentSectionProps {
    priceRecordId: string;
}

export default function CommentSection({ priceRecordId }: CommentSectionProps) {
    const { user, userProfile } = useUser();
    const { toast } = useToast();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const commentsRef = collection(firestore, 'price_records', priceRecordId, 'comments');
        const q = query(commentsRef, orderBy('createdAt', 'asc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedComments: Comment[] = [];
            querySnapshot.forEach((doc) => {
                fetchedComments.push({ id: doc.id, ...doc.data() } as Comment);
            });
            setComments(fetchedComments);
        });

        return () => unsubscribe();
    }, [priceRecordId]);

    const handleSubmitComment = async (e: FormEvent) => {
        e.preventDefault();
        if (!user || !userProfile || !newComment.trim()) return;

        setLoading(true);
        try {
            const commentsRef = collection(firestore, 'price_records', priceRecordId, 'comments');
            await addDoc(commentsRef, {
                text: newComment,
                userId: user.uid,
                username: userProfile.username,
                userAvatar: userProfile.profilePictureUrl,
                createdAt: serverTimestamp(),
            });
            setNewComment('');
        } catch (error) {
            console.error("Erreur d'ajout de commentaire:", error);
            toast({ variant: 'destructive', title: 'Erreur lors de l\'envoi du commentaire.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center"><MessageSquare className="mr-2 h-5 w-5" /> Commentaires ({comments.length})</h3>
            <div className="space-y-4">
                {comments.map(comment => (
                    <div key={comment.id} className="flex items-start gap-3">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={comment.userAvatar} alt={comment.username} />
                            <AvatarFallback>{comment.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg p-3 flex-1">
                            <p className="font-semibold text-sm">{comment.username}</p>
                            <p className="text-sm">{comment.text}</p>
                        </div>
                    </div>
                ))}
            </div>
            {user && (
                <form onSubmit={handleSubmitComment} className="flex items-start gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={userProfile?.profilePictureUrl} />
                        <AvatarFallback>{userProfile?.username?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                        <Textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Ajouter un commentaire..." />
                        <Button type="submit" size="sm" disabled={loading || !newComment.trim()}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Envoyer
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}