import React from 'react';
import { useTranslation } from '../i18n/i18n';

const Header = () => {
    const { t, language, setLanguage } = useTranslation();

    const toggleLanguage = () => {
        const newLang = language === 'en' ? 'fa' : 'en';
        setLanguage(newLang);
    };

    return (
        <header className="bg-brand-secondary p-4 shadow-md sticky top-0 z-20 border-b border-brand-border">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold text-brand-accent tracking-wider">
                    {t('header.title')}
                </h1>
                <button
                    onClick={toggleLanguage}
                    className="text-brand-subtle hover:text-brand-accent transition-colors px-3 py-1 border border-brand-border rounded-md text-sm"
                >
                    {t('lang.toggle')}
                </button>
            </div>
        </header>
    );
}

export default Header;