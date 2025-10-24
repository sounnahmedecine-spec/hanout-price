
'use client';

import Image from 'next/image';
import { Award, Rocket, ShieldCheck, Star, Calendar, BarChart2, User as UserIcon, LogIn, LogOut, Globe, ShoppingBasket } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Badge, UserBadge, UserProfile, PriceRecord } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { useUser, useFirestore, useCollection, useMemoFirebase, useAuth } from '@/firebase';
import { doc, collection, query, where, getDoc, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, startOfMonth } from 'date-fns';
import { fr, ar } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from '@/app/i18n/client';
import { cn } from '@/lib/utils';
import { ContributionsChart, type ChartData } from '@/components/contributions-chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Locale } from 'date-fns';
import { useRouter } from 'next/navigation';


const locales: { [key: string]: Locale } = { fr, ar };

// This maps badge IDs/names from Firestore to Lucide icons
const badgeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Super Contributeur': Award,
  'Chasseur de bons plans': Rocket,
  'Explorateur de quartier': ShieldCheck,
};

function BadgeIconDisplay({ userBadge, badgeDefinition }: { userBadge: UserBadge, badgeDefinition: Badge | null }) {
  const { i18n } = useTranslation();
  
  if (!badgeDefinition) {
    return <Skeleton className="h-14 w-14 rounded-full" />;
  }

  const Icon = badgeIcons[badgeDefinition.name] || Star;
  const dateLocale = locales[i18n.language] || fr;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="p-3 bg-secondary rounded-full text-secondary-foreground transition-colors hover:bg-primary/20 hover:text-primary">
            <Icon className="h-8 w-8" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-bold">{badgeDefinition.name}</p>
          <p className="text-sm text-muted-foreground">{badgeDefinition.description}</p>
          {userBadge.dateEarned &&
            <p className="text-xs text-muted-foreground mt-1">Obtenu le {format(userBadge.dateEarned.toDate(), 'd MMMM yyyy', { locale: dateLocale })}</p>
          }
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}


function ProfileSkeleton() {
  return (
    <Card className="overflow-hidden shadow-lg">
      <div className="h-32 bg-primary/20" />
      <CardContent className="p-6 pt-0">
        <div className="flex items-end -mt-16">
          <Skeleton className="h-32 w-32 rounded-full border-4 border-background" />
          <div className="ml-4 mb-2 space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-40" />
          </div>
        </div>
        <Separator className="my-6" />
        <h2 className="font-headline text-xl mb-4 text-center">Statistiques</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  )
}

function UserContributions({ contributions }: { contributions: PriceRecord[] }) {
    const router = useRouter();
    const { t } = useTranslation();

    if (contributions.length === 0) {
        return <p className="text-sm text-muted-foreground text-center py-4">{t('noContributionsYet')}</p>;
    }
    
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>{t('product')}</TableHead>
                    <TableHead>{t('store')}</TableHead>
                    <TableHead className="text-right">{t('price')}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {contributions.map(deal => (
                    <TableRow key={deal.id} onClick={() => router.push(`/prices/${deal.id}`)} className="cursor-pointer">
                        <TableCell className="font-medium flex items-center gap-3">
                           <div className="w-10 h-10 rounded-md bg-muted flex-shrink-0">
                             {deal.imageUrl ? (
                               <Image src={deal.imageUrl} alt={deal.productName} width={40} height={40} className="w-full h-full object-cover rounded-md" />
                             ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                    <ShoppingBasket className="w-5 h-5"/>
                                </div>
                             )}
                           </div>
                           <span>{deal.productName}</span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{deal.storeName}</TableCell>
                        <TableCell className="text-right font-semibold text-primary">{deal.price.toFixed(2)} MAD</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default function ProfilePage() {
  const { user, userProfile, isUserLoading } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const handleSignOut = async () => {
    try {
      if (auth) {
        await signOut(auth);
        router.push('/');
      }
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const userContributionsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'priceRecords'), where('userId', '==', user.uid), orderBy('timestamp', 'desc'));
  }, [firestore, user]);
  const { data: contributions, isLoading: areContributionsLoading } = useCollection<PriceRecord>(userContributionsQuery);
  
  const userBadgesQuery = useMemoFirebase(() => {
      if (!firestore || !user) return null;
      return collection(firestore, 'users', user.uid, 'badges');
  }, [firestore, user]);
  const { data: userBadges, isLoading: areBadgesLoading } = useCollection<UserBadge>(userBadgesQuery);

  const [badgeDefinitions, setBadgeDefinitions] = useState<{ [id: string]: Badge }>({});
  const [areBadgeDefsLoading, setAreBadgeDefsLoading] = useState(true);

  useEffect(() => {
    async function fetchBadgeDefs() {
      if (!firestore || !userBadges) {
        setAreBadgeDefsLoading(userBadges === undefined); // Still loading if userBadges is undefined
        return;
      }
      if (userBadges.length === 0) {
        setAreBadgeDefsLoading(false);
        return;
      }

      const badgePromises = userBadges.map(ub => getDoc(doc(firestore, 'badges', ub.badgeId)));
      const badgeSnaps = await Promise.all(badgePromises);
      const defs = Object.fromEntries(badgeSnaps.filter(s => s.exists()).map(s => [s.id, s.data() as Badge]));
      
      setBadgeDefinitions(defs);
      setAreBadgeDefsLoading(false);
    }
    fetchBadgeDefs();
  }, [firestore, userBadges]);

  const contributionChartData = useMemo(() => {
    if (!contributions) return [];
    
    const contributionsByMonth: { [key: string]: ChartData } = {};

    contributions.forEach(contribution => {
      const monthKey = format(startOfMonth(contribution.timestamp.toDate()), 'yyyy-MM');
      if (!contributionsByMonth[monthKey]) {
        contributionsByMonth[monthKey] = {
          month: format(contribution.timestamp.toDate(), 'MMM yy', { locale: locales[i18n.language] || fr }),
          contributions: 0,
        };
      }
      contributionsByMonth[monthKey].contributions++;
    });

    // Sort chronologically using the 'yyyy-MM' keys
    return Object.keys(contributionsByMonth)
      .sort()
      .map(key => contributionsByMonth[key]);
  }, [contributions, i18n.language]);

  const isLoading = isUserLoading || (user && (areContributionsLoading || areBadgesLoading || areBadgeDefsLoading));

  if (isLoading) {
    return (
       <div className="flex flex-col min-h-screen bg-secondary">
        <main className="flex-grow py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <ProfileSkeleton />
          </div>
        </main>
      </div>
    );
  }

  if (!user || !userProfile) {
     return (
       <div className="flex flex-col min-h-screen bg-secondary">
        <main className="flex-grow py-12 flex items-center justify-center">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <Card>
              <CardHeader>
                <CardTitle>{t('profileNotFound')}</CardTitle>
                 <CardDescription>{t('pleaseSignIn')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/login?redirect=/profile">
                    <LogIn className="mr-2 h-4 w-4" />
                    {t('signIn')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }
  
  const displayName = userProfile.username || userProfile.email;
  const dateLocale = locales[i18n.language] || fr;
  const joinDate = userProfile.createdAt ? format(userProfile.createdAt.toDate(), 'MMMM yyyy', { locale: dateLocale }) : '...';

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="overflow-hidden shadow-lg">
            <div className="h-32 bg-primary/20" />
            <CardContent className="p-6 pt-0">
              <div className="flex flex-col items-center -mt-16">
                <Avatar className="h-32 w-32 border-4 border-background">
                  <AvatarImage src={userProfile.profilePictureUrl} alt={displayName} />
                  <AvatarFallback>
                    <UserIcon className="h-16 w-16 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <div className="mt-4 text-center">
                  <h1 className="text-3xl font-bold font-headline">{displayName}</h1>
                  <div className="flex items-center justify-center text-muted-foreground text-sm mt-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{t('memberSince', { date: joinDate })}</span>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />
              
                {/* Stats */}
                <h2 className="font-headline text-xl mb-4 text-center">{t('stats')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('contributions')}</CardTitle>
                        <BarChart2 className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{contributions?.length ?? 0}</div>
                      </CardContent>
                    </Card>
                    <Card>
                       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('points')}</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{userProfile.points ?? 0}</div>
                      </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t('badges')}</CardTitle>
                            <Award className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{userBadges?.length ?? 0}</div>
                      </CardContent>
                    </Card>
                </div>
                
                {contributions && contributions.length > 0 && (
                  <>
                    <Separator className="my-6" />
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle>{t('contributionActivity')}</CardTitle>
                            <CardDescription>{t('contributionActivityDescription')}</CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                           <ContributionsChart data={contributionChartData} />
                        </CardContent>
                    </Card>
                  </>
                )}


              <Separator className="my-6" />

              {/* Recent Contributions */}
              <div>
                  <h2 className="font-headline text-xl mb-4 text-center">{t('myRecentContributions')}</h2>
                   <Card>
                      <CardContent className="p-0">
                         {contributions ? <UserContributions contributions={contributions} /> : <Skeleton className="h-40 w-full" />}
                      </CardContent>
                  </Card>
              </div>

              <Separator className="my-6" />

                {/* Badges */}
                <div>
                  <h2 className="font-headline text-xl mb-4 text-center">{t('badges')}</h2>
                  <Card>
                    <CardContent className="p-4">
                      {userBadges && userBadges.length > 0 ? (
                        <div className="flex flex-wrap gap-4 justify-center">
                           {userBadges.map((badge) => (
                              <BadgeIconDisplay key={badge.id} userBadge={badge} badgeDefinition={badgeDefinitions[badge.badgeId]} />
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm text-center">
                          {t('earnBadges')}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              

              <Separator className="my-6" />
              
                <div className="flex justify-center">
                    <Button variant="ghost" onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" /> {t('signOut')}
                    </Button>
                </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
