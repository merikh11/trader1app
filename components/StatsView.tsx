import React from 'react';
import type { Stats } from '../types';
import { formatCurrency } from '../utils';
import { useTranslation } from '../i18n/i18n';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import Card from './Card';

interface StatsViewProps {
    stats: Stats;
}

const StatItem: React.FC<{ label: string; value: string; color?: string; }> = ({ label, value, color = 'text-brand-text' }) => (
    <div className="text-center">
        <span className={`block font-bold text-xl ${color}`}>{value}</span>
        <span className="text-sm text-brand-subtle">{label}</span>
    </div>
);


const StatsView: React.FC<StatsViewProps> = ({ stats }) => {
    const { t, language } = useTranslation();
    const { totalPL, winRate, totalTrades, winningTrades, profitFactor, avgWin, avgLoss } = stats;

    const totalPLColor = totalPL >= 0 ? 'text-brand-success' : 'text-brand-danger';
    const locale = language === 'fa' ? 'fa-IR' : 'en-US';

    const winRateData = [
        { name: 'Win', value: winRate },
        { name: 'Loss', value: 100 - winRate },
    ];

    const COLORS = ['#238636', '#30363D'];

    return (
        <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold mb-4 text-brand-text">{t('dashboard.stats.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <Card className="md:col-span-1 flex flex-col items-center justify-center p-4">
                    <div className="w-full h-48">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={winRateData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    startAngle={90}
                                    endAngle={450}
                                    paddingAngle={0}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {winRateData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                     <Label
                                        value={`${winRate.toFixed(1)}%`}
                                        position="center"
                                        fill="#C9D1D9"
                                        className="text-3xl font-bold"
                                    />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-lg font-semibold text-brand-text mt-2">{t('dashboard.stats.winRate')}</p>
                </Card>

                <Card className="md:col-span-2 p-6 grid grid-cols-2 grid-rows-3 gap-y-6 gap-x-4 content-around">
                     <div className="text-center col-span-2">
                        <span className={`block font-bold text-4xl ${totalPLColor}`}>{formatCurrency(totalPL, locale)}</span>
                        <span className="text-lg text-brand-subtle">{t('dashboard.stats.totalPL')}</span>
                    </div>
                    <StatItem label={t('dashboard.stats.profitFactor')} value={profitFactor ? profitFactor.toFixed(2) : t('tradeItem.notApplicable')} />
                    <StatItem label={t('dashboard.stats.totalTrades')} value={totalTrades.toString()} />
                    <StatItem label={t('dashboard.stats.avgWin')} value={formatCurrency(avgWin, locale)} color="text-brand-success" />
                    <StatItem label={t('dashboard.stats.avgLoss')} value={formatCurrency(avgLoss, locale)} color="text-brand-danger" />
                </Card>
            </div>
        </div>
    );
};

export default StatsView;