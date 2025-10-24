import { collection, query, where, orderBy, limit, getDocs, Firestore } from 'firebase/firestore';
import { PriceRecord } from './types';

/**
 * Finds the most recent product record for a given barcode.
 * @param firestore - The Firestore instance.
 * @param barcode - The barcode to search for.
 * @returns The most recent PriceRecord or null if not found.
 */
export async function findProductByBarcode(firestore: Firestore, barcode: string): Promise<PriceRecord | null> {
    if (!barcode) return null;

    const q = query(
        collection(firestore, 'priceRecords'),
        where('barcode', '==', barcode),
        orderBy('timestamp', 'desc'),
        limit(1)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as PriceRecord;
    }

    return null;
}