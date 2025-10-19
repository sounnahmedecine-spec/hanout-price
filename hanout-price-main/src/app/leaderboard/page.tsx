'use client';

import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { UserProfile } from '@/lib/types';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Trophy, AlertTriangle, LogIn } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/app/i18n/client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function LeaderboardSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                 <div key={i} className="flex items-center gap-4 p-3 bg-card rounded-lg">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-6 w-12" />
                </div>
            ))}
        </div>
    )
}

function getRankColor(rank: number) {
    if (rank === 0) return 'text-yellow-400';
    if (rank === 1) return 'text-slate-400';
    if (rank === 2) return 'text-yellow-600';
    return 'text-muted-foreground';
}

function LoggedOutLeaderboard() {
    const { t } = useTranslation();
    return (
        <Card className="text-center">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Classement des contributeurs</CardTitle>
                <CardDescription>Connectez-vous pour voir qui sont les meilleurs chasseurs de bons plans !</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                <Link href="/login?redirect=/leaderboard">
                    <LogIn className="mr-2 h-4 w-4" />
                    {t('signIn')}
                </Link>
                </Button>
            </CardContent>
        </Card>
    );
}


export default function LeaderboardPage() {
    const firestore = useFirestore();
    const { user, isUserLoading } = useUser();
    const { t } = useTranslation();

    const usersQuery = useMemoFirebase(() => {
        // Run the query only if the user is logged in
        if (!firestore || !user) return null;
        return query(collection(firestore, 'users'), orderBy('points', 'desc'), limit(100));
    }, [firestore, user]);

    const { data: users, isLoading: areUsersLoading, error } = useCollection<UserProfile>(usersQuery);
    
    const isLoading = isUserLoading || (!!user && areUsersLoading);

    const renderContent = () => {
        if (isLoading) {
            return <LeaderboardSkeleton />;
        }
        
        // If not logged in, show the prompt to sign in
        if (!user) {
            return <LoggedOutLeaderboard />;
        }

        if (error) {
            return (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Erreur de chargement</AlertTitle>
                    <AlertDescription>
                        Impossible de charger le classement. Il est possible que vous n'ayez pas la permission de voir ces données. Veuillez réessayer plus tard.
                    </AlertDescription>
                </Alert>
            );
        }

        if (users && users.length > 0) {
            return (
                <Card>
                    <CardHeader className="text-center">
                        <Trophy className="mx-auto h-12 w-12 text-primary mb-2" />
                        <CardTitle className="font-headline text-3xl">{t('leaderboard')}</CardTitle>
                        <CardDescription>{t('leaderboardDescription')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {users.map((user, index) => (
                                <div key={user.id} className="flex items-center gap-4 p-3 bg-secondary/50 rounded-lg transition-all hover:bg-secondary">
                                    <span className={cn("text-lg font-bold w-8 text-center", getRankColor(index))}>
                                        {index < 3 ? <Trophy className="h-6 w-6 mx-auto" fill="currentColor"/> : index + 1}
                                    </span>
                                    <Avatar>
                                        <AvatarImage src={user.profilePictureUrl} alt={user.username}/>
                                        <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="font-semibold">{user.username || t('anonymousUser')}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-primary text-lg">{user.points || 0}</p>
                                        <p className="text-xs text-muted-foreground">{t('pointsUnit')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                   </CardContent>
                </Card>
            );
        }

        return (
             <p className="text-center text-muted-foreground py-8">
                {t('emptyLeaderboard')}
            </p>
        );
    };

    return (
        <div className="flex flex-col min-h-screen bg-secondary">
            <main className="flex-grow py-8">
                <div className="container mx-auto px-4 max-w-2xl">
                   {renderContent()}
                </div>
            </main>
        </div>
    );
}
