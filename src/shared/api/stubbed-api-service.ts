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
  type UpdateProfileInput,
  type ChangeEmailInput,
  type ChangePasswordInput,
  UserProfileSchema,
  type AddWatchlistInput,
  type FriendActionInput,
  FriendSchema,
  FriendRequestSchema,
  WatchlistResponseSchema,
  MessageResponseSchema,
} from './validators';
import {
  STUB_AUTH_RESPONSE,
  STUB_REGISTER_RESPONSE,
  STUB_ORDERS,
  STUB_PORTFOLIO,
  STUB_QUOTES,
  STUB_TRADES,
  STUB_USER_PROFILE,
  STUB_FRIENDS,
  STUB_FRIEND_REQUESTS,
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

export const usersService = {
  getProfile: async () => {
    await delay(NETWORK_LATENCY_MS);
    return UserProfileSchema.parse(STUB_USER_PROFILE);
  },

  updateProfile: async (_data: UpdateProfileInput) => {
    await delay(NETWORK_LATENCY_MS);
    return UserProfileSchema.parse(STUB_USER_PROFILE);
  },

  changeEmail: async (_data: ChangeEmailInput) => {
    await delay(NETWORK_LATENCY_MS);
  },

  changePassword: async (_data: ChangePasswordInput) => {
    await delay(NETWORK_LATENCY_MS);
  },

  getWatchlist: async () => {
    await delay(NETWORK_LATENCY_MS);
    const watchlistSymbols = STUB_USER_PROFILE.watchlist;
    return StockQuoteSchema.array().parse(
      STUB_QUOTES.filter((q) => watchlistSymbols.includes(q.symbol)),
    );
  },

  addToWatchlist: async (data: AddWatchlistInput) => {
    await delay(NETWORK_LATENCY_MS);
    STUB_USER_PROFILE.watchlist = [
      ...new Set([...STUB_USER_PROFILE.watchlist, ...data.symbols]),
    ];
    return WatchlistResponseSchema.parse({
      watchlist: STUB_USER_PROFILE.watchlist,
    });
  },

  removeFromWatchlist: async (symbol: string) => {
    await delay(NETWORK_LATENCY_MS);
    STUB_USER_PROFILE.watchlist = STUB_USER_PROFILE.watchlist.filter(
      (s: string) => s !== symbol,
    );
    return WatchlistResponseSchema.parse({
      watchlist: STUB_USER_PROFILE.watchlist,
    });
  },

  getFriends: async () => {
    await delay(NETWORK_LATENCY_MS);
    return FriendSchema.array().parse(STUB_FRIENDS);
  },

  getFriendRequests: async () => {
    await delay(NETWORK_LATENCY_MS);
    return FriendRequestSchema.array().parse(STUB_FRIEND_REQUESTS);
  },

  sendFriendRequest: async (_userId: string) => {
    await delay(NETWORK_LATENCY_MS);
    return MessageResponseSchema.parse({ message: 'Solicitud enviada.' });
  },

  respondToFriendRequest: async (_userId: string, _data: FriendActionInput) => {
    await delay(NETWORK_LATENCY_MS);
    return MessageResponseSchema.parse({ message: 'Solicitud aceptada.' });
  },

  removeFriend: async (_userId: string) => {
    await delay(NETWORK_LATENCY_MS);
    return MessageResponseSchema.parse({ message: 'Amigo eliminado.' });
  },
};