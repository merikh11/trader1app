export enum TradeType {
  LONG = 'Long',
  SHORT = 'Short',
}

export enum TradingSession {
    LONDON = 'London',
    NEW_YORK = 'New York',
    TOKYO = 'Tokyo',
    SYDNEY = 'Sydney'
}

export interface Trade {
  id: string;
  symbol: string;
  date: string;
  time: string;
  tradeType: TradeType;
  session: TradingSession;
  entryPrice: number;
  exitPrice: number;
  stopLoss: number;
  takeProfit: number;
  size: number;
  emotions?: string;
  strategy?: string;
  notes?: string;
  preTradeAnalysis?: string;
  postTradeAnalysis?: string;
  imageUrl?: string;
}

export interface TradeWithPL extends Trade {
  pl: number;
}

export interface Stats {
  totalPL: number;
  winRate: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  profitFactor: number | null;
  avgWin: number;
  avgLoss: number;
}