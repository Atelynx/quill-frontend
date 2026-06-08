import { useAuth } from '../../auth/hooks/use-auth';
import { useWatchlist, useMarketStocks } from '../../../shared/api/hooks';
import { useAddToWatchlistMutation, useRemoveFromWatchlistMutation } from '../../../shared/api/hooks';
import { AppShell } from '../../../shared/layout/AppShell';
import { SectionCard } from '../../../shared/components/SectionCard';
import { EmptyState } from '../../../shared/components/EmptyState';
import { Button } from '../../../shared/components/Button';
import { loadingScreen } from '../../../shared/design-system/layout';
import { surface } from '../../../shared/design-system/surfaces';
import { formatPercentage } from '../../../shared/utils/format';
import { AnimatedCurrency } from '../../../shared/components/AnimatedCurrency';
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
      <AppShell title="Lista de seguimiento" subtitle="Tus acciones favoritas.">
        <div className={loadingScreen}>Cargando lista de seguimiento...</div>
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
      title="Lista de seguimiento"
      subtitle="Acciones que sigues de cerca."
    >
      <SectionCard
        title="Tus favoritos"
        description={stocks.length === 0 ? 'Agrega acciones desde el panel principal.' : `${stocks.length} acciones en seguimiento`}
      >
        {stocks.length === 0 ? (
          <EmptyState
            title="Sin seguimiento"
            description="Selecciona acciones como favoritas desde la tabla del mercado en el Dashboard."
          />
        ) : (
          <div className={`${surface.tableWrapper} responsive-table`}>
            <table className="w-full min-w-[640px] border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)]">Simbolo</th>
                  <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)]">Empresa</th>
                  <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)]">Precio</th>
                  <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)]">Variacion</th>
                  <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)]"></th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => (
                  <tr key={stock.symbol} className="border-b border-[var(--main-page-border)]">
                    <td className="p-[0.85rem_0.75rem] border-b border-[var(--main-page-border)] font-semibold" data-label="Simbolo">
                      {stock.symbol}
                    </td>
                    <td className="p-[0.85rem_0.75rem] border-b border-[var(--main-page-border)]" data-label="Empresa">
                      {stock.name}
                    </td>
                    <td className="p-[0.85rem_0.75rem] border-b border-[var(--main-page-border)]" data-label="Precio">
                      <AnimatedCurrency value={stock.close} currency={currency} rate={rate} />
                    </td>
                    <td className={`p-[0.85rem_0.75rem] border-b border-[var(--main-page-border)] ${stock.dayChangePercentage >= 0 ? textPositive : textNegative}`} data-label="Variacion">
                      {formatPercentage(stock.dayChangePercentage)}
                    </td>
                    <td className="p-[0.85rem_0.75rem] border-b border-[var(--main-page-border)]" data-label="">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(stock.symbol)}
                        disabled={removeMutation.isPending}
                      >
                        Quitar
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
          title="Agregar acciones"
          description="Acciones disponibles que no estas siguiendo."
        >
          <div className={`${surface.tableWrapper} responsive-table`}>
            <table className="w-full min-w-[640px] border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)]">Simbolo</th>
                  <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)]">Empresa</th>
                  <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)]">Precio</th>
                  <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)]"></th>
                </tr>
              </thead>
              <tbody>
                {availableStocks.map((stock) => (
                  <tr key={stock.symbol} className="border-b border-[var(--main-page-border)]">
                    <td className="p-[0.85rem_0.75rem] border-b border-[var(--main-page-border)] font-semibold" data-label="Simbolo">
                      {stock.symbol}
                    </td>
                    <td className="p-[0.85rem_0.75rem] border-b border-[var(--main-page-border)]" data-label="Empresa">
                      {stock.name}
                    </td>
                    <td className="p-[0.85rem_0.75rem] border-b border-[var(--main-page-border)]" data-label="Precio">
                      <AnimatedCurrency value={stock.close} currency={currency} rate={rate} />
                    </td>
                    <td className="p-[0.85rem_0.75rem] border-b border-[var(--main-page-border)]" data-label="">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAdd(stock.symbol)}
                        disabled={addMutation.isPending}
                      >
                        Agregar
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
