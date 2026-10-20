import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";

import { getProjectSlugs } from "./[locale]/projects/projects-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://adrianlaynez.dev";

/* Build a sitemap entry for one logical path, with per-locale hreflang alternates.
   Default locale (en) lives at the unprefixed URL; others are /<locale>/... (as-needed). */
function entry(path: string): MetadataRoute.Sitemap[number] {
  const url = (locale: string) =>
    locale === routing.defaultLocale ? `${SITE_URL}${path}` : `${SITE_URL}/${locale}${path}`;
  return {
    url: url(routing.defaultLocale),
    alternates: {
      languages: {
        ...Object.fromEntries(routing.locales.map((l) => [l, url(l)])),
        // x-default → the unprefixed default-locale URL (for unmatched languages).
        "x-default": url(routing.defaultLocale),
      },
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Only the home page and the projects are indexed: /lab moved to lm0.dev and
  // /latent-space is noindex (see next.config.mjs and the latent-space layout).
  const staticPaths = ["", "/projects"];

  const projectPaths = getProjectSlugs().map((slug) => `/projects/${slug}`);

  return [...staticPaths, ...projectPaths].map(entry);
}
