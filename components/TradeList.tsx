import React from 'react';
import type { TradeWithPL } from '../types';
import TradeItem from './TradeItem';
import { useTranslation } from '../i18n/i18n';
import Card from './Card';
import { DocumentChartBarIcon } from './icons/DocumentChartBarIcon';

interface TradeListProps {
    trades: TradeWithPL[];
}

const TradeList: React.FC<TradeListProps> = ({ trades }) => {
    const { t } = useTranslation();
    return (
        <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <h2 className="text-2xl font-bold mb-4 text-brand-text">{t('dashboard.tradeList.title')}</h2>
            <Card>
                {trades.length === 0 ? (
                    <div className="text-center py-16 px-4">
                        <DocumentChartBarIcon className="mx-auto h-12 w-12 text-brand-subtle" />
                        <h3 className="mt-4 text-lg font-semibold text-brand-text">{t('dashboard.tradeList.empty.title')}</h3>
                        <p className="mt-2 text-sm text-brand-subtle">{t('dashboard.tradeList.empty.description')}</p>
                    </div>
                ) : (
                    <div className="space-y-4 p-4">
                        {trades.map((trade, index) => (
                            <div key={trade.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                                <TradeItem trade={trade} />
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default TradeList;