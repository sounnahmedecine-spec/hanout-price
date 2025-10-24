'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Crown, Loader2, User as UserIcon } from 'lucide-react'; 

import { firestore } from '@/firebase';
import { UserProfile } from '@/lib/types';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface RankedUser extends UserProfile {
    id: string;
    rank: number;
}

function getRankColor(rank: number): string {
    if (rank === 1) return 'bg-yellow-400 text-yellow-900 hover:bg-yellow-400';
    if (rank === 2) return 'bg-gray-300 text-gray-800 hover:bg-gray-300';
    if (rank === 3) return 'bg-yellow-600 text-yellow-100 hover:bg-yellow-600';
    return 'bg-muted text-muted-foreground';
}

export default function LeaderboardList() {
    const [users, setUsers] = useState<RankedUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const q = query(collection(firestore, 'users'), orderBy('points', 'desc'), limit(20));
                const querySnapshot = await getDocs(q);
                const rankedUsers = querySnapshot.docs.map((doc, index) => ({
                    id: doc.id,
                    rank: index + 1,
                    ...doc.data()
                } as RankedUser));
                setUsers(rankedUsers);
            } catch (error) {
                console.error("Erreur de chargement du classement:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (loading) {
        return (
            <div className="space-y-3">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {users.map((user) => (
                <Card key={user.id} className="flex items-center p-4 transition-transform hover:scale-[1.02]">
                    <div className="flex items-center gap-4 flex-grow">
                        <Badge className={`text-lg font-bold w-10 h-10 flex items-center justify-center rounded-full ${getRankColor(user.rank)}`}>
                            {user.rank <= 3 ? <Crown className="w-5 h-5" /> : user.rank}
                        </Badge>
                        <Avatar>
                            <AvatarImage src={user.profilePictureUrl} alt={user.username} />
                            <AvatarFallback>{user.username?.charAt(0).toUpperCase() || <UserIcon />}</AvatarFallback>
                        </Avatar>
                        <p className="font-semibold text-lg">{user.username}</p>
                    </div>
                    <Badge variant="secondary" className="text-lg">{user.points || 0} pts</Badge>
                </Card>
            ))}
        </div>
    );
}