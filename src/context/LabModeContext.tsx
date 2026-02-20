"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type LabMode = 'educational' | 'free';

interface LabModeContextType {
    mode: LabMode;
    setMode: (mode: LabMode) => void;
    /** True once the client has hydrated and localStorage has been read. */
    isInitialized: boolean;
}

const LabModeContext = createContext<LabModeContextType | undefined>(undefined);

export function LabModeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setModeState] = useState<LabMode>('educational');
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('lm-lab-mode') as LabMode;
        if (saved === 'educational' || saved === 'free') {
            setModeState(saved);
        }
        setIsInitialized(true);
    }, []);

    const setMode = useCallback((newMode: LabMode) => {
        setModeState(newMode);
        localStorage.setItem('lm-lab-mode', newMode);
    }, []);

    return (
        <LabModeContext.Provider value={{ mode, setMode, isInitialized }}>
            {children}
        </LabModeContext.Provider>
    );
}

export function useLabMode() {
    const context = useContext(LabModeContext);
    if (context === undefined) {
        throw new Error('useLabMode must be used within a LabModeProvider');
    }
    return context;
}
