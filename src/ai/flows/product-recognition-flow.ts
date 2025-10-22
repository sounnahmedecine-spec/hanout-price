
'use server';
/**
 * @fileOverview Flux Genkit pour la reconnaissance d'images de produits.
 *
 * - recognizeProduct - Une fonction qui lance le flux de reconnaissance.
 * - ProductRecognitionInput - Le type d'entrée pour la fonction.
 * - ProductRecognitionOutput - Le type de retour pour la fonction.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ProductRecognitionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "Une photo d'un produit, sous forme de data URI, qui doit inclure un type MIME et utiliser l'encodage Base64. Format attendu : 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ProductRecognitionInput = z.infer<typeof ProductRecognitionInputSchema>;

const ProductRecognitionOutputSchema = z.object({
  productName: z.string().describe('Le nom du produit identifié sur la photo. Par exemple: "Bouteille de Coca-Cola 1.5L".'),
  price: z.number().optional().describe("Le prix du produit identifié sur la photo, s'il est visible sur une étiquette. Ne doit être qu'un nombre."),
});
export type ProductRecognitionOutput = z.infer<typeof ProductRecognitionOutputSchema>;


export async function recognizeProduct(input: ProductRecognitionInput): Promise<ProductRecognitionOutput> {
  return productRecognitionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'productRecognitionPrompt',
  input: { schema: ProductRecognitionInputSchema },
  output: { schema: ProductRecognitionOutputSchema },
  prompt: `Vous êtes un expert en reconnaissance de produits de consommation courante vendus au Maroc.
Votre tâche est d'identifier le nom exact du produit à partir de la photo fournie. Si un prix est visible sur une étiquette dans l'image, extrayez-le également.

Identifiez le nom complet du produit, y compris la marque et le volume si possible.
Si un prix est clairement visible, extrayez la valeur numérique du prix.

Photo du produit : {{media url=photoDataUri}}`,
});

const productRecognitionFlow = ai.defineFlow(
  {
    name: 'productRecognitionFlow',
    inputSchema: ProductRecognitionInputSchema,
    outputSchema: ProductRecognitionOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
