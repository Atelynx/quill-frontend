import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { OrderForm } from "../orders/components/OrderForm";
import { OrdersTable } from "../orders/components/OrdersTable";
import { PortfolioTable } from "../portfolio/components/PortfolioTable";
import { TradesTable } from "../trades/components/TradesTable";
import {
  usePortfolioSummary,
  useMarketStocks,
  useMarketStatus,
  usePendingOrders,
  useRecentTrades,
  useStockHistory,
  useAddToWatchlistMutation,
  useRemoveFromWatchlistMutation,
} from "../../shared/api/hooks";
import { useAuth } from "../auth/hooks/use-auth";
import type {
  OrderRecord,
  PricePoint,
  StockQuote,
  TradeRecord,
} from "../../shared/api/validators";
import { SectionCard } from "../../shared/components/SectionCard";
import { QueryErrorState } from "../../shared/components/QueryErrorState";
import { AppShell } from "../../shared/layout/AppShell";
import { gradient } from "../../shared/design-system/surfaces";
import {
  loadingScreen,
  heroPanelContent,
  heroPanelMeta,
  heroChip,
  summaryGrid,
  dashboardGridWide,
  dashboardGridBalanced,
  guideList,
  flexGrowCol,
} from "../../shared/design-system/layout";
import { eyebrow, textSoft, textMuted } from "../../shared/design-system/typography";
import { AnimatedCurrency } from "../../shared/components/AnimatedCurrency";
import { formatCurrency } from "../../shared/utils/format";
import { MarketChart } from "./components/MarketChart";
import { MarketPulseList } from "./components/MarketPulseList";
import { MarketTable } from "./components/MarketTable";
import { SummaryCard } from "./components/SummaryCard";
import { MarketStatusBadge } from "./components/MarketStatusBadge";
import { isStubMode } from "@/shared/api/stub-mode";
import type { PortfolioSummary } from "@/shared/api/types";
import { useForexDispatch } from "@/shared/hooks/useForexRate";
import { useAppSelector } from "@/store/hooks";

const socketUrl = import.meta.env.VITE_SOCKET_URL ?? "http://localhost:3000";

const panelLabels: Record<string, string> = {
  portfolio: 'Portafolio',
  orders: 'Ordenes abiertas',
  trades: 'Operaciones recientes',
};

interface MarketPriceUpdate {
  symbol: string;
  price: number;
  close?: number;
  dayChangePercentage?: number;
}

function isMarketPriceUpdate(value: unknown): value is MarketPriceUpdate {
  if (typeof value !== "object" || value === null) return false;

  return (
    "symbol" in value &&
    "price" in value &&
    typeof value.symbol === "string" &&
    typeof value.price === "number"
  );
}

export function DashboardPage() {
  const queryClient = useQueryClient();
  const { token, user, updateUser } = useAuth();
  const addWatchlistMutation = useAddToWatchlistMutation();
  const removeWatchlistMutation = useRemoveFromWatchlistMutation();
  const previousPricesRef = useRef<Record<string, number>>({});
  const [movementBySymbol, setMovementBySymbol] = useState<
    Record<string, "up" | "down" | "steady">
  >({});
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [selectedPanel, setSelectedPanel] = useState<
    "portfolio" | "orders" | "trades"
  >("portfolio");
  const { handleForexUpdate } = useForexDispatch();
  const { preferredCurrency: currency, usdclpRate: rate } = useAppSelector(
    (state) => state.currency,
  );

  // Use custom hooks for data fetching
  const portfolioQuery = usePortfolioSummary();
  const marketQuery = useMarketStocks();
  const marketStatusQuery = useMarketStatus();
  const ordersQuery = usePendingOrders();
  const tradesQuery = useRecentTrades(8);
  const confirmedMarketStatus =
    marketStatusQuery.isSuccess && !marketStatusQuery.isFetching
      ? marketStatusQuery.data
      : undefined;

  const quotes = useMemo<StockQuote[]>(
    () => marketQuery.data ?? [],
    [marketQuery.data],
  );
  const quoteSymbols = useMemo(
    () => quotes.map((quote) => quote.symbol).join(","),
    [quotes],
  );
  const activeSymbol = selectedSymbol
    ? quotes.find((q) => q.symbol === selectedSymbol)
      ? selectedSymbol
      : (quotes[0]?.symbol ?? "")
    : "";

  const activeSymbolRef = useRef(activeSymbol);

  useEffect(() => {
    activeSymbolRef.current = activeSymbol;
  }, [activeSymbol]);

  const historyQuery = useStockHistory(activeSymbol, 24);

  useEffect(() => {
    for (const quote of quotes) {
      if (previousPricesRef.current[quote.symbol] === undefined) {
        previousPricesRef.current[quote.symbol] = quote.close;
      }
    }
  }, [quotes]);

  useEffect(() => {
    if (isStubMode() || quoteSymbols.length === 0) return;

    const socket = io(`${socketUrl}/realtime`, {
      transports: ["websocket"],
      auth: { token: token || undefined },
    });

    socket.on("connect", () => {
      for (const symbol of quoteSymbols.split(",")) {
        socket.emit("subscribe", { topic: symbol });
      }
      socket.emit("subscribe", { topic: "USDCLP", type: "forex" });
    });

    socket.on("price_update", (update: unknown) => {
      if (!isMarketPriceUpdate(update)) return;

      const { symbol, price, dayChangePercentage } = update;

      if (symbol === "USDCLP") {
        handleForexUpdate({ symbol, close: update.close ?? price });
        return;
      }

      const previousPrice = previousPricesRef.current[symbol];

      if (previousPrice === undefined || previousPrice === price) {
        setMovementBySymbol((prev) => ({ ...prev, [symbol]: "steady" }));
      } else {
        setMovementBySymbol((prev) => ({
          ...prev,
          [symbol]: price > previousPrice ? "up" : "down",
        }));
      }

      previousPricesRef.current[symbol] = price;

      queryClient.setQueryData<StockQuote[]>(["market", "stocks"], (current) =>
        current?.map((q) =>
          q.symbol === symbol
            ? {
                ...q,
                close: price,
                dayChangePercentage:
                  dayChangePercentage ?? q.dayChangePercentage,
              }
            : q,
        ),
      );

      if (symbol === activeSymbolRef.current) {
        queryClient.setQueryData<PricePoint[]>(
          ["market", "history", symbol, 24],
          (currentPoints = []) => {
            const nextPoint: PricePoint = {
              symbol,
              price,
              createdAt: new Date().toISOString(),
            };
            return [...currentPoints.slice(-23), nextPoint];
          },
        );
      }
    });

    socket.on("connect_error", () => {
      console.error(
        "[ForexRate] WebSocket connection error — using static rate",
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [handleForexUpdate, queryClient, quoteSymbols, token]);

  const portfolio = portfolioQuery.data as PortfolioSummary;
  const openOrders = (ordersQuery.data as OrderRecord[]) ?? [];
  const recentTrades: TradeRecord[] = tradesQuery.data ?? [];
  const selectedQuote = quotes.find((quote) => quote.symbol === activeSymbol);

  const summaryCards = useMemo(() => {
    if (!portfolio) {
      return [];
    }

    return [
      {
        label: "Saldo disponible",
        value: portfolio.availableBalance,
        currency,
        rate,
        tone: "neutral" as const,
      },
      {
        label: "Capital invertido",
        value: portfolio.investedValue,
        currency,
        rate,
        tone: "neutral" as const,
      },
      {
        label: "Patrimonio total",
        value: portfolio.totalEquity,
        currency,
        rate,
        tone: "positive" as const,
      },
      {
        label: "Resultado no realizado",
        value: portfolio.unrealizedProfitLoss,
        currency,
        rate,
        tone:
          portfolio.unrealizedProfitLoss >= 0
            ? ("positive" as const)
            : ("negative" as const),
      },
      {
        label: "Ordenes abiertas",
        value: openOrders.length,
        tone: "neutral" as const,
      },
    ];
  }, [currency, openOrders.length, portfolio, rate]);

  const topMovers = useMemo(
    () =>
      [...quotes]
        .sort(
          (leftQuote, rightQuote) =>
            Math.abs(rightQuote.dayChangePercentage) -
            Math.abs(leftQuote.dayChangePercentage),
        )
        .slice(0, 3),
    [quotes],
  );

  const handleToggleWatchlist = async (symbol: string) => {
    const inWatchlist = user?.watchlist?.includes(symbol) ?? false;

    if (inWatchlist) {
      const result = await removeWatchlistMutation.mutateAsync(symbol);
      updateUser({ watchlist: result.watchlist });
    } else {
      const result = await addWatchlistMutation.mutateAsync({
        symbols: [symbol],
      });
      updateUser({ watchlist: result.watchlist });
    }
  };

  if (
    portfolioQuery.isLoading ||
    marketQuery.isLoading ||
    ordersQuery.isLoading ||
    tradesQuery.isLoading
  ) {
    return <div className={loadingScreen}>Cargando datos de Quill...</div>;
  }

  if (portfolioQuery.isError || marketQuery.isError || ordersQuery.isError) {
    return (
      <AppShell
        title="Panel principal"
        subtitle="Lee el mercado, registra ordenes y sigue tu aprendizaje con una vista equilibrada y clara."
      >
        <QueryErrorState
          message="No fue posible cargar los datos financieros necesarios para mostrar el panel."
          onRetry={() => {
            void portfolioQuery.refetch();
            void marketQuery.refetch();
            void ordersQuery.refetch();
          }}
        />
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Panel principal"
      subtitle="Lee el mercado, registra ordenes y sigue tu aprendizaje con una vista equilibrada y clara."
    >
      <section
        className={`${gradient.heroPanel} flex justify-between gap-4 rounded-[var(--main-page-radius-xl)] border border-[var(--main-page-border)] p-[1.3rem] shadow-[var(--main-page-shadow)] backdrop-blur-xl max-[820px]:flex-col max-[820px]:items-stretch`}
      >
        <div className={heroPanelContent}>
          <p className={eyebrow}>Quill en tiempo real</p>
          <h2 className="m-0">
            {selectedQuote
              ? `${selectedQuote.name} (${selectedQuote.symbol})`
              : "Mercado en seguimiento"}
          </h2>
          <p>
            El mercado mock actualiza precios y ordenes periodicamente para que
            practiques lectura de contexto, entradas con limite y gestion del
            portafolio.
          </p>
        </div>
        <div className={heroPanelMeta}>
          <MarketStatusBadge status={confirmedMarketStatus} />
          <span className={heroChip}>
            Moneda de cambio (USD): {formatCurrency(rate, { currency: "CLP" })}{" "}
            CLP{" "}
          </span>
        </div>
      </section>

      <div className={summaryGrid}>
        {summaryCards.map((card) => (
          <SummaryCard
            key={card.label}
            label={card.label}
            tone={card.tone}
            value={card.value}
            currency={card.currency}
            rate={card.rate}
          />
        ))}
      </div>

      <SectionCard
        title="Movimiento destacado del mercado"
        description="Estas acciones muestran la variacion diaria mas visible del simulador."
      >
        <MarketPulseList quotes={topMovers} currency={currency} rate={rate} />
      </SectionCard>

      <div className={dashboardGridWide}>
        <SectionCard
          title={
            activeSymbol ? `Mercado activo | ${activeSymbol}` : "Mercado activo"
          }
          description={
            selectedQuote ? (
              <>
                Precio actual{" "}
                <AnimatedCurrency
                  value={selectedQuote.close}
                  currency={currency}
                  sourceCurrency={selectedQuote.currency}
                  rate={rate}
                />
                . Selecciona otra accion en la tabla para cambiar la vista.
              </>
            ) : (
              "Selecciona una accion para revisar su evolucion."
            )
          }
          className="flex flex-col"
        >
          {activeSymbol ? (
            <div className={`${flexGrowCol} max-[720px]:flex-none max-[720px]:min-h-[380px]`}>
              <MarketChart
                currency={currency}
                data={(historyQuery.data as PricePoint[]) ?? []}
                rate={rate}
                sourceCurrency={selectedQuote?.currency ?? "USD"}
                symbol={activeSymbol}
              />
            </div>
          ) : (
            <div className={`${flexGrowCol} items-center justify-center gap-3`}>
              <svg
                className={`h-10 w-10 ${textMuted}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 3v18h18" />
                <path d="M7 16l4-8 4 4 4-6" />
              </svg>
              <p className={`m-0 max-w-[28ch] text-center text-[1.1rem] leading-relaxed ${textSoft}`}>
                Sin selección activa.
                <br />
                Elige una acción en la tabla para revisar su evolución.
              </p>
            </div>
          )}


            <div className="max-h-[45vh] max-[720px]:max-h-[35vh] overflow-auto">
              <MarketTable
                currency={currency}
                movementBySymbol={movementBySymbol}
                onSelect={setSelectedSymbol}
                quotes={quotes}
                rate={rate}
                selectedSymbol={activeSymbol}
                watchlist={user?.watchlist}
                onToggleWatchlist={handleToggleWatchlist}
              />
            </div>
 
        </SectionCard>

        <SectionCard
          title="Nueva orden limitada"
          description="Define el precio al que quieres entrar o salir. Quill la ejecutara automaticamente cuando el mercado llegue a ese valor."
        >
          <OrderForm
            quotes={quotes}
            rate={rate}
            selectedSymbol={activeSymbol}
            marketOpen={confirmedMarketStatus?.open}
            onSymbolChange={setSelectedSymbol}
          />
        </SectionCard>
        <div className={dashboardGridBalanced}></div>
      </div>

      {/* 
      <div className={dashboardGridBalanced}>
        <SectionCard
          title="Nueva orden limitada"
          description="Define el precio al que quieres entrar o salir. Quill la ejecutara automaticamente cuando el mercado llegue a ese valor."
        >
          <OrderForm
            quotes={quotes}
            rate={rate}
            selectedSymbol={activeSymbol}
            marketOpen={marketStatusQuery.data?.open ?? true}
            onSymbolChange={setSelectedSymbol}
          />
        </SectionCard>

        <SectionCard
          title="Como leer este panel"
          description="Ayudas rapidas para usuarios que recien comienzan."
        >
          <div className={guideList}>
            <article className="rounded-[var(--main-page-radius-md)] border border-[var(--main-page-border)] p-[0.95rem_1rem] shadow-[var(--main-page-shadow-soft)] [background:var(--gradient-pulse-card)]">
              <strong className="mb-[0.3rem] block">Saldo disponible</strong>
              <p>Es el capital que aun puedes usar para nuevas ordenes.</p>
            </article>
            <article className="rounded-[var(--main-page-radius-md)] border border-[var(--main-page-border)] p-[0.95rem_1rem] shadow-[var(--main-page-shadow-soft)] [background:var(--gradient-pulse-card)]">
              <strong className="mb-[0.3rem] block">Orden limitada</strong>
              <p>
                No se ejecuta al instante: espera hasta que el mercado alcance
                tu precio objetivo.
              </p>
            </article>
            <article className="rounded-[var(--main-page-radius-md)] border border-[var(--main-page-border)] p-[0.95rem_1rem] shadow-[var(--main-page-shadow-soft)] [background:var(--gradient-pulse-card)]">
              <strong className="mb-[0.3rem] block">
                Resultado no realizado
              </strong>
              <p>
                Muestra la ganancia o perdida estimada de posiciones que aun no
                has vendido.
              </p>
            </article>
          </div>
        </SectionCard>
      </div> */}

      <div className="sticky top-0 z-10 flex gap-6 border-b border-[var(--main-page-border)] bg-[var(--color-background)] pt-2">
        {Object.entries(panelLabels).map(([panel, label]) => {
          const isActive = selectedPanel === panel;
          return (
            <button
              key={panel}
              type="button"
              onClick={() => setSelectedPanel(panel as typeof selectedPanel)}
              className={`pb-3 text-[0.9rem] font-semibold transition-colors ${
                isActive
                  ? 'border-b-2 border-[var(--color-accent)] text-[var(--color-accent)]'
                  : 'text-[var(--main-page-text-soft)] hover:text-[var(--color-text)]'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {selectedPanel === "portfolio" && (
        <SectionCard
          title="Portafolio"
          description="Tus posiciones activas, costo promedio y valor de mercado actual."
        >
          <PortfolioTable
            currency={currency}
            positions={portfolio?.positions ?? []}
            rate={rate}
          />
        </SectionCard>
      )}

      {selectedPanel === "orders" && (
        <SectionCard
          title="Ordenes abiertas"
          description="Quedaran aqui mientras esperan que el precio cumpla tu condicion."
        >
          <OrdersTable currency={currency} orders={openOrders} rate={rate} />
        </SectionCard>
      )}

      {selectedPanel === "trades" && (
        <SectionCard
          title="Operaciones recientes"
          description="Registro de compras y ventas ya ejecutadas por el motor del simulador."
        >
          <TradesTable
            currency={currency}
            hasError={tradesQuery.isError}
            rate={rate}
            trades={recentTrades}
          />
        </SectionCard>
      )}
    </AppShell>
  );
}
