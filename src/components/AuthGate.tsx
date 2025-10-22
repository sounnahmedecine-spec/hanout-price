'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function LoadingSkeleton() {
    return (
        <div className="flex flex-col h-screen w-full items-center justify-center bg-background p-8">
            <Skeleton className="h-12 w-1/2 mb-4" />
            <Skeleton className="h-8 w-3/4 mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
            </div>
        </div>
    );
}

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return <LoadingSkeleton />;
  }

  if (user) {
    return <>{children}</>;
  }

  // This will be briefly visible before the redirect kicks in.
  // A loading screen is better to avoid flashing content.
  return <LoadingSkeleton />;
}
