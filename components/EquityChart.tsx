import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils';
import { useTranslation } from '../i18n/i18n';
import Card from './Card';

interface EquityChartProps {
    data: { name: string; equity: number; date: string }[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  t: (key: string) => string;
  locale: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, t, locale }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-brand-secondary p-2 border border-brand-border rounded-md shadow-lg">
        <p className="label text-brand-subtle">{`${t('dashboard.equityChart.tooltip.trade')} ${label}`}</p>
        <p className="intro text-brand-text">{`${t('dashboard.equityChart.tooltip.equity')} ${formatCurrency(payload[0].value, locale)}`}</p>
        {/* FIX: Corrected typo from toLocaleDate oncologist() to toLocaleDateString() */}
        <p className="intro text-brand-subtle text-sm">{new Date(payload[0].payload.date).toLocaleDateString()}</p>
      </div>
    );
  }

  return null;
};

const EquityChart: React.FC<EquityChartProps> = ({ data }) => {
    const { t, language } = useTranslation();
    const locale = language === 'fa' ? 'fa-IR' : 'en-US';
    const strokeColor = data.length > 0 && data[data.length - 1].equity >= 0 ? '#238636' : '#DA3333';
    const gradientId = `colorEquity${strokeColor === '#238636' ? 'Up' : 'Down'}`;

    return (
        <div className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            <h2 className="text-2xl font-bold mb-4 text-brand-text">{t('dashboard.equityChart.title')}</h2>
            <Card className="w-full h-72 p-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                        <XAxis dataKey="name" stroke="#8B949E" tick={{ fontSize: 10 }} />
                        <YAxis stroke="#8B949E" tickFormatter={(value) => formatCurrency(value, locale)} tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
                        <Tooltip content={<CustomTooltip t={t} locale={locale} />} />
                        <Area type="monotone" dataKey="equity" stroke={strokeColor} fillOpacity={1} fill={`url(#${gradientId})`} strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};

export default EquityChart;