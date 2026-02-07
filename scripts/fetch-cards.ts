#!/usr/bin/env node

/**
 * PriceDex: Bulk Card Data Fetcher
 *
 * Fetches all Pokémon TCG cards from the official API and saves them locally.
 * Also fetches and caches all sets data.
 *
 * Usage:
 *   npx ts-node scripts/fetch-cards.ts                 # Fetch all cards from page 1
 *   npx ts-node scripts/fetch-cards.ts --page 5        # Resume from page 5
 *   npx ts-node scripts/fetch-cards.ts --sets-only     # Only fetch sets
 */

import * as fs from 'fs';
import * as path from 'path';

// Constants
const API_BASE = 'https://api.pokemontcg.io/v2';
const PAGE_SIZE = 250;
const RATE_LIMIT_DELAY = 100; // milliseconds between requests

// Data directory
const DATA_DIR = path.join(__dirname, '../data');
const CARDS_FILE = path.join(DATA_DIR, 'cards.json');
const SETS_FILE = path.join(DATA_DIR, 'sets.json');

// Interfaces
interface Card {
  id: string;
  name: string;
  supertype: string;
  subtypes: string[];
  hp?: number;
  types?: string[];
  evolves_from?: string;
  abilities?: Array<{
    name: string;
    text: string;
    type: string;
  }>;
  attacks?: Array<{
    name: string;
    cost: string[];
    converted_energy_cost: number;
    damage: string;
    text: string;
  }>;
  weaknesses?: Array<{
    type: string;
    value: string;
  }>;
  resistances?: Array<{
    type: string;
    value: string;
  }>;
  retreat_cost?: string[];
  artist?: string;
  rarity?: string;
  flavor_text?: string;
  national_pokedex_numbers?: number[];
  legalities?: {
    unlimited?: string;
    standard?: string;
    expanded?: string;
  };
  images: {
    small: string;
    large: string;
  };
  tcgplayer?: {
    url: string;
    updated_at: string;
    prices?: {
      [key: string]: {
        low?: number;
        mid?: number;
        high?: number;
        market?: number;
        direct_low?: number;
        direct_mid?: number;
        direct_high?: number;
      };
    };
  };
  cardmarket?: {
    url: string;
    updated_at: string;
    prices: {
      avg_sell_price?: number;
      avg_low_price?: number;
      avg_high_price?: number;
      trend_price?: number;
      germanProLow?: number;
      germanProHigh?: number;
      germanProAvg?: number;
      reverseHoloAvg?: number;
      reverseHoloTrend?: number;
      lowPriceExPlus?: number;
      avg1?: number;
      avg7?: number;
      avg30?: number;
      reverseHoloSell?: number;
      reverseHoloLow?: number;
      reverseHoloTrend2?: number;
      lowPriceExPlus2?: number;
      avg1Reverse?: number;
      avg7Reverse?: number;
      avg30Reverse?: number;
    };
  };
  set: {
    id: string;
    name: string;
    series: string;
    total: number;
    printed_total: number;
    standard_legal: boolean;
    images: {
      symbol: string;
      logo: string;
    };
  };
  number: string;
  count: number;
  regulations?: {
    index: string;
    text: string;
  };
}

interface Set {
  id: string;
  name: string;
  series: string;
  total: number;
  printed_total: number;
  standard_legal: boolean;
  images: {
    symbol: string;
    logo: string;
  };
}

interface PaginatedResponse<T> {
  data: T[];
  page: number;
  page_size: number;
  count: number;
  total_count: number;
}

// Utility: Sleep function for rate limiting
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Utility: Parse command line arguments
function getStartPage(): number {
  const pageArg = process.argv.find((arg) => arg.startsWith('--page'));
  if (pageArg) {
    const page = parseInt(pageArg.split('=')[1], 10);
    return isNaN(page) ? 1 : Math.max(1, page);
  }
  return 1;
}

function getSetsOnly(): boolean {
  return process.argv.includes('--sets-only');
}

// Utility: Create data directory if it doesn't exist
function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log(`📁 Created data directory: ${DATA_DIR}`);
  }
}

// Utility: Fetch with retry logic
async function fetchWithRetry(
  url: string,
  maxRetries: number = 3,
  timeout: number = 30000
): Promise<Response> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'PriceDex/1.0 (price-tracking bot)',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limited, wait longer
          const waitTime = Math.pow(2, attempt) * 1000;
          console.warn(`⚠️  Rate limited. Waiting ${waitTime}ms before retry...`);
          await sleep(waitTime);
          continue;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      const isLastAttempt = attempt === maxRetries;
      const errorMsg = error instanceof Error ? error.message : String(error);

      if (isLastAttempt) {
        throw new Error(`Failed to fetch ${url} after ${maxRetries} retries: ${errorMsg}`);
      }

      console.warn(`⚠️  Attempt ${attempt} failed: ${errorMsg}. Retrying...`);
      await sleep(1000 * attempt);
    }
  }

  throw new Error('Fetch failed: Unknown error');
}

// Main: Fetch all sets
async function fetchAllSets(): Promise<Set[]> {
  console.log('\n📚 Fetching all sets...');

  try {
    const url = `${API_BASE}/sets`;
    const response = await fetchWithRetry(url);
    const data = (await response.json()) as PaginatedResponse<Set>;

    const sets = data.data || [];
    console.log(`✅ Fetched ${sets.length} sets`);

    // Save to file
    fs.writeFileSync(SETS_FILE, JSON.stringify(sets, null, 2));
    console.log(`💾 Saved sets to ${SETS_FILE}`);

    return sets;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`❌ Error fetching sets: ${errorMsg}`);
    throw error;
  }
}

// Main: Fetch all cards
async function fetchAllCards(startPage: number = 1): Promise<Card[]> {
  console.log('\n🎴 Fetching all Pokémon TCG cards...');
  console.log(`Starting from page ${startPage}`);

  const allCards: Card[] = [];
  let currentPage = startPage;
  let totalCards = 0;
  let hasMorePages = true;

  try {
    while (hasMorePages) {
      const url = `${API_BASE}/cards?page=${currentPage}&pageSize=${PAGE_SIZE}`;

      try {
        const response = await fetchWithRetry(url);
        const data = (await response.json()) as PaginatedResponse<Card>;

        const cards = data.data || [];
        allCards.push(...cards);
        totalCards += cards.length;

        console.log(
          `✅ Fetching page ${currentPage}... (${totalCards} cards so far, total: ${data.total_count})`
        );

        // Check if there are more pages
        if (currentPage * PAGE_SIZE >= data.total_count) {
          hasMorePages = false;
        } else {
          currentPage += 1;
          // Rate limiting
          await sleep(RATE_LIMIT_DELAY);
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error(`❌ Error fetching page ${currentPage}: ${errorMsg}`);
        console.log(`📍 You can resume from page ${currentPage} with: --page ${currentPage}`);
        throw error;
      }
    }

    console.log(`\n✅ Successfully fetched ${allCards.length} cards total`);

    // Save to file
    fs.writeFileSync(CARDS_FILE, JSON.stringify(allCards, null, 2));
    console.log(`💾 Saved cards to ${CARDS_FILE}`);

    return allCards;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`\n❌ Fatal error: ${errorMsg}`);
    throw error;
  }
}

// Main execution
async function main(): Promise<void> {
  try {
    ensureDataDir();

    const setsOnly = getSetsOnly();
    const startPage = getStartPage();

    // Always fetch sets
    await fetchAllSets();

    // Fetch cards unless --sets-only is specified
    if (!setsOnly) {
      await fetchAllCards(startPage);
    }

    console.log('\n🎉 Card and set data fetch complete!');
    process.exit(0);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`\n💥 Script failed: ${errorMsg}`);
    process.exit(1);
  }
}

main();
