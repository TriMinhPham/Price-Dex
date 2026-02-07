interface RarityBadgeProps {
  rarity: string;
}

export default function RarityBadge({ rarity }: RarityBadgeProps) {
  const getRarityColor = (rarity: string) => {
    const rarityLower = rarity.toLowerCase();

    if (rarityLower.includes('common')) {
      return {
        bg: 'bg-[#64748b]/20',
        border: 'border-[#64748b]/30',
        text: 'text-[#cbd5e1]',
      };
    } else if (rarityLower.includes('uncommon')) {
      return {
        bg: 'bg-[#22c55e]/20',
        border: 'border-[#22c55e]/30',
        text: 'text-[#22c55e]',
      };
    } else if (rarityLower.includes('rare') && !rarityLower.includes('holo')) {
      return {
        bg: 'bg-[#f59e0b]/20',
        border: 'border-[#f59e0b]/30',
        text: 'text-[#fcd34d]',
      };
    } else if (rarityLower.includes('holo')) {
      return {
        bg: 'bg-[#3b82f6]/20',
        border: 'border-[#3b82f6]/30',
        text: 'text-[#60a5fa]',
      };
    } else if (rarityLower.includes('ex') || rarityLower.includes('star')) {
      return {
        bg: 'bg-[#ec4899]/20',
        border: 'border-[#ec4899]/30',
        text: 'text-[#ec4899]',
      };
    } else {
      return {
        bg: 'bg-[#94a3b8]/20',
        border: 'border-[#94a3b8]/30',
        text: 'text-[#cbd5e1]',
      };
    }
  };

  const colors = getRarityColor(rarity);

  return (
    <span
      className={`inline-block rounded border px-2 py-1 text-xs font-semibold ${colors.bg} ${colors.border} ${colors.text}`}
    >
      {rarity}
    </span>
  );
}
