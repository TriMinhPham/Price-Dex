/**
 * /api/home-data
 * Serves homepage dynamic content (recent cards, market movers).
 * Cached at the Vercel CDN edge for 5 minutes so the origin
 * Pokemon TCG API is hit at most once per 5 min, not once per visitor.
 */

import { NextResponse } from 'next/server';
import { pokemonTCGClient } from '@/lib/pokemon-tcg-api';
import { onePieceTCGClient } from '@/lib/onepiece-tcg-api';
import { getMarketMovers } from '@/lib/price-service';

/** Hard ceiling so a slow upstream can never stall the response */
const HARD_TIMEOUT_MS = 6_000;
// Next.js 15: GET route handlers are dynamic by default; force ISR caching at CDN.
export const dynamic = 'force-static';
export const revalidate = 300;

function withTimeout<T>(promise: Promise<T>, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), HARD_TIMEOUT_MS)),
  ]);
}

export async function GET() {
  const [recentCards, recentOnePieceCards, marketMovers] = await Promise.all([
    withTimeout(
      pokemonTCGClient.getCards(1, 12).then((r) => r.data ?? []),
      [],
    ),
    withTimeout(
      onePieceTCGClient.getCards(1, 6).then((r) => r.data ?? []),
      [],
    ),
    withTimeout(
      Promise.resolve(getMarketMovers('24h')),
      [],
    ),
  ]);

  return NextResponse.json({ recentCards, recentOnePieceCards, marketMovers });
}
