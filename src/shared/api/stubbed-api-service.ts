import { delay } from './utils';
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
import {
  STUB_AUTH_RESPONSE,
  STUB_REGISTER_RESPONSE,
  STUB_ORDERS,
  STUB_PORTFOLIO,
  STUB_QUOTES,
  STUB_TRADES,
  buildStubHistory,
} from './stub-data';

const NETWORK_LATENCY_MS = 250;

export const authService = {
  login: async (_credentials: LoginInput) => {
    await delay(NETWORK_LATENCY_MS);
    return AuthResponseSchema.parse(STUB_AUTH_RESPONSE);
  },

  register: async (_data: RegisterInput) => {
    await delay(NETWORK_LATENCY_MS);
    return RegisterResponseSchema.parse(STUB_REGISTER_RESPONSE);
  },
};

export const portfolioService = {
  getSummary: async () => {
    await delay(NETWORK_LATENCY_MS);
    return PortfolioSummarySchema.parse(STUB_PORTFOLIO);
  },
};

export const marketService = {
  getStocks: async () => {
    await delay(NETWORK_LATENCY_MS);
    return StockQuoteSchema.array().parse(STUB_QUOTES);
  },

  getStockHistory: async (symbol: string, limit: number = 24) => {
    await delay(NETWORK_LATENCY_MS);
    return PricePointSchema.array().parse(buildStubHistory(symbol, limit));
  },
};

export const ordersService = {
  getPending: async () => {
    await delay(NETWORK_LATENCY_MS);
    return OrderRecordSchema.array().parse(STUB_ORDERS);
  },

  create: async (_order: CreateOrderInput) => {
    await delay(NETWORK_LATENCY_MS);
  },
};

export const tradesService = {
  getRecent: async (limit: number = 8) => {
    await delay(NETWORK_LATENCY_MS);
    return TradeRecordSchema.array().parse(STUB_TRADES.slice(0, limit));
  },
};