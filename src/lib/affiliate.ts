/**
 * Affiliate Link Generator
 * Utilities for generating affiliate links to eBay and TCGPlayer
 */

/**
 * Generate an eBay search URL for a card
 */
export function generateEbaySearchUrl(
  cardName: string,
  setName?: string,
  game: 'pokemon' | 'onepiece' = 'pokemon'
): string {
  const gameSearchTerm = game === 'onepiece' ? 'one piece card game' : 'pokemon tcg';
  const searchTerms = setName
    ? `${cardName} ${setName} ${gameSearchTerm}`
    : `${cardName} ${gameSearchTerm}`;

  const encodedSearch = encodeURIComponent(searchTerms);
  return `https://www.ebay.com/sch/i.html?_nkw=${encodedSearch}`;
}

/**
 * Wrap an eBay URL with affiliate tracking
 */
export function generateEbayAffiliateUrl(
  searchUrl: string,
  campaignId?: string
): string {
  const cid = campaignId || process.env.EBAY_CAMPAIGN_ID || '1';
  const encodedUrl = encodeURIComponent(searchUrl);
  return `https://rover.ebay.com/rover/1/${cid}/1?mpre=${encodedUrl}`;
}

/**
 * Generate a TCGPlayer search/product URL for a card
 */
export function generateTCGPlayerUrl(
  cardName: string,
  setName?: string,
  game: 'pokemon' | 'onepiece' = 'pokemon'
): string {
  const searchTerms = setName ? `${cardName} ${setName}` : cardName;
  const encodedSearch = encodeURIComponent(searchTerms);
  const gamePath = game === 'onepiece' ? 'one-piece-card-game' : 'pokemon';
  return `https://www.tcgplayer.com/search/${gamePath}/product?q=${encodedSearch}`;
}

/**
 * Add affiliate tracking parameters to a TCGPlayer URL
 */
export function generateTCGPlayerAffiliateUrl(
  url: string,
  affiliateId?: string
): string {
  const affId = affiliateId || process.env.TCGPLAYER_AFFILIATE_ID;

  // If no affiliate ID is configured, return the direct link
  if (!affId) {
    return url;
  }

  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}partner=${affId}`;
}

/**
 * Generate a complete eBay affiliate link for a card
 */
export function getEbayAffiliateLink(
  cardName: string,
  setName?: string,
  game: 'pokemon' | 'onepiece' = 'pokemon'
): string {
  const searchUrl = generateEbaySearchUrl(cardName, setName, game);
  return generateEbayAffiliateUrl(searchUrl);
}

/**
 * Generate a complete TCGPlayer affiliate link for a card
 */
export function getTCGPlayerAffiliateLink(
  cardName: string,
  setName?: string,
  game: 'pokemon' | 'onepiece' = 'pokemon'
): string {
  const url = generateTCGPlayerUrl(cardName, setName, game);
  return generateTCGPlayerAffiliateUrl(url);
}
