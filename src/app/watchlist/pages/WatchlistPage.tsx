import { useAuth } from '../../auth/hooks/use-auth';
import { useWatchlist, useMarketStocks } from '../../../shared/api/hooks';
import { useAddToWatchlistMutation, useRemoveFromWatchlistMutation } from '../../../shared/api/hooks';
import { AppShell } from '../../../shared/layout/AppShell';
import { SectionCard } from '../../../shared/components/SectionCard';
import { EmptyState } from '../../../shared/components/EmptyState';
import { Button } from '../../../shared/components/Button';
import { QueryErrorState } from '../../../shared/components/QueryErrorState';
import { loadingScreen } from '../../../shared/design-system/layout';
import { surface } from '../../../shared/design-system/surfaces';
import { formatPercentage } from '../../../shared/utils/format';
import { AnimatedCurrency } from '../../../shared/components/AnimatedCurrency';
import { textPositive, textNegative, textSoft, textMuted } from '../../../shared/design-system/typography';
import { table } from '../../../shared/design-system';
import { useAppSelector } from '../../../store/hooks';
import type { StockQuote } from '../../../shared/api/validators';
import { useMemo } from 'react';

export function WatchlistPage() {
  const { user, updateUser } = useAuth();
  const watchlistQuery = useWatchlist();
  const marketQuery = useMarketStocks();
  const addMutation = useAddToWatchlistMutation();
  const removeMutation = useRemoveFromWatchlistMutation();
  const { preferredCurrency: currency, usdclpRate: rate } = useAppSelector(
    (state) => state.currency,
  );

  const watchlistSymbols = user?.watchlist;

  const availableStocks = useMemo(() => {
    const symbols = watchlistSymbols ?? [];
    return (marketQuery.data ?? []).filter((stock: StockQuote) => !symbols.includes(stock.symbol));
  }, [marketQuery.data, watchlistSymbols]);

  if (watchlistQuery.isLoading || marketQuery.isLoading) {
    return (
      <AppShell title="Lista de seguimiento" subtitle="Tus acciones favoritas.">
        <div className={loadingScreen}>Cargando lista de seguimiento...</div>
      </AppShell>
    );
  }

  if (watchlistQuery.isError || marketQuery.isError) {
    return (
      <AppShell title="Lista de seguimiento" subtitle="Tus acciones favoritas.">
        <QueryErrorState
          message="No fue posible cargar la lista de seguimiento y los datos del mercado."
          onRetry={() => {
            void watchlistQuery.refetch();
            void marketQuery.refetch();
          }}
        />
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

  const stocks = watchlistQuery.data as StockQuote[];

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
                  <th className={table.header}>Simbolo</th>
                  <th className={table.header}>Empresa</th>
                  <th className={table.header}>Precio</th>
                  <th className={table.header}>Variacion</th>
                  <th className={table.header}></th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => (
                  <tr key={stock.symbol} className={table.rowBorder}>
                    <td className={`${table.cell} font-semibold`} data-label="Simbolo">
                      {stock.symbol}
                    </td>
                    <td className={table.cell} data-label="Empresa">
                      {stock.name}
                    </td>
                    <td className={table.cell} data-label="Precio">
                      <AnimatedCurrency value={stock.close} currency={currency} sourceCurrency={stock.currency} rate={rate} />
                    </td>
                    <td className={`${table.cell} ${stock.dayChangePercentage >= 0 ? textPositive : textNegative}`} data-label="Variacion">
                      {formatPercentage(stock.dayChangePercentage)}
                    </td>
                    <td className={table.cell} data-label="">
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
                  <th className={table.header}>Simbolo</th>
                  <th className={table.header}>Empresa</th>
                  <th className={table.header}>Precio</th>
                  <th className={table.header}></th>
                </tr>
              </thead>
              <tbody>
                {availableStocks.map((stock) => (
                  <tr key={stock.symbol} className={table.rowBorder}>
                    <td className={`${table.cell} font-semibold`} data-label="Simbolo">
                      {stock.symbol}
                    </td>
                    <td className={table.cell} data-label="Empresa">
                      {stock.name}
                    </td>
                    <td className={table.cell} data-label="Precio">
                      <AnimatedCurrency value={stock.close} currency={currency} sourceCurrency={stock.currency} rate={rate} />
                    </td>
                    <td className={table.cell} data-label="">
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
