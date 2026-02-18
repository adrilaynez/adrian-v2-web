"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLabRoute = pathname?.startsWith("/lab");

    return (
        <div className="relative flex min-h-screen flex-col">
            {!isLabRoute && <Navbar />}
            <main className="flex-1">{children}</main>
            {!isLabRoute && <Footer />}
        </div>
    );
}
