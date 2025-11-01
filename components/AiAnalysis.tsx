import React, { useState } from 'react';
import type { TradeWithPL } from '../types';
import { getTradeAnalysis } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';
import { useTranslation } from '../i18n/i18n';

interface AiAnalysisProps {
    trade: TradeWithPL;
}

const AiAnalysis: React.FC<AiAnalysisProps> = ({ trade }) => {
    const { t, language } = useTranslation();
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalysis = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await getTradeAnalysis(trade, language);
            setAnalysis(result);
        } catch (err) {
            setError(t('ai.error'));
        } finally {
            setIsLoading(false);
        }
    };

    if (analysis) {
        return (
            <div className="mt-4 p-4 bg-brand-secondary/50 border-l-4 border-brand-accent rounded-r-lg">
                <h4 className="font-semibold text-brand-accent flex items-center">
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    {t('ai.title')}
                </h4>
                <p className="text-sm text-brand-text mt-2 whitespace-pre-wrap">{analysis}</p>
            </div>
        );
    }
    
    if (!process.env.API_KEY) return null;

    return (
        <div className="mt-4">
            <button
                onClick={handleAnalysis}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-2 border border-brand-accent text-brand-accent rounded-lg hover:bg-brand-accent hover:text-brand-primary transition-colors duration-200 disabled:opacity-50"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('ai.button.loading')}
                    </>
                ) : (
                    <>
                        <SparklesIcon className="w-5 h-5 mr-2" />
                        {t('ai.button.get')}
                    </>
                )}
            </button>
            {error && <p className="text-brand-danger text-sm mt-2 text-center">{error}</p>}
        </div>
    );
};

export default AiAnalysis;