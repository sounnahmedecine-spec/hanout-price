"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

const VIDEO_URL = "https://res.cloudinary.com/db2ljqpdt/video/upload/v1760306093/Generated_File_October_12_2025_-_10_53PM_ytnxhz.mp4";
const POSTER_URL = "https://res.cloudinary.com/db2ljqpdt/image/upload/v1760802070/image2_devrs5.png";

/**
 * OnboardingComponent
 * Displays a welcome screen with a background video, a slogan, and navigation buttons.
 */
export default function OnboardingComponent() {
  return (
    <div className="relative flex flex-col md:flex-row h-screen w-full overflow-hidden bg-bg text-text">
      {/* Video Section */}
      <div className="relative w-full h-[45vh] md:h-screen md:w-1/2 bg-black">
        <video
          title="Vidéo de présentation de l'application Hanout Price"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          // Poster image for faster initial load
          poster={POSTER_URL}
        >
          <source src={VIDEO_URL} type="video/mp4" />
          Votre navigateur ne supporte pas la vidéo.
        </video>
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content Section */}
      <div className="flex-grow flex flex-col items-center justify-center p-6 md:p-12 text-center md:w-1/2">
        <div className="flex-shrink-0">
          <Image
            src="/logo-hanout-price.png"
            alt="Hanout Price Logo"
            width={120}
            height={40}
            priority
          />
        </div>

        {/* Slogan */}
        <div className="flex flex-col gap-4 my-8 flex-grow justify-center">
            <h1 className="text-3xl font-bold tracking-tight text-primary">
                Scanner • Comparer • Économiser
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
                Rejoignez la communauté et trouvez les meilleurs prix pour vos courses quotidiennes au Maroc.
            </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-4 flex-shrink-0">
          {/* TODO: replace with Firebase call or router push */}
          <Button asChild size="lg" className="w-full font-bold" variant="cta">
            <Link href="/register">
              Inscription
            </Link>
          </Button>

          {/* TODO: replace with Firebase call or router push */}
          <Button asChild variant="outline" size="lg" className="w-full font-bold">
            <Link href="/login">
              Connexion
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}