import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { firestore } from "./config"; // Assurez-vous que votre config firestore est exportée depuis ce fichier

export interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
    storeName: string;
    createdAt: any; // ou Timestamp de firebase
}

export async function getProducts(): Promise<Product[]> {
    const productsCol = collection(firestore, "products");
    // Trier par date de création, les plus récents en premier
    const q = query(productsCol, orderBy("createdAt", "desc"), limit(20)); 
    const productSnapshot = await getDocs(q);
    const productList = productSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            // Assurez-vous que les champs correspondent à votre modèle de données Firestore
        } as Product;
    });
    return productList;
}