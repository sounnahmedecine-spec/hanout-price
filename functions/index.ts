import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import algoliasearch from "algoliasearch";

admin.initializeApp();
const db = admin.firestore();

const POINTS_FOR_UPVOTE = 10;

// --- Algolia Configuration ---
// Initialize Algolia client.
// You must configure these environment variables in your Firebase project.
// `firebase functions:config:set algolia.appid="YOUR_APP_ID" algolia.apikey="YOUR_ADMIN_API_KEY"`
const ALGOLIA_APP_ID = functions.config().algolia.appid;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.apikey;
const ALGOLIA_INDEX_NAME = "price_records";

const algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
const index = algoliaClient.initIndex(ALGOLIA_INDEX_NAME);

// --- Gamification Function ---
/**
 * Triggered when a price record is updated, specifically to handle votes.
 * It securely awards points to the original author of the price record
 * when a new upvote is added.
 */
export const onPriceRecordVote = functions.firestore
    .document("price_records/{priceRecordId}")
    .onUpdate(async (change, context) => {
        const beforeData = change.before.data();
        const afterData = change.after.data();

        // Ensure the arrays exist before comparing
        const beforeUpvotes = beforeData.upvotedBy || [];
        const afterUpvotes = afterData.upvotedBy || [];

        // Check if a new user has been added to the upvotedBy array
        if (afterUpvotes.length > beforeUpvotes.length) {
            const authorId = afterData.userId;

            if (!authorId) {
                console.error("No authorId found on price record:", context.params.priceRecordId);
                return null;
            }

            const userRef = db.collection("users").doc(authorId);
            const priceRecordRef = db.collection("price_records").doc(context.params.priceRecordId);

            // Use a transaction to ensure atomicity
            return db.runTransaction(async (transaction) => {
                // Increment the author's points
                transaction.update(userRef, {
                    points: admin.firestore.FieldValue.increment(POINTS_FOR_UPVOTE),
                });
                // Increment the upvotes count on the price record itself
                transaction.update(priceRecordRef, {
                    upvotes: admin.firestore.FieldValue.increment(1),
                });
            });
        }

        // Handle downvotes or other updates if necessary
        return null;
    });

// --- Algolia Sync Functions ---

/**
 * Index a new price record in Algolia when it's created in Firestore.
 */
export const onPriceRecordCreated = functions.firestore
    .document("price_records/{priceRecordId}")
    .onCreate((snap, context) => {
        const data = snap.data();
        const objectID = snap.id;

        // Add the data to the Algolia index
        return index.saveObject({ ...data, objectID });
    });

/**
 * Update the corresponding record in Algolia when a price record is updated in Firestore.
 */
export const onPriceRecordUpdated = functions.firestore
    .document("price_records/{priceRecordId}")
    .onUpdate((change, context) => {
        const newData = change.after.data();
        const objectID = change.after.id;

        return index.saveObject({ ...newData, objectID });
    });

/**
 * Delete a record from Algolia when its corresponding document is deleted from Firestore.
 */
export const onPriceRecordDeleted = functions.firestore
    .document("price_records/{priceRecordId}")
    .onDelete((snap, context) => {
        return index.deleteObject(snap.id);
    });