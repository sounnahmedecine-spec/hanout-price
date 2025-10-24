'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/firebase";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      } else {
        router.push("/login"); // 🚪 redirige si pas connecté
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-grayLight">
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="flex items-center justify-between bg-white p-4 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-green">Hanout Price Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-coral hover:bg-opacity-90 text-white px-4 py-2 rounded-lg"
        >
          Déconnexion
        </button>
      </header>

      <main className="mt-6 space-y-6">
        <section className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-2">👤 Profil</h2>
          <p><strong>Email :</strong> {user?.email}</p>
          <p><strong>ID utilisateur :</strong> {user?.uid}</p>
        </section>

        <section className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-2">📸 Scanner / Soumission Prix</h2>
          <p className="text-gray-600">
            Ici tu pourras activer la caméra, scanner un produit et soumettre un prix à la base Firestore.
          </p>
          <button
            onClick={() => router.push("/add-product")}
            className="mt-3 bg-green hover:bg-opacity-90 text-white px-4 py-2 rounded-lg"
          >
            Ouvrir le Scanner
          </button>
        </section>

        <section className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-2">🗺️ Carte des Magasins</h2>
          <p className="text-gray-600">
            Affiche ta position actuelle et explore les points de vente autour.
          </p>
          <button
            onClick={() => router.push("/map")}
            className="mt-3 bg-blue hover:bg-opacity-90 text-white px-4 py-2 rounded-lg"
          >
            Voir la carte
          </button>
        </section>
      </main>
    </div>
  );
}
