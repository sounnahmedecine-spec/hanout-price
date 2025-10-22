// D:\HanoutPriceProjects\WebNextJS\src\app\prices\[id]\page.tsx

// Correction: Import 'app' and initialize 'db' for server-side usage.
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config'; // Assumes firebaseConfig is exported
import { PriceRecord } from '@/lib/types';
import PriceDetailsClient from './price-details-client';
import { notFound } from 'next/navigation';

// Initialize Firestore DB instance for server-side data fetching
// This ensures we don't re-initialize the app on the server.
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function generateStaticParams() {
  try {
    // db should be available here from the import
    const pricesCollectionRef = collection(db, 'priceRecords');
    const snapshot = await getDocs(pricesCollectionRef);
    
    if (snapshot.empty) {
      console.log('No documents found in priceRecords, returning empty params.');
      return [];
    }

    const paths = snapshot.docs.map(doc => ({
      id: doc.id,
    }));

    return paths;
  } catch (error) {
    console.error("Error fetching static params for prices:", error);
    // Return empty array on error to prevent build failure
    return [];
  }
}

// This is a Server Component. It fetches data on the server and passes it to the Client Component.
export default async function PricePage({ params }: { params: { id: string } }) {
    const docRef = doc(db, 'priceRecords', params.id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        notFound();
    }

    // We need to convert Firestore Timestamps to a serializable format (like a plain object)
    // because we are passing data from a Server Component to a Client Component.
    // The client component will then reconstruct the Date object.
    const data = docSnap.data();
    const priceRecord = {
        id: docSnap.id,
        ...data,
        timestamp: data.timestamp ? {
            seconds: data.timestamp.seconds,
            nanoseconds: data.timestamp.nanoseconds
        } : null
    } as PriceRecord;

    return (
        <div className="flex flex-col min-h-screen bg-secondary">
            <main className="flex-grow py-8">
                <PriceDetailsClient priceRecord={priceRecord} />
            </main>
        </div>
    );
}