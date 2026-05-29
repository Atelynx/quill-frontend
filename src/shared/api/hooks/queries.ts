/**
 * Custom React Query hooks for data fetching
 * Encapsulates query configuration, caching strategy, and error handling
 */

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { portfolioService, marketService, ordersService, tradesService } from '../api-service';

/**
 * Hook to fetch portfolio summary
 * Caches for 30 seconds before considering stale
 */
export function usePortfolioSummary() {
  const query = useQuery({
    queryKey: ['portfolio', 'summary'],
    queryFn: portfolioService.getSummary,
    staleTime: 30000, // 30 seconds
    retry: 1,
  });

  useEffect(() => {
    if (query.error) {
      console.error('[Query] Portfolio summary fetch failed:', query.error);
    }
  }, [query.error]);

  return query;
}

/**
 * Hook to fetch stock quotes/market data
 * Caches for 10 seconds before considering stale
 */
export function useMarketStocks() {
  const query = useQuery({
    queryKey: ['market', 'stocks'],
    queryFn: marketService.getStocks,
    staleTime: 10000, // 10 seconds
    retry: 1,
  });

  useEffect(() => {
    if (query.error) {
      console.error('[Query] Market stocks fetch failed:', query.error);
    }
  }, [query.error]);

  return query;
}

/**
 * Hook to fetch pending orders
 * Caches for 15 seconds before considering stale
 */
export function usePendingOrders() {
  const query = useQuery({
    queryKey: ['orders', 'pending'],
    queryFn: ordersService.getPending,
    staleTime: 15000, // 15 seconds
    retry: 1,
  });

  useEffect(() => {
    if (query.error) {
      console.error('[Query] Pending orders fetch failed:', query.error);
    }
  }, [query.error]);

  return query;
}

/**
 * Hook to fetch recent trades
 * Caches for 20 seconds before considering stale
 */
export function useRecentTrades(limit: number = 8) {
  const query = useQuery({
    queryKey: ['trades', 'recent', limit],
    queryFn: () => tradesService.getRecent(limit),
    staleTime: 20000, // 20 seconds
    retry: 1,
  });

  useEffect(() => {
    if (query.error) {
      console.error('[Query] Recent trades fetch failed:', query.error);
    }
  }, [query.error]);

  return query;
}

/**
 * Hook to fetch stock price history
 * Depends on symbol parameter, refetches when symbol changes
 */
export function useStockHistory(symbol: string, limit: number = 24) {
  const query = useQuery({
    queryKey: ['market', 'history', symbol, limit],
    queryFn: () => marketService.getStockHistory(symbol, limit),
    staleTime: 5000, // 5 seconds (more frequent updates for chart data)
    retry: 1,
    enabled: Boolean(symbol), // Only fetch if symbol is provided
  });

  useEffect(() => {
    if (query.error) {
      console.error('[Query] Stock history fetch failed for symbol:', symbol, query.error);
    }
  }, [query.error, symbol]);

  return query;
}
