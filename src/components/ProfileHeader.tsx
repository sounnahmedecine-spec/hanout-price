'use client';

import { User as UserIcon, Award, ShoppingBasket } from 'lucide-react';
import { UserProfile } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

interface ProfileHeaderProps {
    userProfile: UserProfile;
    contributionsCount: number;
}

export default function ProfileHeader({ userProfile, contributionsCount }: ProfileHeaderProps) {
    const fallbackInitial = userProfile.username ? userProfile.username.charAt(0).toUpperCase() : <UserIcon className="h-10 w-10" />;

    return (
        <Card className="overflow-hidden">
            <div className="bg-muted/40 p-8 text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-background shadow-md">
                    <AvatarImage src={userProfile.profilePictureUrl} alt={userProfile.username} />
                    <AvatarFallback className="text-3xl">{fallbackInitial}</AvatarFallback>
                </Avatar>
                <h1 className="text-3xl font-bold">{userProfile.username}</h1>
                <p className="text-muted-foreground">{userProfile.email}</p>
            </div>
            <div className="grid grid-cols-2 divide-x text-center">
                <div className="p-4">
                    <Award className="h-6 w-6 mx-auto text-primary mb-1" />
                    <p className="text-2xl font-bold">{userProfile.points || 0}</p>
                    <p className="text-sm text-muted-foreground">Points</p>
                </div>
                <div className="p-4">
                    <ShoppingBasket className="h-6 w-6 mx-auto text-primary mb-1" />
                    <p className="text-2xl font-bold">{contributionsCount}</p>
                    <p className="text-sm text-muted-foreground">Contributions</p>
                </div>
            </div>
        </Card>
    );
}