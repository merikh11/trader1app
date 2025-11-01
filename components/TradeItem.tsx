import React, { useState } from 'react';
import type { TradeWithPL } from '../types';
import { TradeType } from '../types';
import { formatCurrency, formatDate } from '../utils';
import AiAnalysis from './AiAnalysis';
import { useTranslation } from '../i18n/i18n';

interface TradeItemProps {
    trade: TradeWithPL;
}

const DetailItem: React.FC<{ label: string; value?: string | number; children?: React.ReactNode; className?: string }> = ({ label, value, children, className }) => (
    <div className={className}>
        <p className="text-brand-subtle">{label}</p>
        {value && <p className="text-brand-text font-mono">{value}</p>}
        {children}
    </div>
);

const TradeItem: React.FC<TradeItemProps> = ({ trade }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { t, language } = useTranslation();
    const isProfit = trade.pl >= 0;
    const isLong = trade.tradeType === TradeType.LONG;
    const locale = language === 'fa' ? 'fa-IR' : 'en-US';

    return (
        <div className={`rounded-lg shadow-lg overflow-hidden border ${isProfit ? 'border-brand-success/30' : 'border-brand-danger/30'}`}>
            <div
                className={`p-4 cursor-pointer flex justify-between items-center ${isProfit ? 'bg-brand-success-light' : 'bg-brand-danger-light'}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div>
                    <span className="font-bold text-lg text-brand-text">{trade.symbol}</span>
                    <span className={`mx-3 px-2 py-0.5 rounded-full text-xs font-semibold ${isLong ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'}`}>
                        {trade.tradeType}
                    </span>
                     <span className="text-sm text-brand-subtle">{`${formatDate(trade.date, language)} @ ${trade.time}`}</span>
                </div>
                <div className="text-right">
                    <span className={`text-lg font-bold ${isProfit ? 'text-brand-success' : 'text-brand-danger'}`}>
                        {formatCurrency(trade.pl, locale)}
                    </span>
                    <span className="text-xs text-brand-subtle block">{t('tradeItem.pl')}</span>
                </div>
            </div>
            {isOpen && (
                <div className="p-4 bg-brand-secondary">
                    <h4 className="text-lg font-semibold text-brand-text mb-3">{t('tradeItem.details')}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <DetailItem label={t('tradeItem.entryPrice')} value={formatCurrency(trade.entryPrice, locale)} />
                        <DetailItem label={t('tradeItem.exitPrice')} value={formatCurrency(trade.exitPrice, locale)} />
                        <DetailItem label={t('tradeItem.stopLoss')} value={formatCurrency(trade.stopLoss, locale)} />
                        <DetailItem label={t('tradeItem.takeProfit')} value={formatCurrency(trade.takeProfit, locale)} />
                        <DetailItem label={t('tradeItem.size')} value={trade.size} />
                        <DetailItem label={t('tradeItem.session')} value={t(`session.${trade.session.toLowerCase().replace(' ', '_')}`)} />
                        <DetailItem label={t('tradeItem.strategy')} value={trade.strategy || t('tradeItem.notApplicable')} />
                        <DetailItem label={t('tradeItem.emotions')} value={trade.emotions || t('tradeItem.notApplicable')} />
                    </div>

                    {trade.preTradeAnalysis && (
                        <DetailItem label={t('tradeItem.preTradeAnalysis')} className="mb-4 text-sm">
                            <p className="text-brand-text text-sm p-3 bg-brand-primary rounded-md whitespace-pre-wrap mt-1">{trade.preTradeAnalysis}</p>
                        </DetailItem>
                    )}
                    {trade.postTradeAnalysis && (
                         <DetailItem label={t('tradeItem.postTradeAnalysis')} className="mb-4 text-sm">
                            <p className="text-brand-text text-sm p-3 bg-brand-primary rounded-md whitespace-pre-wrap mt-1">{trade.postTradeAnalysis}</p>
                        </DetailItem>
                    )}
                    {trade.notes && (
                        <DetailItem label={t('tradeItem.notes')} className="mb-4 text-sm">
                            <p className="text-brand-text text-sm p-3 bg-brand-primary rounded-md whitespace-pre-wrap mt-1">{trade.notes}</p>
                        </DetailItem>
                    )}
                    {trade.imageUrl && (
                        <DetailItem label={t('tradeItem.setupImage')} className="mb-4 text-sm">
                           <a href={trade.imageUrl} target="_blank" rel="noopener noreferrer">
                             <img src={trade.imageUrl} alt={t('tradeItem.setupImage')} className="mt-2 rounded-lg border border-brand-border max-w-full h-auto max-h-80 object-contain" />
                           </a>
                        </DetailItem>
                    )}

                    <AiAnalysis trade={trade} />
                </div>
            )}
        </div>
    );
};

export default TradeItem;