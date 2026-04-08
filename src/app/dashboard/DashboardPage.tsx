import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { OrderForm } from '../orders/components/OrderForm';
import { OrdersTable } from '../orders/components/OrdersTable';
import { PortfolioTable } from '../portfolio/components/PortfolioTable';
import { TradesTable } from '../trades/components/TradesTable';
import { apiClient } from '../../shared/api/http';
import type {
  OrderRecord,
  PortfolioSummary,
  PricePoint,
  StockQuote,
  TradeRecord,
} from '../../shared/api/types';
import { SectionCard } from '../../shared/components/SectionCard';
import { AppShell } from '../../shared/layout/AppShell';
import { formatCurrency } from '../../shared/utils/format';
import { MarketChart } from './components/MarketChart';
import { MarketPulseList } from './components/MarketPulseList';
import { MarketTable } from './components/MarketTable';
import { SummaryCard } from './components/SummaryCard';
import './dashboard-data-display.css';
import './dashboard-page.css';

const socketUrl = import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:3000';

export function DashboardPage() {
  const queryClient = useQueryClient();
  const previousPricesRef = useRef<Record<string, number>>({});
  const [movementBySymbol, setMovementBySymbol] = useState<
    Record<string, 'up' | 'down' | 'steady'>
  >({});
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');

  const portfolioQuery = useQuery({
    queryKey: ['portfolio-summary'],
    queryFn: async () => {
      const { data } = await apiClient.get<PortfolioSummary>('/portfolio/summary');
      return data;
    },
  });

  const marketQuery = useQuery({
    queryKey: ['market-stocks'],
    queryFn: async () => {
      const { data } = await apiClient.get<StockQuote[]>('/market/stocks');
      return data;
    },
  });

  const ordersQuery = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await apiClient.get<OrderRecord[]>('/orders?status=PENDING');
      return data;
    },
  });

  const tradesQuery = useQuery({
    queryKey: ['trades'],
    queryFn: async () => {
      const { data } = await apiClient.get<TradeRecord[]>('/trades?limit=8');
      return data;
    },
  });

  const quotes = useMemo(() => marketQuery.data ?? [], [marketQuery.data]);
  const activeSymbol = quotes.find((quote) => quote.symbol === selectedSymbol)
    ? selectedSymbol
    : quotes[0]?.symbol ?? selectedSymbol;

  const historyQuery = useQuery({
    queryKey: ['market-history', activeSymbol],
    queryFn: async () => {
      const { data } = await apiClient.get<PricePoint[]>(
        `/market/stocks/${activeSymbol}/history?limit=24`,
      );
      return data;
    },
    enabled: Boolean(activeSymbol),
  });

  useEffect(() => {
    for (const quote of quotes) {
      if (previousPricesRef.current[quote.symbol] === undefined) {
        previousPricesRef.current[quote.symbol] = quote.currentPrice;
      }
    }
  }, [quotes]);

  useEffect(() => {
    const socket = io(socketUrl, {
      transports: ['websocket'],
    });

    socket.on('market.quotes', (incomingQuotes: StockQuote[]) => {
      const nextMovements: Record<string, 'up' | 'down' | 'steady'> = {};

      for (const quote of incomingQuotes) {
        const previousPrice = previousPricesRef.current[quote.symbol];

        if (previousPrice === undefined || previousPrice === quote.currentPrice) {
          nextMovements[quote.symbol] = 'steady';
        } else {
          nextMovements[quote.symbol] =
            quote.currentPrice > previousPrice ? 'up' : 'down';
        }

        previousPricesRef.current[quote.symbol] = quote.currentPrice;
      }

      setMovementBySymbol(nextMovements);
      queryClient.setQueryData(['market-stocks'], incomingQuotes);

      const activeQuote = incomingQuotes.find((quote) => quote.symbol === activeSymbol);

      if (activeQuote) {
        queryClient.setQueryData<PricePoint[]>(
          ['market-history', activeSymbol],
          (currentPoints = []) => {
            const nextPoint = {
              symbol: activeQuote.symbol,
              price: activeQuote.currentPrice,
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
  }, [activeSymbol, queryClient]);

  const portfolio = portfolioQuery.data;
  const openOrders = ordersQuery.data ?? [];
  const recentTrades = tradesQuery.data ?? [];
  const selectedQuote = quotes.find((quote) => quote.symbol === activeSymbol);

  const summaryCards = useMemo(() => {
    if (!portfolio) {
      return [];
    }

    return [
      {
        label: 'Saldo disponible',
        value: formatCurrency(portfolio.availableBalance),
        tone: 'neutral' as const,
      },
      {
        label: 'Capital invertido',
        value: formatCurrency(portfolio.investedValue),
        tone: 'neutral' as const,
      },
      {
        label: 'Patrimonio total',
        value: formatCurrency(portfolio.totalEquity),
        tone: 'positive' as const,
      },
      {
        label: 'Resultado no realizado',
        value: formatCurrency(portfolio.unrealizedProfitLoss),
        tone:
          portfolio.unrealizedProfitLoss >= 0
            ? ('positive' as const)
            : ('negative' as const),
      },
      {
        label: 'Ordenes abiertas',
        value: `${openOrders.length}`,
        tone: 'neutral' as const,
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
              : 'Mercado en seguimiento'}
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
                  selectedQuote.currentPrice,
                )}. Selecciona otra accion en la tabla para cambiar la vista.`
              : 'Selecciona una accion para revisar su evolucion.'
          }
        >
          <MarketChart data={historyQuery.data ?? []} symbol={activeSymbol} />
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
              <p>
                Es el capital que aun puedes usar para nuevas ordenes.
              </p>
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
