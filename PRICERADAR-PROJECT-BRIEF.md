# PriceRadar — TCG Price Intelligence Site
## Project Brief for Claude Cowork

> Drop this file in your Cowork workspace folder. Claude will read it and know everything from our conversation.

---

## WHO IS THE USER

- Name: Heo
- Location: Tokyo, Japan (expat)
- Background: Tech founder, built KardiaChain (blockchain cross-chain infra). Visionary/allocator archetype — not an operator.
- Current focus: Building an AI company in Tokyo that enables real businesses to run autonomously via AI agents.
- This project serves dual purpose: (1) generate revenue, (2) serve as a "demo reel" proving AI can operate a business end-to-end with minimal human input.

## THE BUSINESS

**PriceRadar** — a programmatic SEO content site that tracks Pokémon TCG card prices across marketplaces. Every card gets its own page targeting long-tail keywords like "[card name] price" / "[card name] value" / "[card name] worth."

### Why Pokémon
- Largest TCG by sales volume globally (Q1 2026)
- 10.2 billion cards produced March 2024–2025
- 2026 is Pokémon's 30th anniversary — search volume spike all year
- Massive long-tail SEO opportunity: 50,000+ unique cards × price/value queries
- Yu-Gi-Oh and MTG are expansion targets later

### Revenue Model (all automated)
1. **eBay Partner Network** — affiliate links on every card page (~4-6% commission on referred sales)
2. **TCGPlayer affiliate** — ~5% commission
3. **Display ads** — Mediavine/Ezoic once hitting 10k sessions/month
4. **Future: Premium tier** — price alerts, portfolio tracking, email newsletter

### The AI Autonomy Loop This Proves
Content creation → SEO indexing → organic traffic → affiliate clicks → revenue → zero human intervention after deploy

---

## TECHNICAL DECISIONS MADE

### Stack
- **Framework**: Next.js (Static Site Generation for SEO)
- **Hosting**: Vercel (user has account)
- **Data source**: Pokémon TCG API (https://pokemontcg.io) for card metadata + images
- **Price data**: eBay sold listings scraper for real market prices
- **Content**: AI-generated unique copy per card page (history, rarity, market analysis)

### User's Available Infrastructure
- ✅ Vercel account
- ✅ GCP account (available for backend/cron jobs if needed)
- ✅ Domain registrar account
- ✅ Stripe account (for future premium features)

### Domain
- User mentioned "tcg.kai.now" — needs clarification. Likely needs to purchase a proper domain.
- Suggested alternatives: priceradar.gg, tcgradar.io, or similar

### What Needs to Be Built
1. Next.js project with SSG (static pages for every card = SEO gold)
2. Pokémon TCG API integration (all 52,000+ cards)
3. eBay sold listings price scraper
4. AI content generation pipeline (unique copy per card page)
5. eBay Partner Network affiliate link integration
6. Vercel deployment config
7. Cron job for daily/hourly price updates (can run on GCP)
8. Weekly "market movers" newsletter (auto-generated)
9. Dashboard for Heo to check performance (~15 min/week)

### What User Does (< 1 hour total setup)
1. Sign up for eBay Partner Network (free) — https://partnernetwork.ebay.com
2. Get Pokémon TCG API key (free) — https://pokemontcg.io
3. Purchase domain
4. Connect Vercel to GitHub repo
5. Weekly: check dashboard, approve/reject any decisions that exceed thresholds

---

## UI/DESIGN DIRECTION

A working React demo (PriceRadar.jsx) was already built with:
- Dark theme (#0b0f1a background)
- DM Sans + JetBrains Mono fonts
- Card table with price tiers (Raw, PSA 9, PSA 10)
- Trend badges (green up, red down)
- Card detail view with affiliate CTAs
- Trending section
- Stats footer (cards tracked, update frequency, daily sales volume, sets covered)
- Affiliate disclosure

The demo uses sample data. The full build needs real API integration.

---

## STRATEGIC CONTEXT

This site is ONE experiment in a larger portfolio thesis. Heo's model (proven with KardiaChain):
1. See the opportunity (vision) ✅ done
2. Sharpen thesis until undeniable ✅ done
3. Show proof the thesis is real — **THIS PROJECT**
4. Use proof to attract operators for other verticals
5. Deploy capital + AI operating layer across portfolio

The goal is NOT to build a TCG price empire. The goal is to prove that AI can operate a digital business end-to-end, then use that proof to recruit domain-expert operators for a portfolio of AI-operated businesses.

Heo provides: vision + capital (¥5M + $100K USD) + AI infrastructure layer
Operators provide: domain expertise in specific verticals
AI provides: 80%+ of day-to-day operations

---

## INSTRUCTIONS FOR CLAUDE IN COWORK

When Heo gives you this file, your job is to:

1. **Build the full Next.js project** in the workspace folder
2. **Set up the complete file structure** ready for Vercel deployment
3. **Integrate the Pokémon TCG API** for real card data
4. **Create the programmatic page generation** system (one page per card)
5. **Build the price scraping infrastructure** (eBay sold listings)
6. **Generate SEO-optimized content** for card pages
7. **Set up affiliate link integration** (eBay Partner Network + TCGPlayer)
8. **Create a simple monitoring dashboard**

Ask Heo for: API keys, domain name, eBay Partner Network ID when you need them. Everything else, just build.

The user wants AI to do as much as possible. His time commitment should be under 30 min/week after initial setup. Build everything with that constraint in mind.
