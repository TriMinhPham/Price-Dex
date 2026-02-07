import { NextRequest, NextResponse } from 'next/server';
import { pokemonTCGClient } from '@/lib/pokemon-tcg-api';

/**
 * Simple in-memory rate limiting
 * Key: IP address, Value: { count, resetTime }
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'anonymous'
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (!limit || now > limit.resetTime) {
    // Reset or create new limit window (60 second window, 30 requests)
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
    return false;
  }

  if (limit.count >= 30) {
    return true;
  }

  limit.count++;
  return false;
}

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request);
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Get search query from URL params
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    // Validate query
    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    if (query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Search query must be at least 2 characters' },
        { status: 400 }
      );
    }

    // Search cards
    const results = await pokemonTCGClient.searchCards(query.trim());

    return NextResponse.json({
      success: true,
      query: query.trim(),
      data: results.data || [],
      count: results.data?.length || 0,
    });
  } catch (error) {
    console.error('Search API error:', error);

    return NextResponse.json(
      {
        error: 'Failed to perform search',
        success: false,
      },
      { status: 500 }
    );
  }
}
