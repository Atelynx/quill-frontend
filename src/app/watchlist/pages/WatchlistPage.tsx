import { useAuth } from '../../auth/hooks/use-auth';
import { useWatchlist, useMarketStocks } from '../../../shared/api/hooks';
import { useAddToWatchlistMutation, useRemoveFromWatchlistMutation } from '../../../shared/api/hooks';
import { AppShell } from '../../../shared/layout/AppShell';
import { SectionCard } from '../../../shared/components/SectionCard';
import { EmptyState } from '../../../shared/components/EmptyState';
import { Button } from '../../../shared/components/Button';
import { loadingScreen } from '../../../shared/design-system/layout';
import { surface } from '../../../shared/design-system/surfaces';
import { formatCurrency, formatPercentage } from '../../../shared/utils/format';
import { labels, watchlist } from '../../../shared/content/strings';
import { textPositive, textNegative } from '../../../shared/design-system/typography';
import { useAppSelector } from '../../../store/hooks';
import type { StockQuote } from '../../../shared/api/validators';
import { useMemo } from 'react';

export function WatchlistPage() {
  const { user, updateUser } = useAuth();
  const { data: watchlistStocks, isLoading: watchlistLoading } = useWatchlist();
  const { data: allStocks, isLoading: marketLoading } = useMarketStocks();
  const addMutation = useAddToWatchlistMutation();
  const removeMutation = useRemoveFromWatchlistMutation();
  const { preferredCurrency: currency, usdclpRate: rate } = useAppSelector(
    (state) => state.currency,
  );

  const watchlistSymbols = user?.watchlist ?? [];

  const availableStocks = useMemo(
    () => (allStocks ?? []).filter((s: StockQuote) => !watchlistSymbols.includes(s.symbol)),
    [allStocks, watchlistSymbols],
  );

  if (watchlistLoading || marketLoading) {
    return (
      <AppShell title={watchlist.title} subtitle={watchlist.subtitle}>
        <div className={loadingScreen}>{watchlist.loading}</div>
      </AppShell>
    );
  }

  const handleAdd = async (symbol: string) => {
    const result = await addMutation.mutateAsync({ symbols: [symbol] });
    updateUser({ watchlist: result.watchlist });
  };

  const handleRemove = async (symbol: string) => {
    const result = await removeMutation.mutateAsync(symbol);
    updateUser({ watchlist: result.watchlist });
  };

  const stocks = (watchlistStocks ?? []) as StockQuote[];

  return (
    <AppShell
      title={watchlist.title}
      subtitle={watchlist.subtitleDetail}
    >
      <SectionCard
        title={watchlist.favorites.title}
        description={stocks.length === 0 ? watchlist.favorites.emptyHint : watchlist.counter(stocks.length)}
      >
        {stocks.length === 0 ? (
          <EmptyState
            title={watchlist.empty.title}
            description={watchlist.empty.description}
          />
        ) : (
          <div className={`${surface.tableWrapper} responsive-table`}>
            <table className="w-full min-w-[640px] border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)]">{labels.table.symbol}</th>
                  <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)]">{labels.table.company}</th>
                  <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)]">{labels.table.price}</th>
                  <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)]">{labels.table.variation}</th>
                  <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)]"></th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => (
                  <tr key={stock.symbol} className="border-b border-[var(--main-page-border)]">
                    <td className="p-[0.85rem_0.75rem] border-b border-[var(--main-page-border)] font-semibold" data-label={labels.table.symbol}>
                      {stock.symbol}
                    </td>
                    <td className="p-[0.85rem_0.75rem] border-b border-[var(--main-page-border)]" data-label={labels.table.company}>
                      {stock.name}
                    </td>
                    <td className="p-[0.85rem_0.75rem] border-b border-[var(--main-page-border)]" data-label={labels.table.price}>
                      {formatCurrency(stock.close, { currency, rate })}
                    </td>
                    <td className={`p-[0.85rem_0.75rem] border-b border-[var(--main-page-border)] ${stock.dayChangePercentage >= 0 ? textPositive : textNegative}`} data-label={labels.table.variation}>
                      {formatPercentage(stock.dayChangePercentage)}
                    </td>
                    <td className="p-[0.85rem_0.75rem] border-b border-[var(--main-page-border)]" data-label="">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(stock.symbol)}
                        disabled={removeMutation.isPending}
                      >
                        {labels.action.remove}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {availableStocks.length > 0 ? (
        <SectionCard
          title={watchlist.addSection.title}
          description={watchlist.addSection.description}
        >
          <div className={`${surface.tableWrapper} responsive-table`}>
            <table className="w-full min-w-[640px] border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)]">{labels.table.symbol}</th>
                  <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)]">{labels.table.company}</th>
                  <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)]">{labels.table.price}</th>
                  <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)]"></th>
                </tr>
              </thead>
              <tbody>
                {availableStocks.map((stock) => (
                  <tr key={stock.symbol} className="border-b border-[var(--main-page-border)]">
                    <td className="p-[0.85rem_0.75rem] border-b border-[var(--main-page-border)] font-semibold" data-label={labels.table.symbol}>
                      {stock.symbol}
                    </td>
                    <td className="p-[0.85rem_0.75rem] border-b border-[var(--main-page-border)]" data-label={labels.table.company}>
                      {stock.name}
                    </td>
                    <td className="p-[0.85rem_0.75rem] border-b border-[var(--main-page-border)]" data-label={labels.table.price}>
                      {formatCurrency(stock.close, { currency, rate })}
                    </td>
                    <td className="p-[0.85rem_0.75rem] border-b border-[var(--main-page-border)]" data-label="">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAdd(stock.symbol)}
                        disabled={addMutation.isPending}
                      >
                        {labels.action.add}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      ) : null}
    </AppShell>
  );
}
