import { CardPrice } from '@/types/card';
import TrendBadge from './TrendBadge';
import { formatPrice } from '@/lib/format';

interface PriceTiersProps {
  price: CardPrice;
}

export default function PriceTiers({ price }: PriceTiersProps) {
  return (
    <div className="rounded-lg border border-[#1e293b] bg-[#1a2236] p-6">
      <h3 className="mb-6 text-lg font-semibold text-[#e2e8f0]">Price Breakdown</h3>

      <div className="space-y-4">
        {/* Raw - Market Price (Highlighted) */}
        {price.market && (
          <div className="rounded-lg border border-[#3b82f6]/30 bg-[#0b0f1a] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#94a3b8]">Market Price (Raw)</p>
                <p className="font-mono text-2xl font-semibold text-[#22c55e]">
                  {formatPrice(price.market.price)}
                </p>
              </div>
              {price.market.change7d !== null && price.market.change7d !== undefined && (
                <TrendBadge value={price.market.change7d} size="md" />
              )}
            </div>
            <p className="mt-2 text-xs text-[#64748b]">
              Last updated: {price.market.lastUpdate
                ? new Date(price.market.lastUpdate).toLocaleDateString()
                : 'N/A'}
            </p>
          </div>
        )}

        {/* PSA 9 */}
        {price.psa9 && (
          <div className="rounded-lg border border-[#1e293b] bg-[#0b0f1a] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#94a3b8]">PSA 9</p>
                <p className="font-mono text-2xl font-semibold text-[#e2e8f0]">
                  {formatPrice(price.psa9.price)}
                </p>
              </div>
              {price.psa9.change7d !== null && price.psa9.change7d !== undefined && (
                <TrendBadge value={price.psa9.change7d} size="md" />
              )}
            </div>
            <p className="mt-2 text-xs text-[#64748b]">
              Last updated: {price.psa9.lastUpdate
                ? new Date(price.psa9.lastUpdate).toLocaleDateString()
                : 'N/A'}
            </p>
          </div>
        )}

        {/* PSA 10 */}
        {price.psa10 && (
          <div className="rounded-lg border border-[#1e293b] bg-[#0b0f1a] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#94a3b8]">PSA 10</p>
                <p className="font-mono text-2xl font-semibold text-[#e2e8f0]">
                  {formatPrice(price.psa10.price)}
                </p>
              </div>
              {price.psa10.change7d !== null && price.psa10.change7d !== undefined && (
                <TrendBadge value={price.psa10.change7d} size="md" />
              )}
            </div>
            <p className="mt-2 text-xs text-[#64748b]">
              Last updated: {price.psa10.lastUpdate
                ? new Date(price.psa10.lastUpdate).toLocaleDateString()
                : 'N/A'}
            </p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {price.market && (
        <div className="mt-6 border-t border-[#1e293b] pt-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {price.market.change24h !== null && (
              <div>
                <p className="text-xs text-[#94a3b8]">24h Change</p>
                <p className="text-sm font-semibold text-[#e2e8f0]">
                  {price.market.change24h !== undefined ? (
                    <span className={price.market.change24h > 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}>
                      {price.market.change24h > 0 ? '+' : ''}{price.market.change24h.toFixed(2)}%
                    </span>
                  ) : (
                    'N/A'
                  )}
                </p>
              </div>
            )}

            {price.market.change7d !== null && (
              <div>
                <p className="text-xs text-[#94a3b8]">7d Change</p>
                <p className="text-sm font-semibold text-[#e2e8f0]">
                  {price.market.change7d !== undefined ? (
                    <span className={price.market.change7d > 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}>
                      {price.market.change7d > 0 ? '+' : ''}{price.market.change7d.toFixed(2)}%
                    </span>
                  ) : (
                    'N/A'
                  )}
                </p>
              </div>
            )}

            {price.market.change30d !== null && (
              <div>
                <p className="text-xs text-[#94a3b8]">30d Change</p>
                <p className="text-sm font-semibold text-[#e2e8f0]">
                  {price.market.change30d !== undefined ? (
                    <span className={price.market.change30d > 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}>
                      {price.market.change30d > 0 ? '+' : ''}{price.market.change30d.toFixed(2)}%
                    </span>
                  ) : (
                    'N/A'
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
