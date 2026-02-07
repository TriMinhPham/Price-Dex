import { ExternalLink } from 'lucide-react';
import { GameType } from '@/types/game';
import {
  getTCGPlayerAffiliateLink,
  getEbayAffiliateLink,
} from '@/lib/affiliate';

interface AffiliateButtonProps {
  cardName: string;
  setName?: string;
  platform: 'ebay' | 'tcgplayer';
  game?: GameType;
}

export default function AffiliateButton({
  cardName,
  setName,
  platform,
  game = 'pokemon',
}: AffiliateButtonProps) {
  const getButtonStyles = (platform: 'ebay' | 'tcgplayer') => {
    if (platform === 'tcgplayer') {
      return {
        bg: 'bg-[#3b5998]',
        hover: 'hover:bg-[#2d4373]',
        text: 'text-white',
        label: 'Buy on TCGPlayer',
      };
    } else {
      return {
        bg: 'bg-[#e53238]',
        hover: 'hover:bg-[#d41f26]',
        text: 'text-white',
        label: 'Buy on eBay',
      };
    }
  };

  const getAffiliateUrl = () => {
    if (platform === 'tcgplayer') {
      return getTCGPlayerAffiliateLink(cardName, setName, game);
    } else {
      return getEbayAffiliateLink(cardName, setName, game);
    }
  };

  const styles = getButtonStyles(platform);
  const affiliateUrl = getAffiliateUrl();

  return (
    <a
      href={affiliateUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 font-medium transition-colors ${styles.bg} ${styles.hover} ${styles.text}`}
    >
      <span>{styles.label}</span>
      <ExternalLink size={16} />
    </a>
  );
}
