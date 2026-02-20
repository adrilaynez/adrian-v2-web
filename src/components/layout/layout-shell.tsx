"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLabModelRoute = pathname?.startsWith("/lab/") && pathname !== "/lab";

    return (
        <div className="relative flex min-h-screen flex-col">
            {!isLabModelRoute && <Navbar />}
            <main className="flex-1">{children}</main>
            {!isLabModelRoute && <Footer />}
        </div>
    );
}
