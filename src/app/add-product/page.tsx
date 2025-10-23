'use client';

import { type ComponentProps } from 'react';
import Link from 'next/link';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from 'reactfire';
import AddProductFlow from '@/components/add-product-flow';
import { Skeleton } from '@/components/ui/skeleton'; 
import { noSsr } from '@/components/dynamic-no-ssr';
// import { EmailVerificationGuard } from '@/components/auth/EmailVerificationGuard';

// ----------------------------------------------------------
// 🔸 État non connecté
// ----------------------------------------------------------
function LoggedOutAddProduct() {
  return (
    <div className="container mx-auto mt-8 max-w-2xl px-4">
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Connectez-vous pour contribuer</CardTitle>
          <CardDescription>Créez un compte pour ajouter des prix.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-center gap-4 sm:flex-row">
          <AuthLinkButton href="/login?redirect=/add-product">
            <LogIn className="mr-2 h-4 w-4" />
            Se connecter
          </AuthLinkButton>
          <AuthLinkButton href="/register?redirect=/add-product" variant="secondary">
            Créer un compte
          </AuthLinkButton>
        </CardContent>
      </Card>
    </div>
  );
}

// Composant de bouton réutilisable pour les liens d'authentification
function AuthLinkButton({ href, variant, children }: { href: string; variant?: ComponentProps<typeof Button>['variant']; children: React.ReactNode }) {
    return (
        <Button asChild variant={variant}><Link href={href}>{children}</Link></Button>
    );
}

// ----------------------------------------------------------
// ✅ Composant principal
// ----------------------------------------------------------
function AddProductPageContent() {
  const { status, data: user } = useUser();

  if (status === 'loading') return <AddProductSkeleton />;
  if (!user) return <LoggedOutAddProduct />;
  return (
    // <EmailVerificationGuard>
      <AddProductFlow />
    // </EmailVerificationGuard>
  );
}

export default noSsr(() => Promise.resolve({ default: AddProductPageContent }));

// ----------------------------------------------------------
// 🔸 Loader squelette
// ----------------------------------------------------------
function AddProductSkeleton() {
  return (
    <div className="container mx-auto max-w-2xl px-4">
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