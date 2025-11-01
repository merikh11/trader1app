import React from 'react';
import { useTrades } from '../hooks/useTrades';
import StatsView from './StatsView';
import EquityChart from './EquityChart';
import TradeList from './TradeList';
import TradeForm from './TradeForm';
import type { Trade } from '../types';

const Dashboard = () => {
    const { tradesWithPL, stats, equityData, addTrade } = useTrades();

    const handleAddTrade = (trade: Omit<Trade, 'id'>) => {
        addTrade(trade);
    };

    return (
        <div className="flex flex-col-reverse lg:flex-row gap-8">
            {/* Main content - Takes up 2/3 of the space on large screens */}
            <div className="w-full lg:w-2/3 space-y-8">
                <StatsView stats={stats} />
                {equityData.length > 0 && <EquityChart data={equityData} />}
                <TradeList trades={tradesWithPL} />
            </div>
            {/* Sidebar - Takes up 1/3 of the space on large screens */}
            <div className="w-full lg:w-1/3 lg:sticky lg:top-24 self-start animate-fade-in-up" style={{ animationDelay: '450ms' }}>
                 <div className="lg:max-h-[calc(100vh-7rem)] overflow-y-auto custom-scrollbar">
                    <TradeForm onAddTrade={handleAddTrade} />
                 </div>
            </div>
        </div>
    );
};

export default Dashboard;