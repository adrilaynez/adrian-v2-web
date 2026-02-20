"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { en } from './en';
import { es } from './es';
import { Language, TranslationDictionary } from './types';

const dictionaries: Record<Language, TranslationDictionary> = {
    en,
    es,
};

// Recursive function to get value from nested key string
function getNestedValue(obj: any, key: string): string | undefined {
    if (!key) return undefined;
    const keys = key.split('.');
    let current = obj;

    for (const k of keys) {
        if (current === undefined || current === null) return undefined;
        current = current[k];
    }

    if (typeof current === 'string') return current;
    if (typeof current === 'number') return String(current);

    return undefined;
}

interface I18nContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
    // Initialize from storage or default to 'en', but avoid hydration mismatch via useEffect
    const [language, setLanguageState] = useState<Language>('en');
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('lm-lab-language') as Language;
        if (saved && (saved === 'en' || saved === 'es')) {
            setLanguageState(saved);
            document.cookie = `lm-lab-language=${saved}; path=/; max-age=31536000; samesite=lax`;
        }
        setIsInitialized(true);
    }, []);

    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('lm-lab-language', lang);
        document.cookie = `lm-lab-language=${lang}; path=/; max-age=31536000; samesite=lax`;
    }, []);

    const t = useCallback((key: string): string => {
        return (
            getNestedValue(dictionaries[language], key) ??
            getNestedValue(dictionaries.en, key) ??
            key
        );
    }, [language]);

    useEffect(() => {
        if (isInitialized) {
            document.documentElement.lang = language;
        }
    }, [language, isInitialized]);

    // Prevent flash of wrong content if needed, though for text replacement it might be fine to default to EN
    // For this tasks requirement "English is source of truth", defaulting to EN is correct.

    return (
        <I18nContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (context === undefined) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
}
