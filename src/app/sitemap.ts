import { MetadataRoute } from 'next';
import { pokemonTCGClient } from '@/lib/pokemon-tcg-api';
import { onePieceTCGClient } from '@/lib/onepiece-tcg-api';
import { SITE_URL } from '@/lib/seo';

// Make sitemap dynamic so it doesn't block build
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // regenerate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: `${baseUrl}/pokemon`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/onepiece`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/trending`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  let pokemonCardPages: MetadataRoute.Sitemap = [];
  let pokemonSetPages: MetadataRoute.Sitemap = [];
  let onePieceCardPages: MetadataRoute.Sitemap = [];
  let onePieceSetPages: MetadataRoute.Sitemap = [];

  try {
    // Fetch Pokémon cards and sets for sitemap
    const pokemonCardsResponse = await pokemonTCGClient.getCards(1, 100);
    const pokemonSetsResponse = await pokemonTCGClient.getSets();

    // Add Pokémon card pages
    if (pokemonCardsResponse.data) {
      pokemonCardPages = pokemonCardsResponse.data.map((card) => ({
        url: `${baseUrl}/pokemon/card/${card.id}`,
        lastModified: new Date(card.tcgplayer?.updatedAt || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }

    // Add Pokémon set pages
    if (pokemonSetsResponse) {
      pokemonSetPages = pokemonSetsResponse.map((set) => ({
        url: `${baseUrl}/pokemon/set/${set.id}`,
        lastModified: new Date(set.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error('Error generating Pokémon sitemap:', error);
  }

  try {
    // Fetch One Piece cards and sets for sitemap
    const onePieceCardsResponse = await onePieceTCGClient.getCards(1, 100);
    const onePieceSetsResponse = await onePieceTCGClient.getSets();

    // Add One Piece card pages
    if (onePieceCardsResponse.data) {
      onePieceCardPages = onePieceCardsResponse.data.map((card) => ({
        url: `${baseUrl}/onepiece/card/${card.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }

    // Add One Piece set pages
    if (onePieceSetsResponse) {
      onePieceSetPages = onePieceSetsResponse.map((set) => ({
        url: `${baseUrl}/onepiece/set/${set.id}`,
        lastModified: new Date(set.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error('Error generating One Piece sitemap:', error);
  }

  return [...staticPages, ...pokemonCardPages, ...pokemonSetPages, ...onePieceCardPages, ...onePieceSetPages];
}
