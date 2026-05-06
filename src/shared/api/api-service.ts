/**
 * Centralized API Service Layer
 * 
 * This is the single source of truth for all backend API calls.
 * Each service organizes endpoints by feature, with validation and error handling.
 */

import { apiClient } from './http';
import {
  AuthResponseSchema,
  type LoginInput,
  type RegisterInput,
  RegisterResponseSchema,
  PortfolioSummarySchema,
  StockQuoteSchema,
  PricePointSchema,
  OrderRecordSchema,
  type CreateOrderInput,
  TradeRecordSchema,
} from './validators';

/**
 * Authentication Service
 * Handles user login, registration, and auth-related API calls
 */
export const authService = {
  login: async (credentials: LoginInput) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const validated = AuthResponseSchema.parse(response.data);
      console.log('[API] Login successful', { email: credentials.email });
      return validated;
    } catch (error) {
      console.error('[API] Login failed:', error);
      throw error;
    }
  },

  register: async (data: RegisterInput) => {
    try {
      const response = await apiClient.post('/auth/register', data);
      const validated = RegisterResponseSchema.parse(response.data);
      console.log('[API] Registration successful', { email: data.email });
      return validated;
    } catch (error) {
      console.error('[API] Registration failed:', error);
      throw error;
    }
  },
};

/**
 * Portfolio Service
 * Handles portfolio-related API calls (positions, balances, etc.)
 */
export const portfolioService = {
  getSummary: async () => {
    try {
      const response = await apiClient.get('/portfolio/summary');
      const validated = PortfolioSummarySchema.parse(response.data);
      console.log('[API] Portfolio summary fetched');
      return validated;
    } catch (error) {
      console.error('[API] Portfolio summary fetch failed:', error);
      throw error;
    }
  },
};

/**
 * Market Service
 * Handles market data API calls (stocks, prices, history, etc.)
 */
export const marketService = {
  getStocks: async () => {
    try {
      const response = await apiClient.get('/market/stocks');
      const validated = StockQuoteSchema.array().parse(response.data);
      console.log('[API] Stock quotes fetched', { count: validated.length });
      return validated;
    } catch (error) {
      console.error('[API] Stock quotes fetch failed:', error);
      throw error;
    }
  },

  getStockHistory: async (symbol: string, limit: number = 24) => {
    try {
      const response = await apiClient.get(
        `/market/stocks/${symbol}/history?limit=${limit}`
      );
      const validated = PricePointSchema.array().parse(response.data);
      console.log('[API] Stock history fetched', { symbol, count: validated.length });
      return validated;
    } catch (error) {
      console.error('[API] Stock history fetch failed:', { symbol, error });
      throw error;
    }
  },
};

/**
 * Orders Service
 * Handles order-related API calls (list, create, cancel, etc.)
 */
export const ordersService = {
  getPending: async () => {
    try {
      const response = await apiClient.get('/orders?status=PENDING');
      const validated = OrderRecordSchema.array().parse(response.data);
      console.log('[API] Pending orders fetched', { count: validated.length });
      return validated;
    } catch (error) {
      console.error('[API] Pending orders fetch failed:', error);
      throw error;
    }
  },

  create: async (order: CreateOrderInput) => {
    try {
      await apiClient.post('/orders', order);
      console.log('[API] Order created', { symbol: order.symbol, side: order.side });
    } catch (error) {
      console.error('[API] Order creation failed:', { order, error });
      throw error;
    }
  },
};

/**
 * Trades Service
 * Handles trade-related API calls (list, history, etc.)
 */
export const tradesService = {
  getRecent: async (limit: number = 8) => {
    try {
      const response = await apiClient.get(`/trades?limit=${limit}`);
      const validated = TradeRecordSchema.array().parse(response.data);
      console.log('[API] Recent trades fetched', { count: validated.length });
      return validated;
    } catch (error) {
      console.error('[API] Recent trades fetch failed:', error);
      throw error;
    }
  },
};
