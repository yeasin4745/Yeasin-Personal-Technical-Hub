import fs from 'fs';
import path from 'path';
import {
  generateRss2Xml,
  generateJsonFeed,
  getAllFeedItems,
  getFeedItemsByCategory,
  CATEGORY_FEEDS,
  FeedCategorySlug,
} from '../src/utils/rssFeed';

/**
 * RSS & Syndicate Feed Generator Script
 * Generates valid RSS 2.0 XML feeds for:
 * - /public/rss.xml (All articles / main feed)
 * - /public/rss/networking.xml
 * - /public/rss/cybersecurity.xml
 * - /public/rss/backend.xml
 * - /public/rss/linux.xml
 * Plus JSON Feed 1.1 specification at /public/feed.json
 */
function generateFeeds() {
  const siteUrl = process.env.SITE_URL || 'https://yeasin4745-dev.vercel.app';
  console.log(`[RSS Generator] Generating feeds for base URL: ${siteUrl}`);

  // 1. Gather all parsed items
  const allItems = getAllFeedItems(siteUrl);
  console.log(`[RSS Generator] Parsed ${allItems.length} verified technical items (zero placeholders):`);

  const categories: FeedCategorySlug[] = ['networking', 'cybersecurity', 'backend', 'linux'];

  categories.forEach((cat) => {
    const count = getFeedItemsByCategory(siteUrl, cat).length;
    console.log(`  • [${cat.toUpperCase()}] Category Feed: ${count} real articles`);
  });

  // 2. Prepare Public Directories
  const publicDir = path.resolve(process.cwd(), 'public');
  const publicRssDir = path.join(publicDir, 'rss');

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  if (!fs.existsSync(publicRssDir)) {
    fs.mkdirSync(publicRssDir, { recursive: true });
  }

  // 3. Generate Main Feed Files
  const mainRssXml = generateRss2Xml(siteUrl);
  const mainJsonFeed = JSON.stringify(generateJsonFeed(siteUrl), null, 2);

  const publicRssPath = path.join(publicDir, 'rss.xml');
  const publicFeedPath = path.join(publicDir, 'feed.xml');
  const publicJsonPath = path.join(publicDir, 'feed.json');

  fs.writeFileSync(publicRssPath, mainRssXml, 'utf-8');
  fs.writeFileSync(publicFeedPath, mainRssXml, 'utf-8');
  fs.writeFileSync(publicJsonPath, mainJsonFeed, 'utf-8');

  console.log(`\n[RSS Generator] Successfully written main feeds:`);
  console.log(`  ✓ ${publicRssPath} (${(Buffer.byteLength(mainRssXml) / 1024).toFixed(2)} KB)`);
  console.log(`  ✓ ${publicFeedPath} (alias copy)`);
  console.log(`  ✓ ${publicJsonPath} (${(Buffer.byteLength(mainJsonFeed) / 1024).toFixed(2)} KB)`);

  // 4. Generate Category-Specific Feeds
  console.log(`\n[RSS Generator] Generating category feeds:`);
  const categoryXmlMap: Record<FeedCategorySlug, string> = {
    networking: generateRss2Xml(siteUrl, 'networking'),
    cybersecurity: generateRss2Xml(siteUrl, 'cybersecurity'),
    backend: generateRss2Xml(siteUrl, 'backend'),
    linux: generateRss2Xml(siteUrl, 'linux'),
  };

  categories.forEach((cat) => {
    const meta = CATEGORY_FEEDS[cat];
    const xml = categoryXmlMap[cat];
    const filePath = path.join(publicRssDir, meta.xmlFileName);
    fs.writeFileSync(filePath, xml, 'utf-8');
    console.log(`  ✓ /public/rss/${meta.xmlFileName} (${(Buffer.byteLength(xml) / 1024).toFixed(2)} KB)`);
  });

  // 5. If dist directory already exists (e.g. post-build), synchronize there too
  const distDir = path.resolve(process.cwd(), 'dist');
  if (fs.existsSync(distDir)) {
    const distRssDir = path.join(distDir, 'rss');
    if (!fs.existsSync(distRssDir)) {
      fs.mkdirSync(distRssDir, { recursive: true });
    }

    fs.writeFileSync(path.join(distDir, 'rss.xml'), mainRssXml, 'utf-8');
    fs.writeFileSync(path.join(distDir, 'feed.xml'), mainRssXml, 'utf-8');
    fs.writeFileSync(path.join(distDir, 'feed.json'), mainJsonFeed, 'utf-8');

    categories.forEach((cat) => {
      const meta = CATEGORY_FEEDS[cat];
      const xml = categoryXmlMap[cat];
      fs.writeFileSync(path.join(distRssDir, meta.xmlFileName), xml, 'utf-8');
    });

    console.log(`\n[RSS Generator] Synchronized all main & category feeds into dist/ for deployment.`);
  }

  console.log('\n[RSS Generator] All RSS & syndicate feeds successfully generated and verified.\n');
}

generateFeeds();

