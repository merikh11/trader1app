import React, { useState, useRef } from 'react';
import type { Trade } from '../types';
import { TradeType, TradingSession } from '../types';
import { useTranslation } from '../i18n/i18n';
import { useToast } from '../context/ToastContext';
import Card from './Card';
import { CameraIcon } from './icons/CameraIcon';
import { CameraModal } from './CameraModal';
import { XMarkIcon } from './icons/XMarkIcon';
import { PlusIcon } from './icons/PlusIcon';


interface TradeFormProps {
    onAddTrade: (trade: Omit<Trade, 'id'>) => void;
}

const InputField = ({ id, label, type = "text", value, onChange, required = false, step }: { id: string, label: string, type?: string, value: string | number, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void, required?: boolean, step?: string }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-brand-subtle mb-1">
            {label}
        </label>
        <input
            type={type}
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            required={required}
            step={step}
            className="w-full bg-brand-primary border border-brand-border rounded-md shadow-sm px-3 py-2 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent"
        />
    </div>
);

const TextAreaField = ({ id, label, value, onChange, rows = 3 }: { id: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void, rows?: number }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-brand-subtle mb-1">
            {label}
        </label>
        <textarea
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            rows={rows}
            className="w-full bg-brand-primary border border-brand-border rounded-md shadow-sm px-3 py-2 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent"
        />
    </div>
);

const TradeForm: React.FC<TradeFormProps> = ({ onAddTrade }) => {
    const { t } = useTranslation();
    const { showToast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);

    const getInitialState = () => ({
        symbol: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        tradeType: TradeType.LONG,
        session: TradingSession.NEW_YORK,
        entryPrice: '',
        exitPrice: '',
        stopLoss: '',
        takeProfit: '',
        size: '',
        emotions: '',
        strategy: '',
        notes: '',
        preTradeAnalysis: '',
        postTradeAnalysis: '',
        imageUrl: '',
    });

    const [formData, setFormData] = useState(getInitialState());
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCapture = (imageDataUrl: string) => {
        setFormData(prev => ({ ...prev, imageUrl: imageDataUrl }));
        setIsCameraOpen(false);
    };
    
    const removeImage = () => {
        setFormData(prev => ({ ...prev, imageUrl: '' }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const tradeData: Omit<Trade, 'id'> = {
            ...formData,
            entryPrice: parseFloat(formData.entryPrice) || 0,
            exitPrice: parseFloat(formData.exitPrice) || 0,
            stopLoss: parseFloat(formData.stopLoss) || 0,
            takeProfit: parseFloat(formData.takeProfit) || 0,
            size: parseFloat(formData.size) || 0,
            imageUrl: formData.imageUrl || undefined,
        };
        
        onAddTrade(tradeData);
        showToast(t('tradeForm.toast.success'));
        setFormData(getInitialState());
        if (formRef.current) {
            formRef.current.reset();
        }
    };

    return (
        <>
        <Card>
            <form onSubmit={handleSubmit} ref={formRef} className="p-4 sm:p-6 space-y-4">
                <h2 className="text-xl font-bold text-brand-text mb-4">{t('tradeForm.title')}</h2>

                {/* Core Details */}
                <InputField id="symbol" label={t('tradeForm.symbol')} value={formData.symbol} onChange={handleChange} required />
                <div className="grid grid-cols-2 gap-4">
                    <InputField id="date" label={t('tradeForm.date')} type="date" value={formData.date} onChange={handleChange} required />
                    <InputField id="time" label={t('tradeForm.time')} type="time" value={formData.time} onChange={handleChange} required />
                </div>
                
                 {/* Trade Type */}
                <div>
                    <label className="block text-sm font-medium text-brand-subtle mb-1">{t('tradeForm.tradeType')}</label>
                    <div className="flex gap-4">
                        <label className="flex items-center space-x-2 text-brand-text">
                            <input type="radio" name="tradeType" value={TradeType.LONG} checked={formData.tradeType === TradeType.LONG} onChange={handleChange} className="form-radio text-brand-accent focus:ring-brand-accent" />
                            <span>{t('tradeType.long')}</span>
                        </label>
                        <label className="flex items-center space-x-2 text-brand-text">
                            <input type="radio" name="tradeType" value={TradeType.SHORT} checked={formData.tradeType === TradeType.SHORT} onChange={handleChange} className="form-radio text-brand-accent focus:ring-brand-accent" />
                            <span>{t('tradeType.short')}</span>
                        </label>
                    </div>
                </div>

                {/* Pricing Details */}
                 <div className="grid grid-cols-2 gap-4">
                    <InputField id="entryPrice" label={t('tradeForm.entryPrice')} type="number" step="any" value={formData.entryPrice} onChange={handleChange} required />
                    <InputField id="exitPrice" label={t('tradeForm.exitPrice')} type="number" step="any" value={formData.exitPrice} onChange={handleChange} required />
                    <InputField id="stopLoss" label={t('tradeForm.stopLoss')} type="number" step="any" value={formData.stopLoss} onChange={handleChange} required />
                    <InputField id="takeProfit" label={t('tradeForm.takeProfit')} type="number" step="any" value={formData.takeProfit} onChange={handleChange} required />
                </div>

                {/* Size & Session */}
                <div className="grid grid-cols-2 gap-4">
                     <InputField id="size" label={t('tradeForm.size')} type="number" step="any" value={formData.size} onChange={handleChange} required />
                     <div>
                        <label htmlFor="session" className="block text-sm font-medium text-brand-subtle mb-1">{t('tradeForm.session')}</label>
                        <select id="session" name="session" value={formData.session} onChange={handleChange} className="w-full bg-brand-primary border border-brand-border rounded-md shadow-sm px-3 py-2 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent">
                            {Object.values(TradingSession).map(s => (
                                <option key={s} value={s}>{t(`session.${s.toLowerCase().replace(' ', '_')}`)}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Qualitative Details */}
                <InputField id="strategy" label={t('tradeForm.strategy')} value={formData.strategy} onChange={handleChange} />
                <InputField id="emotions" label={t('tradeForm.emotions')} value={formData.emotions} onChange={handleChange} />

                {/* Analysis & Notes */}
                <TextAreaField id="preTradeAnalysis" label={t('tradeForm.preTradeAnalysis')} value={formData.preTradeAnalysis} onChange={handleChange} />
                <TextAreaField id="postTradeAnalysis" label={t('tradeForm.postTradeAnalysis')} value={formData.postTradeAnalysis} onChange={handleChange} />
                <TextAreaField id="notes" label={t('tradeForm.notes')} value={formData.notes} onChange={handleChange} />

                {/* Image Upload */}
                <div>
                     <label className="block text-sm font-medium text-brand-subtle mb-1">{t('tradeForm.setupImage')}</label>
                     {formData.imageUrl ? (
                        <div className="relative group">
                            <img src={formData.imageUrl} alt="Trade setup" className="rounded-md border border-brand-border max-h-48 w-full object-contain" />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label={t('tradeForm.removeImage')}
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                     ) : (
                        <button type="button" onClick={() => setIsCameraOpen(true)} className="w-full flex items-center justify-center px-4 py-2 border-2 border-dashed border-brand-border text-brand-subtle rounded-lg hover:bg-brand-primary hover:border-brand-accent hover:text-brand-accent transition-colors">
                            <CameraIcon className="w-5 h-5 mr-2" />
                            {t('tradeForm.addImage')}
                        </button>
                     )}
                </div>

                {/* Submit */}
                <button type="submit" className="w-full flex items-center justify-center bg-brand-accent text-brand-primary font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-all">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    {t('tradeForm.submit')}
                </button>
            </form>
        </Card>
        {isCameraOpen && <CameraModal onClose={() => setIsCameraOpen(false)} onCapture={handleCapture} />}
        </>
    );
};

export default TradeForm;
