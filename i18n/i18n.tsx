import React, { createContext, useState, useContext, useEffect } from 'react';

type Language = 'en' | 'fa';
type Translations = Record<string, string>;

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(() => {
        const savedLang = localStorage.getItem('trade-journal-lang') as Language;
        return (savedLang && ['en', 'fa'].includes(savedLang)) ? savedLang : 'en';
    });

    const [translations, setTranslations] = useState<Record<Language, Translations> | null>(null);

    useEffect(() => {
        const fetchTranslations = async () => {
            try {
                const [enResponse, faResponse] = await Promise.all([
                    fetch('/i18n/locales/en.json'),
                    fetch('/i18n/locales/fa.json')
                ]);
                const en = await enResponse.json();
                const fa = await faResponse.json();
                setTranslations({ en, fa });
            } catch (error) {
                console.error("Failed to load translation files", error);
            }
        };
        fetchTranslations();
    }, []);

    useEffect(() => {
        if (translations) {
            document.documentElement.lang = language;
            document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
            localStorage.setItem('trade-journal-lang', language);
        }
    }, [language, translations]);

    const t = (key: string): string => {
        if (!translations) {
            return key; // Return key while translations are loading
        }
        return translations[language]?.[key] || key;
    };

    const value = {
        language,
        setLanguage,
        t,
    };
    
    // Don't render the app until translations are loaded to prevent FOUC
    if (!translations) {
        return null;
    }

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useTranslation = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
};
