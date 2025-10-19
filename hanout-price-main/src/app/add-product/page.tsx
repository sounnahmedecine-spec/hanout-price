'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useUser } from '@/firebase';
import AddProductFlow from '@/components/add-product-flow';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { LogIn } from 'lucide-react';

// ----------------------------------------------------------
// ✅ Composant principal
// ----------------------------------------------------------
export default function AddProductPage() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) return <AddProductSkeleton />;
  if (!user) return <LoggedOutAddProduct />;
  return <AddProductFlow />;
}

// ----------------------------------------------------------
// 🔸 État non connecté
// ----------------------------------------------------------
function LoggedOutAddProduct() {
  return (
    <div className="container mx-auto px-4 max-w-2xl mt-8">
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Connectez-vous pour contribuer</CardTitle>
          <CardDescription>Créez un compte pour ajouter des prix.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/login?redirect=/add-product">
              <LogIn className="mr-2 h-4 w-4" />
              Se connecter
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/register?redirect=/add-product">Créer un compte</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ----------------------------------------------------------
// 🔸 Loader squelette
// ----------------------------------------------------------
function AddProductSkeleton() {
  return (
    <div className="container mx-auto px-4 max-w-2xl">
      <Skeleton className="h-8 w-24 mb-4" />
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full mt-2" />
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}