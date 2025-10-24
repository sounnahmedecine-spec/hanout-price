import algoliasearch from 'algoliasearch/lite';

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY;

if (!appId || !searchKey) {
    console.warn("Les clés API Algolia ne sont pas configurées. La recherche ne fonctionnera pas.");
    // Créer un client factice pour éviter les erreurs de plantage
    // @ts-ignore
    global.algoliasearch = () => ({ addAlgoliaAgent: () => {} });
}

export const searchClient = algoliasearch(appId || '', searchKey || '');