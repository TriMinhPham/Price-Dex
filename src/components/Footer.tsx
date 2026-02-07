import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#1e293b] bg-[#0b0f1a] text-[#e2e8f0]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 mb-8">
          {/* About */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">About</h3>
            <p className="text-sm text-[#94a3b8] leading-relaxed">
              PriceDex tracks Trading Card Game prices for Pokémon and One Piece across multiple marketplaces in real-time, helping collectors and investors make informed decisions.
            </p>
          </div>

          {/* Pokémon */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Pokémon TCG</h3>
            <ul className="space-y-2 text-sm text-[#94a3b8]">
              <li>
                <Link href="/pokemon/trending" className="hover:text-[#3b82f6] transition-colors">
                  Trending
                </Link>
              </li>
              <li>
                <Link href="/pokemon/sets" className="hover:text-[#3b82f6] transition-colors">
                  Sets
                </Link>
              </li>
              <li>
                <Link href="/pokemon/cards" className="hover:text-[#3b82f6] transition-colors">
                  All Cards
                </Link>
              </li>
            </ul>
          </div>

          {/* One Piece */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">One Piece Card Game</h3>
            <ul className="space-y-2 text-sm text-[#94a3b8]">
              <li>
                <Link href="/onepiece/trending" className="hover:text-[#3b82f6] transition-colors">
                  Trending
                </Link>
              </li>
              <li>
                <Link href="/onepiece/sets" className="hover:text-[#3b82f6] transition-colors">
                  Sets
                </Link>
              </li>
              <li>
                <Link href="/onepiece/cards" className="hover:text-[#3b82f6] transition-colors">
                  All Cards
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Resources</h3>
            <ul className="space-y-2 text-sm text-[#94a3b8]">
              <li>
                <a
                  href="https://pokemontcg.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#3b82f6] transition-colors"
                >
                  Pokémon TCG API
                </a>
              </li>
              <li>
                <a
                  href="https://onepiece-card.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#3b82f6] transition-colors"
                >
                  One Piece Card Official
                </a>
              </li>
              <li>
                <a
                  href="https://tcgplayer.com"
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="hover:text-[#3b82f6] transition-colors"
                >
                  TCGPlayer
                </a>
              </li>
              <li>
                <a
                  href="https://ebay.com"
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="hover:text-[#3b82f6] transition-colors"
                >
                  eBay
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Legal</h3>
            <ul className="space-y-2 text-sm text-[#94a3b8]">
              <li>
                <Link href="/privacy" className="hover:text-[#3b82f6] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#3b82f6] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/affiliate-disclosure"
                  className="hover:text-[#3b82f6] transition-colors"
                >
                  Affiliate Disclosure
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#1e293b] pt-8">
          {/* Affiliate Disclosure */}
          <p className="text-xs text-[#64748b] mb-4">
            PriceDex contains affiliate links to TCGPlayer and eBay. We earn a commission when you purchase through these links at no additional cost to you. This helps us maintain the site and provide free price tracking.
          </p>

          {/* Bottom Bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#94a3b8]">
              © {currentYear} PriceDex. Prices updated daily.
            </p>
            <p className="text-xs text-[#64748b]">
              Not affiliated with Pokémon Company, Nintendo, or Bandai. Pokémon is a registered trademark of The Pokémon Company. One Piece is a registered trademark of Toei Animation.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
