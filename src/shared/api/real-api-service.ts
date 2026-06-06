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

export const authService = {
  login: async (credentials: LoginInput) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return AuthResponseSchema.parse(response.data);
    } catch (error) {
      console.error('[API] Login failed:', error);
      throw error;
    }
  },

  register: async (data: RegisterInput) => {
    try {
      const response = await apiClient.post('/auth/register', data);
      return RegisterResponseSchema.parse(response.data);
    } catch (error) {
      console.error('[API] Registration failed:', error);
      throw error;
    }
  },
};

export const portfolioService = {
  getSummary: async () => {
    try {
      const response = await apiClient.get('/portfolio/summary');
      return PortfolioSummarySchema.parse(response.data);
    } catch (error) {
      console.error('[API] Portfolio summary fetch failed:', error);
      throw error;
    }
  },
};

export const marketService = {
  getStocks: async () => {
    try {
      const response = await apiClient.get('/market/stocks');
      return StockQuoteSchema.array().parse(response.data);
    } catch (error) {
      console.error('[API] Stock quotes fetch failed:', error);
      throw error;
    }
  },

  getStockHistory: async (symbol: string, limit: number = 24) => {
    try {
      const response = await apiClient.get(
        `/market/stocks/${symbol}/history?limit=${limit}`,
      );
      return PricePointSchema.array().parse(response.data);
    } catch (error) {
      console.error('[API] Stock history fetch failed:', { symbol, error });
      throw error;
    }
  },
};

export const ordersService = {
  getPending: async () => {
    try {
      const response = await apiClient.get('/orders?status=PENDING');
      return OrderRecordSchema.array().parse(response.data);
    } catch (error) {
      console.error('[API] Pending orders fetch failed:', error);
      throw error;
    }
  },

  create: async (order: CreateOrderInput) => {
    try {
      await apiClient.post('/orders', order);
    } catch (error) {
      console.error('[API] Order creation failed:', { order, error });
      throw error;
    }
  },
};

export const tradesService = {
  getRecent: async (limit: number = 8) => {
    try {
      const response = await apiClient.get(`/trades?limit=${limit}`);
      return TradeRecordSchema.array().parse(response.data);
    } catch (error) {
      console.error('[API] Recent trades fetch failed:', error);
      throw error;
    }
  },
};