#!/usr/bin/env node

/**
 * PriceDex: Price Update Script
 *
 * Updates price snapshots for all cards and identifies market movers.
 * Designed to run as a scheduled cron job (recommended: every 24 hours).
 *
 * Usage:
 *   npx ts-node scripts/update-prices.ts              # Standard run
 *   npx ts-node scripts/update-prices.ts --dry-run    # Test without saving
 *   npx ts-node scripts/update-prices.ts --limit 100  # Process only 100 cards
 */

import * as fs from 'fs';
import * as path from 'path';

// Constants
const API_BASE = 'https://api.pokemontcg.io/v2';
const DATA_DIR = path.join(__dirname, '../data');
const CARDS_FILE = path.join(DATA_DIR, 'cards.json');
const PRICES_FILE = path.join(DATA_DIR, 'prices.json');
const MARKET_MOVERS_FILE = path.join(DATA_DIR, 'market-movers.json');
const RATE_LIMIT_DELAY = 100; // milliseconds between requests

// Interfaces
interface Card {
  id: string;
  name: string;
  set: {
    id: string;
    name: string;
  };
  number: string;
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
    prices?: {
      avg_sell_price?: number;
      trend_price?: number;
    };
  };
}

interface PriceSnapshot {
  cardId: string;
  cardName: string;
  setName: string;
  setCode: string;
  cardNumber: string;
  timestamp: string;
  prices: {
    tcgplayer?: {
      holofoil?: {
        low?: number;
        mid?: number;
        high?: number;
        market?: number;
      };
      reverseHolofoil?: {
        low?: number;
        mid?: number;
        high?: number;
        market?: number;
      };
      normal?: {
        low?: number;
        mid?: number;
        high?: number;
        market?: number;
      };
      updated_at?: string;
    };
    cardmarket?: {
      avg_sell_price?: number;
      trend_price?: number;
      updated_at?: string;
    };
  };
}

interface PriceHistory {
  [cardId: string]: PriceSnapshot[];
}

interface MarketMover {
  cardId: string;
  cardName: string;
  setName: string;
  cardNumber: string;
  priceChange: number;
  priceChangePercent: number;
  previousPrice: number;
  currentPrice: number;
  source: 'tcgplayer' | 'cardmarket';
  timestamp: string;
}

// Utility: Sleep function for rate limiting
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Utility: Parse command line arguments
function getDryRun(): boolean {
  return process.argv.includes('--dry-run');
}

function getCardLimit(): number | null {
  const limitArg = process.argv.find((arg) => arg.startsWith('--limit'));
  if (limitArg) {
    const limit = parseInt(limitArg.split('=')[1], 10);
    return isNaN(limit) ? null : limit;
  }
  return null;
}

// Utility: Load cards from cache
function loadCards(): Card[] {
  if (!fs.existsSync(CARDS_FILE)) {
    console.error(`❌ Cards file not found: ${CARDS_FILE}`);
    console.error('   Run "npx ts-node scripts/fetch-cards.ts" first');
    process.exit(1);
  }

  const content = fs.readFileSync(CARDS_FILE, 'utf-8');
  return JSON.parse(content) as Card[];
}

// Utility: Load existing price history
function loadPriceHistory(): PriceHistory {
  if (!fs.existsSync(PRICES_FILE)) {
    return {};
  }

  const content = fs.readFileSync(PRICES_FILE, 'utf-8');
  return JSON.parse(content) as PriceHistory;
}

// Utility: Extract mid/market price for comparison
function extractPrice(snapshot: PriceSnapshot): number {
  // Prefer TCGPlayer mid price, then market, then cardmarket trend
  if (snapshot.prices.tcgplayer?.holofoil?.mid) {
    return snapshot.prices.tcgplayer.holofoil.mid;
  }
  if (snapshot.prices.tcgplayer?.holofoil?.market) {
    return snapshot.prices.tcgplayer.holofoil.market;
  }
  if (snapshot.prices.cardmarket?.trend_price) {
    return snapshot.prices.cardmarket.trend_price;
  }
  return 0;
}

// Utility: Create price snapshot for a card
function createPriceSnapshot(card: Card, timestamp: string): PriceSnapshot {
  const snapshot: PriceSnapshot = {
    cardId: card.id,
    cardName: card.name,
    setName: card.set.name,
    setCode: card.set.id,
    cardNumber: card.number,
    timestamp,
    prices: {},
  };

  // Extract TCGPlayer prices
  if (card.tcgplayer?.prices) {
    snapshot.prices.tcgplayer = {
      holofoil: card.tcgplayer.prices['holofoil'],
      reverseHolofoil: card.tcgplayer.prices['reverseHolofoil'],
      normal: card.tcgplayer.prices['normal'],
      updated_at: card.tcgplayer.updated_at,
    };
  }

  // Extract CardMarket prices
  if (card.cardmarket?.prices) {
    snapshot.prices.cardmarket = {
      avg_sell_price: card.cardmarket.prices.avg_sell_price,
      trend_price: card.cardmarket.prices.trend_price,
      updated_at: card.cardmarket.updated_at,
    };
  }

  return snapshot;
}

// Utility: Save price history
function savePriceHistory(history: PriceHistory, dryRun: boolean): void {
  if (dryRun) {
    console.log('🏜️  [DRY RUN] Would save price history');
    return;
  }

  fs.writeFileSync(PRICES_FILE, JSON.stringify(history, null, 2));
  console.log(`💾 Saved price history to ${PRICES_FILE}`);
}

// Utility: Identify and save market movers
function identifyMarketMovers(
  history: PriceHistory,
  minChangePercent: number = 10,
  dryRun: boolean = false
): MarketMover[] {
  const movers: MarketMover[] = [];
  const now = new Date().toISOString();

  for (const cardId in history) {
    const snapshots = history[cardId];
    if (snapshots.length < 2) {
      continue; // Need at least 2 snapshots to compare
    }

    const currentSnapshot = snapshots[snapshots.length - 1];
    const previousSnapshot = snapshots[snapshots.length - 2];

    const currentPrice = extractPrice(currentSnapshot);
    const previousPrice = extractPrice(previousSnapshot);

    if (currentPrice === 0 || previousPrice === 0) {
      continue; // Skip cards without pricing data
    }

    const priceChange = currentPrice - previousPrice;
    const priceChangePercent = (priceChange / previousPrice) * 100;

    // Track significant movers (>10% change or <-10% change)
    if (Math.abs(priceChangePercent) >= minChangePercent) {
      const source = currentSnapshot.prices.tcgplayer ? 'tcgplayer' : 'cardmarket';

      movers.push({
        cardId,
        cardName: currentSnapshot.cardName,
        setName: currentSnapshot.setName,
        cardNumber: currentSnapshot.cardNumber,
        priceChange,
        priceChangePercent: Math.round(priceChangePercent * 100) / 100,
        previousPrice: Math.round(previousPrice * 100) / 100,
        currentPrice: Math.round(currentPrice * 100) / 100,
        source,
        timestamp: now,
      });
    }
  }

  // Sort by absolute price change percent (descending)
  movers.sort((a, b) => Math.abs(b.priceChangePercent) - Math.abs(a.priceChangePercent));

  if (!dryRun) {
    fs.writeFileSync(MARKET_MOVERS_FILE, JSON.stringify(movers, null, 2));
    console.log(`💾 Saved ${movers.length} market movers to ${MARKET_MOVERS_FILE}`);
  } else {
    console.log(`🏜️  [DRY RUN] Found ${movers.length} market movers`);
  }

  return movers;
}

// Utility: Format price for display
function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

// Main execution
async function main(): Promise<void> {
  try {
    const dryRun = getDryRun();
    const cardLimit = getCardLimit();

    console.log('\n💰 PriceDex: Price Update Script');
    console.log('=====================================');

    if (dryRun) {
      console.log('🏜️  Running in DRY RUN mode - no files will be saved');
    }

    // Load existing data
    console.log('\n📖 Loading card data...');
    const cards = loadCards();
    console.log(`✅ Loaded ${cards.length} cards`);

    console.log('📊 Loading price history...');
    const history = loadPriceHistory();
    console.log(`✅ Loaded history for ${Object.keys(history).length} cards`);

    // Process cards
    const timestamp = new Date().toISOString();
    const cardsToProcess = cardLimit ? cards.slice(0, cardLimit) : cards;
    const skippedCards: string[] = [];

    console.log(`\n🎴 Updating prices for ${cardsToProcess.length} cards...`);

    for (let i = 0; i < cardsToProcess.length; i++) {
      const card = cardsToProcess[i];
      const progressPercent = Math.round(((i + 1) / cardsToProcess.length) * 100);

      try {
        // Skip cards without pricing data
        if (!card.tcgplayer?.prices && !card.cardmarket?.prices) {
          skippedCards.push(card.id);
          continue;
        }

        // Create snapshot
        const snapshot = createPriceSnapshot(card, timestamp);

        // Add to history
        if (!history[card.id]) {
          history[card.id] = [];
        }
        history[card.id].push(snapshot);

        // Keep only last 90 snapshots per card (to limit file size)
        if (history[card.id].length > 90) {
          history[card.id] = history[card.id].slice(-90);
        }

        // Progress output every 50 cards
        if ((i + 1) % 50 === 0) {
          console.log(`✅ Processed ${i + 1}/${cardsToProcess.length} cards (${progressPercent}%)`);
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.warn(`⚠️  Error processing card ${card.id}: ${errorMsg}`);
        // Continue processing other cards
      }

      await sleep(RATE_LIMIT_DELAY);
    }

    console.log(`\n✅ Price update complete`);
    console.log(`   Skipped ${skippedCards.length} cards without pricing data`);

    // Save history
    savePriceHistory(history, dryRun);

    // Identify market movers
    console.log('\n📈 Identifying market movers...');
    const movers = identifyMarketMovers(history, 10, dryRun);

    if (movers.length > 0) {
      console.log(`\n🚀 Top 5 gainers:`);
      movers
        .filter((m) => m.priceChangePercent > 0)
        .slice(0, 5)
        .forEach((mover) => {
          console.log(
            `   ${mover.cardName} (${mover.setName} #${mover.cardNumber}): ` +
              `${formatPrice(mover.previousPrice)} → ${formatPrice(mover.currentPrice)} ` +
              `(+${mover.priceChangePercent}%)`
          );
        });

      console.log(`\n📉 Top 5 losers:`);
      movers
        .filter((m) => m.priceChangePercent < 0)
        .slice(0, 5)
        .forEach((mover) => {
          console.log(
            `   ${mover.cardName} (${mover.setName} #${mover.cardNumber}): ` +
              `${formatPrice(mover.previousPrice)} → ${formatPrice(mover.currentPrice)} ` +
              `(${mover.priceChangePercent}%)`
          );
        });
    }

    console.log('\n🎉 Price update script complete!');
    process.exit(0);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`\n💥 Script failed: ${errorMsg}`);
    process.exit(1);
  }
}

main();
