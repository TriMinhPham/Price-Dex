/**
 * Pokemon TCG API Type Definitions
 * Defines all TypeScript types for the Pokemon Trading Card Game API data model
 */

/**
 * Attack information for a Pokémon card
 */
export interface Attack {
  name: string;
  cost: string[];
  convertedEnergyCost: number;
  damage?: string;
  text?: string;
}

/**
 * Weakness information for a Pokémon card
 */
export interface Weakness {
  type: string;
  value: string;
}

/**
 * Resistance information for a Pokémon card
 */
export interface Resistance {
  type: string;
  value: string;
}

/**
 * TCGPlayer pricing information
 */
export interface TCGPlayerPrice {
  low?: number;
  mid?: number;
  high?: number;
  market?: number;
  directLow?: number;
}

/**
 * TCGPlayer pricing for different card conditions
 */
export interface TCGPlayerPrices {
  normal?: TCGPlayerPrice;
  holofoil?: TCGPlayerPrice;
  reverseHolofoil?: TCGPlayerPrice;
  firstEditionHolofoil?: TCGPlayerPrice;
}

/**
 * TCGPlayer data associated with a card
 */
export interface TCGPlayerData {
  url?: string;
  updatedAt?: string;
  prices?: TCGPlayerPrices;
}

/**
 * Set information
 */
export interface CardSet {
  id: string;
  name: string;
  series: string;
  printedTotal: number;
  total: number;
  releaseDate: string;
  updatedAt: string;
  images: {
    symbol?: string;
    logo?: string;
  };
}

/**
 * Card images
 */
export interface CardImages {
  small?: string;
  large?: string;
}

/**
 * Main Pokemon Card type
 */
export interface PokemonCard {
  id: string;
  name: string;
  supertype: string;
  subtypes?: string[];
  hp?: string;
  types?: string[];
  evolvesFrom?: string;
  evolvesTo?: string[];
  rules?: string[];
  attacks?: Attack[];
  weaknesses?: Weakness[];
  resistances?: Resistance[];
  retreatCost?: number;
  convertedRetreatCost?: number;
  set: CardSet;
  number: string;
  artist?: string;
  rarity?: string;
  nationalPokedexNumbers?: number[];
  images: CardImages;
  tcgplayer?: TCGPlayerData;
}

/**
 * Pokemon Set information
 */
export interface PokemonSet {
  id: string;
  name: string;
  series: string;
  printedTotal: number;
  total: number;
  legalities?: Record<string, string>;
  ptcgoCode?: string;
  releaseDate: string;
  updatedAt: string;
  images: {
    symbol?: string;
    logo?: string;
  };
}

/**
 * Price tier with historical trend data
 */
export interface PriceTier {
  price: number | null;
  change24h: number | null;
  change7d: number | null;
  change30d: number | null;
  lastUpdate: string | null;
}

/**
 * Custom price tracking type
 */
export interface CardPrice {
  cardId: string;
  game?: 'pokemon' | 'onepiece';
  market: PriceTier | null;
  raw: PriceTier | null;
  psa9: PriceTier | null;
  psa10: PriceTier | null;
  lastUpdated: string;
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data: T[];
  page?: number;
  pageSize?: number;
  count?: number;
  totalCount?: number;
}
