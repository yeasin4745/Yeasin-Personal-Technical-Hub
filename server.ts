import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  generateRss2Xml,
  generateJsonFeed,
  getAllFeedItems,
  getFeedItemsByCategory,
  CATEGORY_FEEDS,
  FeedCategorySlug,
} from './src/utils/rssFeed';
import { processContactRequest } from './src/server/contactHandler';

const app = express();
const PORT = 3000;

// Security & Parsing Middlewares with strict payload size limit (20KB)
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true, limit: '20kb' }));

// Comprehensive Security Headers Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=(), browsing-topics=(), payment=(), usb=()');
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self' https://ai.studio https://*.run.app https://*.google.com; upgrade-insecure-requests;"
  );

  next();
});

// ==========================================
// Hardened Contact API Endpoint (Express + Edge Compatible)
// ==========================================
app.all('/api/contact', async (req: Request, res: Response): Promise<void> => {
  await processContactRequest(req, res, req.body);
});

// ==========================================
// RSS 2.0 & JSON Feed Endpoints for Technical Posts & Labs
// ==========================================

const getBaseUrl = (req: Request): string => {
  const forwardedProto = req.headers['x-forwarded-proto'] as string;
  const protocol = forwardedProto ? forwardedProto.split(',')[0].trim() : req.protocol || 'https';
  const host = req.headers['x-forwarded-host'] || req.get('host') || 'localhost:3000';
  return `${protocol}://${host}`;
};

// Main RSS 2.0 XML Feed route
app.get(['/rss.xml', '/feed.xml', '/api/rss'], (req: Request, res: Response): void => {
  try {
    const baseUrl = getBaseUrl(req);
    const xml = generateRss2Xml(baseUrl);
    
    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=3600');
    res.status(200).send(xml);
  } catch (err) {
    console.error('[RSS Generation Error]', err);
    res.status(500).setHeader('Content-Type', 'text/plain').send('Failed to generate RSS feed.');
  }
});

// Category-Specific RSS 2.0 Feeds (/rss/networking.xml, /rss/cybersecurity.xml, /rss/backend.xml, /rss/linux.xml)
app.get(['/rss/:category.xml', '/rss/:category', '/api/rss/:category'], (req: Request, res: Response): void => {
  try {
    const rawCategory = req.params.category?.replace(/\.xml$/, '').toLowerCase() as FeedCategorySlug;
    if (!CATEGORY_FEEDS[rawCategory]) {
      res.status(404).setHeader('Content-Type', 'text/plain').send(`Unknown category feed '${rawCategory}'. Available: networking, cybersecurity, backend, linux`);
      return;
    }

    const baseUrl = getBaseUrl(req);
    const xml = generateRss2Xml(baseUrl, rawCategory);

    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=3600');
    res.status(200).send(xml);
  } catch (err) {
    console.error('[Category RSS Generation Error]', err);
    res.status(500).setHeader('Content-Type', 'text/plain').send('Failed to generate category RSS feed.');
  }
});

// JSON Feed 1.1 Specification route (supports ?category=...)
app.get(['/feed.json', '/api/feed.json'], (req: Request, res: Response): void => {
  try {
    const baseUrl = getBaseUrl(req);
    const categoryQuery = req.query.category as string | undefined;
    const validCat = categoryQuery && CATEGORY_FEEDS[categoryQuery.toLowerCase() as FeedCategorySlug]
      ? (categoryQuery.toLowerCase() as FeedCategorySlug)
      : undefined;

    const jsonFeed = generateJsonFeed(baseUrl, validCat);

    res.setHeader('Content-Type', 'application/feed+json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=3600');
    res.status(200).json(jsonFeed);
  } catch (err) {
    console.error('[JSON Feed Error]', err);
    res.status(500).json({ error: 'Failed to generate JSON feed' });
  }
});

// Quick REST summary of feed items for client components
app.get('/api/feed/items', (req: Request, res: Response): void => {
  const baseUrl = getBaseUrl(req);
  const categoryQuery = req.query.category as string | undefined;
  const validCat = categoryQuery && CATEGORY_FEEDS[categoryQuery.toLowerCase() as FeedCategorySlug]
    ? (categoryQuery.toLowerCase() as FeedCategorySlug)
    : undefined;

  const items = validCat ? getFeedItemsByCategory(baseUrl, validCat) : getAllFeedItems(baseUrl);
  res.status(200).json({ total: items.length, category: validCat || 'all', items });
});

// ==========================================
// Vite Integration (Dev) & Static Serving (Prod)
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[System Ready] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
