'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ScanLine, Share2, Banknote, ArrowRight } from 'lucide-react';

function LandingPageContent() {
  return (
    <div className="relative flex flex-col h-screen w-full text-foreground overflow-hidden bg-background">
      <div className="relative z-10 flex flex-col h-full p-8">
        <header className="w-full flex justify-center py-4">
          <Image
            src="https://res.cloudinary.com/db2ljqpdt/image/upload/v1760319434/Logo_moderne__Hanout_Price__tlhl4w_skaxpt.png"
            alt="Hanout Price Logo"
            width={200}
            height={50}
            priority
          />
        </header>

        <div className="flex-1 flex items-center justify-center min-h-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-contain">
            <source src="https://res.cloudinary.com/db2ljqpdt/video/upload/v1760306093/Generated_File_October_12_2025_-_10_53PM_ytnxhz.mp4" type="video/mp4" />
            Votre navigateur ne supporte pas la vidéo.
          </video>
        </div>

        <main className="flex flex-col items-center justify-center text-center py-8">
          <p className="max-w-xl text-lg md:text-xl mb-8">
            Votre guide communautaire pour trouver les meilleurs prix dans les hanouts du Maroc.
          </p>
          <div className="grid grid-cols-3 gap-4 md:gap-8 mb-8 max-w-2xl w-full">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="p-3 bg-primary/10 text-primary rounded-full">
                <ScanLine className="h-7 w-7 md:h-8 md:w-8" />
              </div>
              <h3 className="font-semibold md:text-lg">Scannez</h3>
              <p className="text-xs md:text-sm text-muted-foreground">Prenez en photo un produit ou scannez son code-barres.</p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="p-3 bg-primary/10 text-primary rounded-full">
                <Share2 className="h-7 w-7 md:h-8 md:w-8" />
              </div>
              <h3 className="font-semibold md:text-lg">Partagez</h3>
              <p className="text-xs md:text-sm text-muted-foreground">Ajoutez le prix et le nom du magasin en quelques secondes.</p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="p-3 bg-primary/10 text-primary rounded-full">
                <Banknote className="h-7 w-7 md:h-8 md:w-8" />
              </div>
              <h3 className="font-semibold md:text-lg">Économisez</h3>
              <p className="text-xs md:text-sm text-muted-foreground">Aidez la communauté et trouvez les meilleures offres près de chez vous.</p>
            </div>
          </div>
          <Button asChild size="lg" className="font-bold text-lg animate-pulse">
            <Link href="/dashboard">
              Explorer les offres
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </main>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
    return (
        <div className="flex flex-col h-screen w-full items-center justify-center bg-background">
            <Skeleton className="h-16 w-64 mb-4" />
            <Skeleton className="h-8 w-96 mb-8" />
            <Skeleton className="h-12 w-48" />
        </div>
    );
}

export default function LandingPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  if (isUserLoading || user) {
    return <LoadingSkeleton />;
  }

  return <LandingPageContent />;
}
