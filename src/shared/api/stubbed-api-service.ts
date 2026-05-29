import {
  STUB_QUOTES,
  STUB_PORTFOLIO,
  STUB_ORDERS,
  STUB_TRADES,
  buildStubHistory,
} from '../../app/dashboard/stubs';

function delay(ms = 150) {
  return new Promise((res) => setTimeout(res, ms));
}

export const authService = {
  login: async (credentials: any) => {
    await delay();
    return {
      accessToken: 'stub-token',
      user: {
        id: 'stub-user',
        fullName: 'Demo User',
        email: credentials.email ?? 'demo@quill.cl',
        availableBalance: STUB_PORTFOLIO.availableBalance,
        reservedBalance: STUB_PORTFOLIO.reservedBalance,
      },
    };
  },

  register: async (data: any) => {
    await delay();
    return {
      message: 'Registered (stub)',
      email: data.email,
    };
  },
};

export const portfolioService = {
  getSummary: async () => {
    await delay();
    return STUB_PORTFOLIO;
  },
};

export const marketService = {
  getStocks: async () => {
    await delay();
    return STUB_QUOTES;
  },

  getStockHistory: async (symbol: string, limit: number = 24) => {
    await delay();
    return buildStubHistory(symbol, limit);
  },
};

export const ordersService = {
  getPending: async () => {
    await delay();
    return STUB_ORDERS;
  },

  create: async (order: any) => {
    await delay();
    console.log('[STUB API] create order', order);
  },
};

export const tradesService = {
  getRecent: async (limit: number = 8) => {
    await delay();
    return STUB_TRADES.slice(0, limit);
  },
};
