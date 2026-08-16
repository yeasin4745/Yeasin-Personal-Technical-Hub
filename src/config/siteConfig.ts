/**
 * Centralized Site & SEO Configuration
 *
 * Single source of truth for website URL, metadata, and canonical routing.
 * Uses `import.meta.env.VITE_SITE_URL` as the primary production URL configuration.
 * Automatically falls back to runtime origin in local/preview environments.
 */

export const SITE_CONFIG = {
  name: 'Yeasin',
  legalFullName: 'Md Yeasin Mia',
  handle: 'yeasin4745',
  title: 'Yeasin (yeasin4745) | Backend Development, Networking & Cybersecurity Hub',
  shortTitle: 'Yeasin | Backend & Network Security',
  description:
    'Personal Technical Hub of Yeasin (yeasin4745) — Technical learner exploring Backend Development, Computer Networking, Network Security, Linux Systems, and Hands-on Labs.',
  keywords: [
    'Yeasin',
    'yeasin4745',
    'yeasin_4745',
    '#yeasin',
    'Md Yeasin Mia',
    'Yeasin backend developer',
    'Yeasin computer networking',
    'Yeasin network security',
    'Yeasin cybersecurity',
    'Yeasin Linux systems',
  ],
  githubUrl: 'https://github.com/yeasin4745',
  email: 'yeasin.devx@gmail.com',

  /**
   * Resolve the canonical base URL from environment or browser runtime
   */
  getBaseUrl(): string {
    const metaEnv = (import.meta as unknown as { env?: Record<string, string> })?.env;
    const envUrl = metaEnv?.VITE_SITE_URL || metaEnv?.NEXT_PUBLIC_SITE_URL;
    if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
      return envUrl.trim().replace(/\/+$/, '');
    }
    if (typeof window !== 'undefined' && window.location && window.location.origin) {
      return window.location.origin;
    }
    return '';
  },

  /**
   * Build a fully qualified canonical URL for any path
   */
  getCanonicalUrl(path = '/'): string {
    const base = this.getBaseUrl();
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    if (!base) {
      return cleanPath;
    }
    return `${base}${cleanPath === '/' ? '/' : cleanPath}`;
  },
};

/**
 * Initializes and synchronizes client-side canonical tags, Open Graph URLs, and JSON-LD structured data
 * based on the active production URL configuration without hard-coding old domains.
 */
export function initSiteSeo(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const canonicalUrl = SITE_CONFIG.getCanonicalUrl('/');

  // 1. Synchronize Canonical Link Tag
  let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.href = canonicalUrl;

  // 2. Synchronize Open Graph URL
  let ogUrlMeta = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
  if (!ogUrlMeta) {
    ogUrlMeta = document.createElement('meta');
    ogUrlMeta.setAttribute('property', 'og:url');
    document.head.appendChild(ogUrlMeta);
  }
  ogUrlMeta.content = canonicalUrl;

  // 3. Synchronize JSON-LD Person Schema
  const jsonLdScript = document.querySelector<HTMLScriptElement>('script[type="application/ld+json"]');
  if (jsonLdScript) {
    try {
      const data = JSON.parse(jsonLdScript.textContent || '{}');
      data.url = canonicalUrl;
      data.name = SITE_CONFIG.name;
      data.alternateName = ['yeasin4745', 'yeasin_4745', '#yeasin', SITE_CONFIG.legalFullName];
      data.sameAs = [SITE_CONFIG.githubUrl];
      jsonLdScript.textContent = JSON.stringify(data, null, 2);
    } catch {
      // Keep existing structure if parse fails
    }
  }
}
