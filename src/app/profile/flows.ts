import { defineFlow } from '@genkit-ai/flow';
// import { firebase } from '@genkit-ai/firebase';
import * as z from 'zod';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const app = getApps().length === 0 ? initializeApp() : getApps()[0];
const db = getFirestore(app);

export const generateBadgesFlow = defineFlow(
  {
    name: 'generateBadgesFlow',
    inputSchema: z.object({
      userId: z.string(),
      activityDescription: z.string(),
    }),
    outputSchema: z.array(z.object({
      badgeId: z.string(),
      name: z.string(),
      description: z.string(),
      imageUrl: z.string(),
    })),
  },
  async (input) => {
    // This is a placeholder for actual badge generation logic.
    // In a real scenario, you'd use an LLM to analyze activityDescription
    // and determine which badges (if any) to award.
    console.log(`Generating badges for user ${input.userId} based on: ${input.activityDescription}`);

    // Example: Award a fixed badge for demonstration
    const availableBadges = [
      { badgeId: 'first_comment', name: 'Premier Commentaire', description: 'A laissé son premier commentaire.', imageUrl: 'https://example.com/badge1.png' },
      { badgeId: 'top_contributor', name: 'Top Contributeur', description: 'Contributeur actif de la communauté.', imageUrl: 'https://example.com/badge2.png' },
    ];

    const awardedBadges = [];
    if (input.activityDescription.includes('commentaire')) {
      awardedBadges.push(availableBadges[0]);
    }
    // More complex logic would go here

    // Save awarded badges to user profile
    const userBadgesRef = db.collection('users').doc(input.userId).collection('badges');
    for (const badge of awardedBadges) {
      const existingBadge = await userBadgesRef.where('badgeId', '==', badge.badgeId).limit(1).get();
      if (existingBadge.empty) {
        await userBadgesRef.add({
          badgeId: badge.badgeId,
          dateEarned: FieldValue.serverTimestamp(),
        });
      }
    }

    return awardedBadges;
  }
);