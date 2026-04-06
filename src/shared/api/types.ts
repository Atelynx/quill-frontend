export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  availableBalance: number;
  reservedBalance: number;
}

export interface AuthResponse {
  accessToken: string;
  user: UserProfile;
}

export interface RegisterResponse {
  message: string;
  email: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  fullName: string;
}

export interface StockQuote {
  _id?: string;
  symbol: string;
  name: string;
  sector: string;
  currency: string;
  currentPrice: number;
  previousClose: number;
  dayChangePercentage: number;
}

export interface PricePoint {
  symbol: string;
  price: number;
  createdAt: string;
}

export interface PortfolioPosition {
  symbol: string;
  quantity: number;
  reservedQuantity: number;
  averageCost: number;
  marketPrice: number;
  marketValue: number;
  unrealizedProfitLoss: number;
}

export interface PortfolioSummary {
  availableBalance: number;
  reservedBalance: number;
  investedValue: number;
  totalEquity: number;
  unrealizedProfitLoss: number;
  positions: PortfolioPosition[];
}

export interface TradeRecord {
  _id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  executionPrice: number;
  grossAmount: number;
  commissionAmount: number;
  netAmount: number;
  executedAt: string;
}

export interface OrderRecord {
  _id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  limitPrice: number;
  status: 'PENDING' | 'EXECUTED' | 'CANCELLED';
  executionPrice?: number;
  commissionAmount?: number;
  createdAt: string;
  executedAt?: string;
}
