import fs from 'fs';
import path from 'path';
import { generateRss2Xml, generateJsonFeed, getAllFeedItems } from '../src/utils/rssFeed';

/**
 * RSS & Syndicate Feed Generator Script
 * Parses Projects, Security Labs, RFC Research, and Technical Pillars
 * to generate a valid RSS 2.0 XML file at /public/rss.xml (and /dist/rss.xml if dist exists)
 */
function generateFeeds() {
  const siteUrl = process.env.SITE_URL || 'https://yeasin4745-dev.vercel.app';
  console.log(`[RSS Generator] Generating feed for base URL: ${siteUrl}`);

  // 1. Gather all parsed items
  const items = getAllFeedItems(siteUrl);
  console.log(`[RSS Generator] Parsed ${items.length} total technical items:`);
  
  const projectCount = items.filter(i => i.type === 'project').length;
  const labCount = items.filter(i => i.type === 'lab').length;
  const researchCount = items.filter(i => i.type === 'research').length;
  const pillarCount = items.filter(i => i.type === 'pillar').length;
  
  console.log(`  • Verified Projects: ${projectCount}`);
  console.log(`  • Security & Networking Labs: ${labCount}`);
  console.log(`  • Research & RFC Analyses: ${researchCount}`);
  console.log(`  • Technical Pillars: ${pillarCount}`);

  // 2. Generate RSS 2.0 XML & JSON Feed
  const rssXml = generateRss2Xml(siteUrl);
  const jsonFeed = JSON.stringify(generateJsonFeed(siteUrl), null, 2);

  // 3. Write to public directory
  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const publicRssPath = path.join(publicDir, 'rss.xml');
  const publicFeedPath = path.join(publicDir, 'feed.xml');
  const publicJsonPath = path.join(publicDir, 'feed.json');

  fs.writeFileSync(publicRssPath, rssXml, 'utf-8');
  fs.writeFileSync(publicFeedPath, rssXml, 'utf-8');
  fs.writeFileSync(publicJsonPath, jsonFeed, 'utf-8');

  console.log(`[RSS Generator] Successfully generated:`);
  console.log(`  ✓ ${publicRssPath} (${(Buffer.byteLength(rssXml) / 1024).toFixed(2)} KB)`);
  console.log(`  ✓ ${publicFeedPath} (alias copy)`);
  console.log(`  ✓ ${publicJsonPath} (${(Buffer.byteLength(jsonFeed) / 1024).toFixed(2)} KB)`);

  // 4. If dist directory already exists (e.g. post-build), write there too
  const distDir = path.resolve(process.cwd(), 'dist');
  if (fs.existsSync(distDir)) {
    const distRssPath = path.join(distDir, 'rss.xml');
    const distFeedPath = path.join(distDir, 'feed.xml');
    const distJsonPath = path.join(distDir, 'feed.json');

    fs.writeFileSync(distRssPath, rssXml, 'utf-8');
    fs.writeFileSync(distFeedPath, rssXml, 'utf-8');
    fs.writeFileSync(distJsonPath, jsonFeed, 'utf-8');
    console.log(`  ✓ Synced to dist/ folder for production deployment.`);
  }

  console.log('[RSS Generator] Feed generation complete.');
}

generateFeeds();
