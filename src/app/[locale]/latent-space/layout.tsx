import type { Metadata } from "next";

// Latent Space stays online but out of search results (only home and /projects are indexed).
export const metadata: Metadata = { robots: { index: false, follow: true } };

export default function LatentSpaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
