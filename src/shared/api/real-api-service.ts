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
  type UpdateProfileInput,
  type ChangeEmailInput,
  type ChangePasswordInput,
  UserProfileSchema,
  WatchlistResponseSchema,
  type AddWatchlistInput,
  FriendSchema,
  FriendRequestSchema,
  type FriendActionInput,
  MessageResponseSchema,
  CurrencyRateSchema,
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

export const usersService = {
  getProfile: async () => {
    try {
      const response = await apiClient.get('/users/me');
      return UserProfileSchema.parse(response.data);
    } catch (error) {
      console.error('[API] Profile fetch failed:', error);
      throw error;
    }
  },

  updateProfile: async (data: UpdateProfileInput) => {
    try {
      const response = await apiClient.patch('/users/me', data);
      return UserProfileSchema.parse(response.data);
    } catch (error) {
      console.error('[API] Profile update failed:', error);
      throw error;
    }
  },

  changeEmail: async (data: ChangeEmailInput) => {
    try {
      await apiClient.patch('/users/me/email', data);
    } catch (error) {
      console.error('[API] Email change failed:', error);
      throw error;
    }
  },

  changePassword: async (data: ChangePasswordInput) => {
    try {
      await apiClient.patch('/users/me/password', data);
    } catch (error) {
      console.error('[API] Password change failed:', error);
      throw error;
    }
  },

  getWatchlist: async () => {
    try {
      const response = await apiClient.get('/users/me/watchlist');
      return StockQuoteSchema.array().parse(response.data);
    } catch (error) {
      console.error('[API] Watchlist fetch failed:', error);
      throw error;
    }
  },

  addToWatchlist: async (data: AddWatchlistInput) => {
    try {
      const response = await apiClient.post('/users/me/watchlist', data);
      return WatchlistResponseSchema.parse(response.data);
    } catch (error) {
      console.error('[API] Watchlist add failed:', error);
      throw error;
    }
  },

  removeFromWatchlist: async (symbol: string) => {
    try {
      const response = await apiClient.delete(`/users/me/watchlist/${symbol}`);
      return WatchlistResponseSchema.parse(response.data);
    } catch (error) {
      console.error('[API] Watchlist remove failed:', error);
      throw error;
    }
  },

  getFriends: async () => {
    try {
      const response = await apiClient.get('/users/me/friends');
      return FriendSchema.array().parse(response.data);
    } catch (error) {
      console.error('[API] Friends fetch failed:', error);
      throw error;
    }
  },

  getFriendRequests: async () => {
    try {
      const response = await apiClient.get('/users/me/friends/requests');
      return FriendRequestSchema.array().parse(response.data);
    } catch (error) {
      console.error('[API] Friend requests fetch failed:', error);
      throw error;
    }
  },

  sendFriendRequest: async (userId: string) => {
    try {
      const response = await apiClient.post(`/users/me/friends/${userId}`);
      return MessageResponseSchema.parse(response.data);
    } catch (error) {
      console.error('[API] Send friend request failed:', error);
      throw error;
    }
  },

  respondToFriendRequest: async (userId: string, data: FriendActionInput) => {
    try {
      const response = await apiClient.patch(`/users/me/friends/${userId}`, data);
      return MessageResponseSchema.parse(response.data);
    } catch (error) {
      console.error('[API] Friend request response failed:', error);
      throw error;
    }
  },

  removeFriend: async (userId: string) => {
    try {
      const response = await apiClient.delete(`/users/me/friends/${userId}`);
      return MessageResponseSchema.parse(response.data);
    } catch (error) {
      console.error('[API] Remove friend failed:', error);
      throw error;
    }
  },
};

export const currencyService = {
  getRates: async () => {
    try {
      const response = await apiClient.get('/currency/rates');
      return CurrencyRateSchema.array().parse(response.data);
    } catch (error) {
      console.error('[API] Currency rates fetch failed:', error);
      throw error;
    }
  },

  getRate: async (symbol: string) => {
    try {
      const response = await apiClient.get(`/currency/rates/${symbol}`);
      return CurrencyRateSchema.parse(response.data);
    } catch (error) {
      console.error('[API] Currency rate fetch failed for symbol:', symbol, error);
      throw error;
    }
  },
};