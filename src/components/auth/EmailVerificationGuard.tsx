'use client';

import { useState, type ReactNode } from 'react';
import { useAuth, useUser } from 'reactfire';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, MailCheck } from 'lucide-react';

export function EmailVerificationGuard({ children }: { children: ReactNode }) {
  const { data: user } = useUser();
  const auth = useAuth();
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleResendVerification = async () => {
    if (!user) return;
    setIsSending(true);
    try {
      await sendEmailVerification(user);
      toast({
        title: 'E-mail de vérification envoyé',
        description: `Un nouvel e-mail a été envoyé à ${user.email}.`,
      });
    } catch (error) {
      console.error('Error resending verification email:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: "Une erreur est survenue lors de l'envoi de l'e-mail.",
      });
    } finally {
      setIsSending(false);
    }
  };

  if (user && user.emailVerified) {
    return <>{children}</>;
  }

  return (
    <div className="container mx-auto mt-8 max-w-2xl px-4">
      <Card className="text-center">
        <CardHeader>
          <MailCheck className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="mt-4 text-2xl font-headline">Vérifiez votre adresse e-mail</CardTitle>
          <CardDescription>
            Un lien de vérification a été envoyé à <strong>{user?.email}</strong>. Veuillez cliquer dessus pour activer votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleResendVerification} disabled={isSending}>
            {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Renvoyer l'e-mail de vérification
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => signOut(auth)}>Se déconnecter</Button>
        </CardFooter>
      </Card>
    </div>
  );
}