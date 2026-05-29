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
} from "../../shared/api/hooks";
import { useAuth } from "../auth/hooks/use-auth";
import type { OrderRecord, PricePoint, StockQuote, TradeRecord } from "../../shared/api/validators";
import { SectionCard } from "../../shared/components/SectionCard";
import { AppShell } from "../../shared/layout/AppShell";
import { formatCurrency } from "../../shared/utils/format";
import { MarketChart } from "./components/MarketChart";
import { MarketPulseList } from "./components/MarketPulseList";
import { MarketTable } from "./components/MarketTable";
import { SummaryCard } from "./components/SummaryCard";
import "./dashboard-data-display.css";
import "./dashboard-page.css";

const socketUrl = import.meta.env.VITE_SOCKET_URL ?? "http://localhost:3000";
const ENABLE_STUBS =
  String(
    import.meta.env.VITE_USE_STUBS ?? import.meta.env.USE_STUBS ?? "false",
  ).toLowerCase() === "true";

import {
  STUB_QUOTES,
  STUB_PORTFOLIO,
  STUB_ORDERS,
  STUB_TRADES,
  buildStubHistory,
} from "./stubs";
import type { PortfolioSummary } from "@/shared/api/types";

export function DashboardPage() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const previousPricesRef = useRef<Record<string, number>>({});
  const [movementBySymbol, setMovementBySymbol] = useState<
    Record<string, "up" | "down" | "steady">
  >({});
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");

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
  activeSymbolRef.current = activeSymbol;

  const historyQuery = useStockHistory(activeSymbol, 24);

  useEffect(() => {
    for (const quote of quotes) {
      if (previousPricesRef.current[quote.symbol] === undefined) {
        previousPricesRef.current[quote.symbol] = quote.close;
      }
    }
  }, [quotes]);

  useEffect(() => {
    if (!ENABLE_STUBS) return;

    // Seed react-query cache with stub data so hooks return immediately
    queryClient.setQueryData(["market", "stocks"], STUB_QUOTES);
    queryClient.setQueryData(["market-stocks"], STUB_QUOTES); // legacy key compatibility
    queryClient.setQueryData(["portfolio", "summary"], STUB_PORTFOLIO);
    queryClient.setQueryData(["orders", "pending"], STUB_ORDERS);
    queryClient.setQueryData(["trades", "recent", 8], STUB_TRADES);

    for (const q of STUB_QUOTES) {
      const history = buildStubHistory(q.symbol, 24);
      queryClient.setQueryData(["market", "history", q.symbol, 24], history);
      queryClient.setQueryData(["market-history", q.symbol], history); // legacy key
      previousPricesRef.current[q.symbol] = q.close;
    }

    setMovementBySymbol(
      Object.fromEntries(
        STUB_QUOTES.map((q) => [q.symbol, "steady"]),
      ) as Record<string, "up" | "down" | "steady">,
    );
  }, [queryClient]);

  useEffect(() => {
    if (ENABLE_STUBS || quotes.length === 0) return;

    const socket = io(`${socketUrl}/realtime`, {
      transports: ["websocket"],
      auth: { token: token || undefined },
    });

    socket.on("connect", () => {
      for (const q of quotes) {
        socket.emit("subscribe", { topic: q.symbol });
      }
    });

    socket.on("price_update", (update) => {

      
      const { symbol, price, dayChangePercentage } = update;
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

    return () => {
      socket.disconnect();
    };
  }, [ENABLE_STUBS, quotes.length > 0, queryClient, token]);

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
        value: formatCurrency(portfolio.availableBalance),
        tone: "neutral" as const,
      },
      {
        label: "Capital invertido",
        value: formatCurrency(portfolio.investedValue),
        tone: "neutral" as const,
      },
      {
        label: "Patrimonio total",
        value: formatCurrency(portfolio.totalEquity),
        tone: "positive" as const,
      },
      {
        label: "Resultado no realizado",
        value: formatCurrency(portfolio.unrealizedProfitLoss),
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
  }, [openOrders.length, portfolio]);

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

  if (
    portfolioQuery.isLoading ||
    marketQuery.isLoading ||
    ordersQuery.isLoading ||
    tradesQuery.isLoading
  ) {
    return <div className="loading-screen">Cargando datos de Quill...</div>;
  }

  return (
    <AppShell
      title="Panel principal"
      subtitle="Lee el mercado, registra ordenes y sigue tu aprendizaje con una vista equilibrada y clara."
    >
      <section className="hero-panel">
        <div className="hero-panel__content">
          <p className="eyebrow">Quill en tiempo real</p>
          <h2>
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
        <div className="hero-panel__meta">
          <span className="hero-chip">Marca principal: Quill</span>
          <span className="hero-chip hero-chip--secondary">
            Equipo desarrollador: Atelynx
          </span>
        </div>
      </section>

      <div className="summary-grid">
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
        <MarketPulseList quotes={topMovers} />
      </SectionCard>

      <div className="dashboard-grid dashboard-grid--wide">
        <SectionCard
          title={`Mercado activo | ${activeSymbol}`}
          description={
            selectedQuote
              ? `Precio actual ${formatCurrency(
                  selectedQuote.close,
                )}. Selecciona otra accion en la tabla para cambiar la vista.`
              : "Selecciona una accion para revisar su evolucion."
          }
        >
          <MarketChart data={historyQuery.data as PricePoint[] ?? []} symbol={activeSymbol} />
        </SectionCard>

        <SectionCard
          title="Nueva orden limitada"
          description="Define el precio al que quieres entrar o salir. Quill la ejecutara automaticamente cuando el mercado llegue a ese valor."
        >
          <OrderForm quotes={quotes} selectedSymbol={activeSymbol} />
        </SectionCard>
      </div>

      <div className="dashboard-grid dashboard-grid--balanced">
        <SectionCard
          title="Mercado disponible"
          description="Haz clic en una accion para enfocarte en su grafica y preparar una orden."
        >
          <MarketTable
            movementBySymbol={movementBySymbol}
            onSelect={setSelectedSymbol}
            quotes={quotes}
            selectedSymbol={activeSymbol}
          />
        </SectionCard>

        <SectionCard
          title="Como leer este panel"
          description="Ayudas rapidas para usuarios que recien comienzan."
        >
          <div className="guide-list">
            <article>
              <strong>Saldo disponible</strong>
              <p>Es el capital que aun puedes usar para nuevas ordenes.</p>
            </article>
            <article>
              <strong>Orden limitada</strong>
              <p>
                No se ejecuta al instante: espera hasta que el mercado alcance
                tu precio objetivo.
              </p>
            </article>
            <article>
              <strong>Resultado no realizado</strong>
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
        <PortfolioTable positions={portfolio?.positions ?? []} />
      </SectionCard>

      <div className="dashboard-grid dashboard-grid--balanced">
        <SectionCard
          title="Ordenes abiertas"
          description="Quedaran aqui mientras esperan que el precio cumpla tu condicion."
        >
          <OrdersTable orders={openOrders} />
        </SectionCard>

        <SectionCard
          title="Operaciones recientes"
          description="Registro de compras y ventas ya ejecutadas por el motor del simulador."
        >
          <TradesTable trades={recentTrades} />
        </SectionCard>
      </div>
    </AppShell>
  );
}
