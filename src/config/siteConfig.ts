/**
 * Centralized Site & SEO Configuration
 *
 * Single source of truth for website URL, metadata, and canonical routing.
 * Overridable via `VITE_SITE_URL` environment variable.
 */

export const SITE_CONFIG = {
  name: 'Yeasin',
  legalFullName: 'Md Yeasin Mia',
  handle: 'yeasin4745',
  productionDomain: '',
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
   * Resolve the canonical base URL from environment or production default
   */
  getBaseUrl(): string {
    const metaEnv = (import.meta as unknown as { env?: Record<string, string> })?.env;
    const envUrl = metaEnv?.VITE_SITE_URL || metaEnv?.NEXT_PUBLIC_SITE_URL;
    if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
      const clean = envUrl.trim().replace(/\/+$/, '');
      if (!/\.vercel\.app/i.test(clean)) {
        return clean;
      }
    }
    if (typeof window !== 'undefined' && window.location?.origin) {
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
 * based on the active production URL configuration.
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

  const twitterUrlMeta = document.querySelector<HTMLMetaElement>('meta[property="twitter:url"]');
  if (twitterUrlMeta) twitterUrlMeta.content = canonicalUrl;

  // Keep JSON-LD identifiers and URLs aligned with the canonical runtime origin.
  const structuredData = document.querySelector<HTMLScriptElement>('script[type="application/ld+json"]');
  if (structuredData?.textContent) {
    try {
      const graph = JSON.parse(structuredData.textContent) as { '@graph'?: Array<Record<string, unknown>> };
      graph['@graph']?.forEach((item) => {
        if (item['@type'] === 'WebSite' || item['@type'] === 'Person') {
          item['@id'] = `${canonicalUrl}#${item['@type'] === 'WebSite' ? 'website' : 'person'}`;
          item.url = canonicalUrl;
          if (item['@type'] === 'WebSite' && item.publisher && typeof item.publisher === 'object') {
            (item.publisher as Record<string, unknown>)['@id'] = `${canonicalUrl}#person`;
          }
        }
      });
      structuredData.textContent = JSON.stringify(graph);
    } catch {
      // Ignore malformed optional structured data; SEO sync must not block startup.
    }
  }
}
