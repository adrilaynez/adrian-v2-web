"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
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

    // Per-language lookup cache — persists across renders, cleared on language change is not needed
    // because we keep a separate map per language key.
    const lookupCaches = useRef<Partial<Record<Language, Map<string, string>>>>({});

    useEffect(() => {
        const saved = localStorage.getItem('lm-lab-language') as Language;
        if (saved && (saved === 'en' || saved === 'es')) {
            setLanguageState(saved);
            document.cookie = `lm-lab-language=${saved}; path=/; max-age=31536000; samesite=lax`;
        }
        document.documentElement.lang = saved && (saved === 'en' || saved === 'es') ? saved : 'en';
    }, []);

    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('lm-lab-language', lang);
        document.cookie = `lm-lab-language=${lang}; path=/; max-age=31536000; samesite=lax`;
        document.documentElement.lang = lang;
    }, []);

    const t = useCallback((key: string): string => {
        if (!lookupCaches.current[language]) {
            lookupCaches.current[language] = new Map();
        }
        const cache = lookupCaches.current[language]!;
        const cached = cache.get(key);
        if (cached !== undefined) return cached;
        const result =
            getNestedValue(dictionaries[language], key) ??
            getNestedValue(dictionaries.en, key) ??
            key;
        cache.set(key, result);
        return result;
    }, [language]);

    // FIX: Memoize the context value so consumers only re-render when language actually changes,
    // not on every render of I18nProvider (which previously caused all 44+ consumers to re-render).
    const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

    return (
        <I18nContext.Provider value={value}>
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
