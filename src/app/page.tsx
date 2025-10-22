import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ScanLine } from "lucide-react";
import Link from "next/link";

// Le composant HomePage doit être exporté par défaut pour être reconnu comme une page
export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <Card className="w-full max-w-md text-center mx-4">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Hanout Price</CardTitle>
          <CardDescription>
            Scannez • Comparez • Économisez
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Bienvenue ! Trouvez les meilleurs prix près de chez vous.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/search">
                <Search className="mr-2 h-5 w-5" />
                Rechercher un produit
              </Link>
            </Button>
            {/* Note: Le lien "/scan" est un placeholder pour une future page de scan */}
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/scan">
                <ScanLine className="mr-2 h-5 w-5" />
                Scanner un code-barres
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}