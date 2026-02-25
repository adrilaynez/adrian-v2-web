"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

interface ScrollState {
    scrollY: number;
    scrollPct: number;
}

const ScrollContext = createContext<ScrollState>({ scrollY: 0, scrollPct: 0 });

/**
 * Provides { scrollY, scrollPct } via a single rAF-throttled scroll listener.
 * All lab components that need scroll position should consume this context
 * instead of attaching their own window scroll listeners.
 */
export function ScrollProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<ScrollState>({ scrollY: 0, scrollPct: 0 });
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        const update = () => {
            const y = window.scrollY;
            const total = document.documentElement.scrollHeight - window.innerHeight;
            const pct = total > 0 ? (y / total) * 100 : 0;
            setState({ scrollY: y, scrollPct: pct });
            rafRef.current = null;
        };

        const onEvent = () => {
            if (rafRef.current === null) {
                rafRef.current = requestAnimationFrame(update);
            }
        };

        window.addEventListener("scroll", onEvent, { passive: true });
        window.addEventListener("resize", onEvent);
        update();

        return () => {
            window.removeEventListener("scroll", onEvent);
            window.removeEventListener("resize", onEvent);
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return <ScrollContext.Provider value={state}>{children}</ScrollContext.Provider>;
}

export function useScroll(): ScrollState {
    return useContext(ScrollContext);
}
