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
  usePendingOrders,
  useRecentTrades,
  useStockHistory,
  useAddToWatchlistMutation,
  useRemoveFromWatchlistMutation,
} from "../../shared/api/hooks";
import { useAuth } from "../auth/hooks/use-auth";
import type { OrderRecord, PricePoint, StockQuote, TradeRecord } from "../../shared/api/validators";
import { SectionCard } from "../../shared/components/SectionCard";
import { AppShell } from "../../shared/layout/AppShell";
import { gradient } from "../../shared/design-system/surfaces";
import { loadingScreen, heroPanelContent, heroPanelMeta, heroChip, heroChipSecondary, summaryGrid, dashboardGridWide, dashboardGridBalanced, guideList } from "../../shared/design-system/layout";
import { eyebrow } from "../../shared/design-system/typography";
import { formatCurrency } from "../../shared/utils/format";
import { MarketChart } from "./components/MarketChart";
import { MarketPulseList } from "./components/MarketPulseList";
import { MarketTable } from "./components/MarketTable";
import { SummaryCard } from "./components/SummaryCard";
import { isStubMode } from "@/shared/api/stub-mode";
import type { PortfolioSummary } from "@/shared/api/types";
import { useForexDispatch } from "@/shared/hooks/useForexRate";
import { useAppSelector } from "@/store/hooks";

const socketUrl = import.meta.env.VITE_SOCKET_URL ?? "http://localhost:3000";

export function DashboardPage() {
  const queryClient = useQueryClient();
  const { token, user, updateUser } = useAuth();
  const addWatchlistMutation = useAddToWatchlistMutation();
  const removeWatchlistMutation = useRemoveFromWatchlistMutation();
  const previousPricesRef = useRef<Record<string, number>>({});
  const [movementBySymbol, setMovementBySymbol] = useState<
    Record<string, "up" | "down" | "steady">
  >({});
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");
  const { handleForexUpdate } = useForexDispatch();
  const { preferredCurrency: currency, usdclpRate: rate } = useAppSelector(
    (state) => state.currency,
  );

  // Use custom hooks for data fetching
  const portfolioQuery = usePortfolioSummary();
  const marketQuery = useMarketStocks();
  const ordersQuery = usePendingOrders();
  const tradesQuery = useRecentTrades(8);

  const quotes = useMemo<StockQuote[]>(
    () => (marketQuery.data ?? []) as StockQuote[],
    [marketQuery.data],
  );
  const activeSymbol = quotes.find(
    (quote: { symbol: string }) => quote.symbol === selectedSymbol,
  )
    ? selectedSymbol
    : (quotes[0]?.symbol ?? selectedSymbol);

  const activeSymbolRef = useRef(activeSymbol);

  const historyQuery = useStockHistory(activeSymbol, 24);

  useEffect(() => {
    activeSymbolRef.current = activeSymbol;
  }, [activeSymbol]);

  useEffect(() => {
    for (const quote of quotes) {
      if (previousPricesRef.current[quote.symbol] === undefined) {
        previousPricesRef.current[quote.symbol] = quote.close;
      }
    }
  }, [quotes]);

  useEffect(() => {
    if (isStubMode() || quotes.length === 0) return;

    const socket = io(`${socketUrl}/realtime`, {
      transports: ["websocket"],
      auth: { token: token || undefined },
    });

    socket.on("connect", () => {
      for (const q of quotes) {
        socket.emit("subscribe", { topic: q.symbol });
      }
      socket.emit("subscribe", { topic: "USDCLP", type: "forex" });
    });

    socket.on("price_update", (update) => {
      const { symbol, price, dayChangePercentage } = update;

      if (symbol === "USDCLP") {
        handleForexUpdate(update);
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
      console.error("[ForexRate] WebSocket connection error — using static rate");
    });

    return () => {
      socket.disconnect();
    };
  }, [quotes.length > 0, queryClient, token]);

  const portfolio = portfolioQuery.data as PortfolioSummary;
  const openOrders = ordersQuery.data as OrderRecord[] ?? [];
  const recentTrades = tradesQuery.data as TradeRecord[];
  const selectedQuote = quotes.find((quote) => quote.symbol === activeSymbol);

  const summaryCards = useMemo(() => {
    if (!portfolio) {
      return [];
    }

    return [
      {
        label: "Saldo disponible",
        value: formatCurrency(portfolio.availableBalance, { currency, rate }),
        tone: "neutral" as const,
      },
      {
        label: "Capital invertido",
        value: formatCurrency(portfolio.investedValue, { currency, rate }),
        tone: "neutral" as const,
      },
      {
        label: "Patrimonio total",
        value: formatCurrency(portfolio.totalEquity, { currency, rate }),
        tone: "positive" as const,
      },
      {
        label: "Resultado no realizado",
        value: formatCurrency(portfolio.unrealizedProfitLoss, { currency, rate }),
        tone:
          portfolio.unrealizedProfitLoss >= 0
            ? ("positive" as const)
            : ("negative" as const),
      },
      {
        label: "Ordenes abiertas",
        value: `${openOrders.length}`,
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
      const result = await addWatchlistMutation.mutateAsync({ symbols: [symbol] });
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

  return (
    <AppShell
      title="Panel principal"
      subtitle="Lee el mercado, registra ordenes y sigue tu aprendizaje con una vista equilibrada y clara."
    >
      <section className={`${gradient.heroPanel} flex justify-between gap-4 rounded-[var(--main-page-radius-xl)] border border-[var(--main-page-border)] p-[1.3rem] shadow-[var(--main-page-shadow)] backdrop-blur-xl max-[820px]:flex-col max-[820px]:items-stretch`}>
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
          <span className={heroChip}>Marca principal: Quill</span>
          <span className={`${heroChip} ${heroChipSecondary}`}>
            Equipo desarrollador: Atelynx
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
          title={`Mercado activo | ${activeSymbol}`}
          description={
            selectedQuote
              ? `Precio actual ${formatCurrency(
                  selectedQuote.close,
                  { currency, rate },
                )}. Selecciona otra accion en la tabla para cambiar la vista.`
              : "Selecciona una accion para revisar su evolucion."
          }
        >
          <MarketChart
            currency={currency}
            data={historyQuery.data as PricePoint[] ?? []}
            rate={rate}
            symbol={activeSymbol}
          />
        </SectionCard>

        <SectionCard
          title="Nueva orden limitada"
          description="Define el precio al que quieres entrar o salir. Quill la ejecutara automaticamente cuando el mercado llegue a ese valor."
        >
          <OrderForm
            quotes={quotes}
            rate={rate}
            selectedSymbol={activeSymbol}
          />
        </SectionCard>
      </div>

      <div className={dashboardGridBalanced}>
        <SectionCard
          title="Mercado disponible"
          description="Haz clic en una accion para enfocarte en su grafica y preparar una orden."
        >
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
              <strong className="mb-[0.3rem] block">Resultado no realizado</strong>
              <p>
                Muestra la ganancia o perdida estimada de posiciones que aun no
                has vendido.
              </p>
            </article>
          </div>
        </SectionCard>
      </div>

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

      <div className={dashboardGridBalanced}>
        <SectionCard
          title="Ordenes abiertas"
          description="Quedaran aqui mientras esperan que el precio cumpla tu condicion."
        >
          <OrdersTable
            currency={currency}
            orders={openOrders}
            rate={rate}
          />
        </SectionCard>

        <SectionCard
          title="Operaciones recientes"
          description="Registro de compras y ventas ya ejecutadas por el motor del simulador."
        >
          <TradesTable
            currency={currency}
            rate={rate}
            trades={recentTrades}
          />
        </SectionCard>
      </div>
    </AppShell>
  );
}
