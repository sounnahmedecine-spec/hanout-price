import algoliasearch from 'algoliasearch/lite';

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '';
const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || '';

if (!appId || !searchKey) {
  console.warn(
    'Les clés Algolia ne sont pas configurées dans les variables d\'environnement. La recherche ne fonctionnera pas.'
  );
}

export const searchClient = algoliasearch(appId, searchKey);