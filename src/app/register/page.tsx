"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useAuth } from "reactfire";

import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { noSsr } from "@/components/dynamic-no-ssr";

const formSchema = z.object({
  username: z.string().min(2, { message: "Le nom d'utilisateur doit faire au moins 2 caractères." }),
  email: z.string().email({ message: "Veuillez entrer une adresse e-mail valide." }),
  password: z.string().min(6, { message: "Le mot de passe doit faire au moins 6 caractères." }),
});

function RegisterPageContent() {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setFirebaseError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      // Mettre à jour le profil avec le nom d'utilisateur
      await updateProfile(user, { displayName: values.username });

      // Envoyer l'e-mail de vérification
      await sendEmailVerification(user);

      setIsSuccess(true);
    } catch (error: any) {
      console.error("Error during registration:", error);
      // Traduire les erreurs Firebase courantes
      if (error.code === 'auth/email-already-in-use') {
        form.setError("email", { type: "manual", message: "Cette adresse e-mail est déjà utilisée." });
      } else if (error.code === 'auth/weak-password') {
        form.setError("password", { type: "manual", message: "Le mot de passe doit contenir au moins 6 caractères." });
      } else {
        setFirebaseError("Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Vérification requise</CardTitle>
            <CardDescription>
              Votre compte a été créé avec succès. Un e-mail de vérification a été envoyé à <strong>{form.getValues('email')}</strong>. Veuillez consulter votre boîte de réception et cliquer sur le lien pour activer votre compte.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-bg p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Inscription</CardTitle>
          <CardDescription>
            Créez un compte pour commencer à comparer et économiser.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom d'utilisateur</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre pseudo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {firebaseError && <p className="text-sm text-destructive">{firebaseError}</p>}
              <Button type="submit" className="w-full" variant="cta" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Création en cours..." : "Créer un compte"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Déjà un compte ?{" "}
            <Link href="/login" className="underline">
              Se connecter
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default noSsr(() => Promise.resolve({ default: RegisterPageContent }));