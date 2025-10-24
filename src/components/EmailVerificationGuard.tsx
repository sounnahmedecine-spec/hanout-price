"use client";

import { useUser } from 'reactfire';
import { sendEmailVerification } from 'firebase/auth';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface EmailVerificationGuardProps {
  children: React.ReactNode;
}

export function EmailVerificationGuard({ children }: EmailVerificationGuardProps) {
  const { data: user } = useUser();
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResendEmail = async () => {
    if (!user) return;
    setIsSending(true);
    try {
      await sendEmailVerification(user);
      setEmailSent(true);
    } catch (error) {
      console.error("Erreur lors du renvoi de l'e-mail de vérification:", error);
    } finally {
      setIsSending(false);
    }
  };

  if (user && !user.emailVerified) {
    return (
      <div className="container mx-auto px-4 max-w-2xl mt-8">
        <Card className="text-center">
          <CardHeader>
            <CardTitle>Veuillez vérifier votre adresse e-mail</CardTitle>
            <CardDescription>
              Pour accéder à cette fonctionnalité, vous devez d&apos;abord vérifier votre adresse e-mail. Un lien de vérification a été envoyé à <strong>{user.email}</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleResendEmail} disabled={isSending || emailSent}>
              {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {emailSent ? 'E-mail renvoyé !' : 'Renvoyer l\'e-mail de vérification'}
            </Button>
            <p className="text-xs text-muted-foreground mt-4">Si vous ne voyez pas l&apos;e-mail, vérifiez votre dossier de courrier indésirable.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}