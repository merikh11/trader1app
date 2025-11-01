import { useState, useEffect, useMemo } from 'react';
import type { Trade, TradeWithPL, Stats } from '../types';
import { TradeType } from '../types';

const calculatePL = (trade: Trade): number => {
  if (trade.tradeType === TradeType.LONG) {
    return (trade.exitPrice - trade.entryPrice) * trade.size;
  } else {
    return (trade.entryPrice - trade.exitPrice) * trade.size;
  }
};

export const useTrades = () => {
  const [trades, setTrades] = useState<Trade[]>(() => {
    try {
      const savedTrades = localStorage.getItem('trades');
      return savedTrades ? JSON.parse(savedTrades) : [];
    } catch (error) {
      console.error('Error reading trades from localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('trades', JSON.stringify(trades));
    } catch (error) {
      console.error('Error saving trades to localStorage', error);
    }
  }, [trades]);

  const addTrade = (trade: Omit<Trade, 'id'>) => {
    const newTrade = { ...trade, id: new Date().toISOString() };
    setTrades(prevTrades => [newTrade, ...prevTrades]);
  };

  const tradesWithPL: TradeWithPL[] = useMemo(() => {
    return trades.map(trade => ({
      ...trade,
      pl: calculatePL(trade),
    })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [trades]);

  const stats: Stats = useMemo(() => {
    const totalTrades = tradesWithPL.length;
    if (totalTrades === 0) {
      return { totalPL: 0, winRate: 0, totalTrades: 0, winningTrades: 0, losingTrades: 0, profitFactor: null, avgWin: 0, avgLoss: 0 };
    }

    const totalPL = tradesWithPL.reduce((sum, trade) => sum + trade.pl, 0);
    const winningTrades = tradesWithPL.filter(t => t.pl > 0);
    const losingTrades = tradesWithPL.filter(t => t.pl < 0);
    
    const winRate = totalTrades > 0 ? (winningTrades.length / totalTrades) * 100 : 0;
    
    const totalGains = winningTrades.reduce((sum, t) => sum + t.pl, 0);
    const totalLosses = Math.abs(losingTrades.reduce((sum, t) => sum + t.pl, 0));

    const profitFactor = totalLosses > 0 ? totalGains / totalLosses : null;

    const avgWin = winningTrades.length > 0 ? totalGains / winningTrades.length : 0;
    const avgLoss = losingTrades.length > 0 ? totalLosses / losingTrades.length : 0;

    return {
      totalPL,
      winRate,
      totalTrades,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      profitFactor,
      avgWin,
      avgLoss,
    };
  }, [tradesWithPL]);

  const equityData = useMemo(() => {
    let cumulativePL = 0;
    return [...tradesWithPL].reverse().map((trade, index) => {
      cumulativePL += trade.pl;
      return { name: `Trade ${index + 1}`, equity: cumulativePL, date: trade.date };
    });
  }, [tradesWithPL]);


  return { tradesWithPL, addTrade, stats, equityData };
};
