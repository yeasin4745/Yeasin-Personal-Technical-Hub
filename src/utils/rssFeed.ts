import { PERSONAL_INFO, SECURITY_LABS, RESEARCH_ITEMS, VERIFIED_PROJECTS, TECHNICAL_PILLARS } from '../data/portfolioData';

export type FeedCategorySlug = 'networking' | 'cybersecurity' | 'backend' | 'linux';

export interface FeedItem {
  id: string;
  title: string;
  link: string;
  canonicalUrl: string;
  description: string;
  contentSnippet?: string;
  category: string;
  tags: string[];
  feedCategories: FeedCategorySlug[];
  date: string;
  author: string;
  authorEmail: string;
  type: 'pillar' | 'lab' | 'research' | 'project';
}

export interface CategoryFeedMeta {
  slug: FeedCategorySlug;
  title: string;
  channelTitle: string;
  description: string;
  feedPath: string;
  xmlFileName: string;
}

export const CATEGORY_FEEDS: Record<FeedCategorySlug, CategoryFeedMeta> = {
  networking: {
    slug: 'networking',
    title: 'Computer Networking & Protocols',
    channelTitle: 'Yeasin | Computer Networking & Protocol Research',
    description: 'Technical articles, wire-level packet analyses, Wireshark captures, TCP/IP specifications, and routing architecture by Yeasin.',
    feedPath: '/rss/networking.xml',
    xmlFileName: 'networking.xml',
  },
  cybersecurity: {
    slug: 'cybersecurity',
    title: 'Network Security & Cybersecurity',
    channelTitle: 'Yeasin | Network Security & Defensive Systems',
    description: 'Defensive security articles, OWASP Top 10 research, REST API security audits, TLS encryption, and server hardening logs by Yeasin.',
    feedPath: '/rss/cybersecurity.xml',
    xmlFileName: 'cybersecurity.xml',
  },
  backend: {
    slug: 'backend',
    title: 'Backend Systems & Architecture',
    channelTitle: 'Yeasin | Backend Systems & Software Architecture',
    description: 'Backend engineering articles, asynchronous request pipelines, Node.js server architectures, REST API designs, and database flows by Yeasin.',
    feedPath: '/rss/backend.xml',
    xmlFileName: 'backend.xml',
  },
  linux: {
    slug: 'linux',
    title: 'Linux Systems & Internals',
    channelTitle: 'Yeasin | Linux Systems & Environment',
    description: 'Linux systems engineering articles, POSIX shell automation, kernel virtual filesystem exploration (/proc, /sys), systemd, and service management by Yeasin.',
    feedPath: '/rss/linux.xml',
    xmlFileName: 'linux.xml',
  },
};

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '\'':
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

/**
 * Returns all real, verified published technical items across pillars, labs, research, and verified projects.
 * Excludes pending/unverified slots to ensure zero fake or placeholder entries in RSS feeds.
 */
export function getAllFeedItems(baseUrl: string): FeedItem[] {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const authorName = PERSONAL_INFO.name;
  const authorEmail = PERSONAL_INFO.email;
  const authorFormatted = `${authorEmail} (${authorName})`;
  const items: FeedItem[] = [];

  // Base deterministic anchor date: 2026-08-20T12:00:00Z
  const baseEpoch = Date.UTC(2026, 7, 20, 12, 0, 0);

  // 1. Technical Pillars (Core Architectural Domain Articles)
  TECHNICAL_PILLARS.forEach((pillar, index) => {
    const codeSnippetText = pillar.codeSnippet
      ? `\n\nCode Implementation (${pillar.codeSnippet.language}):\n${pillar.codeSnippet.code}`
      : '';

    let feedCategories: FeedCategorySlug[] = [];
    if (pillar.id === 'networking') feedCategories = ['networking'];
    else if (pillar.id === 'security') feedCategories = ['cybersecurity'];
    else if (pillar.id === 'backend') feedCategories = ['backend'];
    else if (pillar.id === 'linux') feedCategories = ['linux'];

    const canonicalUrl = `${cleanBase}/#pillars`;
    const itemDate = new Date(baseEpoch - index * 86400000 * 3).toUTCString();

    items.push({
      id: `pillar-${pillar.id}`,
      title: `${pillar.title}: ${pillar.subtitle}`,
      link: canonicalUrl,
      canonicalUrl,
      description: `${pillar.description}\n\nArchitecture Focus: ${pillar.architectureFocus}\nKey Topics: ${pillar.keyTopics.join(' • ')}\nProtocols: ${pillar.protocols.join(', ')}${codeSnippetText}`,
      contentSnippet: pillar.description,
      category: pillar.title,
      tags: [...pillar.protocols, 'Architecture', 'Systems', pillar.title],
      feedCategories,
      date: itemDate,
      author: authorFormatted,
      authorEmail,
      type: 'pillar',
    });
  });

  // 2. Hands-on Security & Networking Labs
  SECURITY_LABS.forEach((lab, index) => {
    const codeSnippetText = lab.codeSnippet
      ? `\n\nLab Syntax & Commands (${lab.codeSnippet.language}):\n${lab.codeSnippet.code}`
      : '';

    const feedCategories: FeedCategorySlug[] = [];
    if (lab.domain === 'Networking' || lab.domain === 'Protocol Analysis') {
      feedCategories.push('networking');
    }
    if (lab.domain === 'Defensive Security') {
      feedCategories.push('cybersecurity');
      feedCategories.push('backend'); // API Security relates to backend endpoints
    }
    if (lab.domain === 'System Hardening') {
      feedCategories.push('linux');
      feedCategories.push('cybersecurity');
    }

    const canonicalUrl = `${cleanBase}/#labs`;
    const itemDate = new Date(baseEpoch - (index + 4) * 86400000 * 2).toUTCString();

    items.push({
      id: `lab-${lab.id}`,
      title: `[${lab.code}] ${lab.title}`,
      link: canonicalUrl,
      canonicalUrl,
      description: `${lab.summary}\n\nDomain: ${lab.domain} | Status: ${lab.status}\nTools: ${lab.toolsUsed.join(', ')}\nKey Takeaway: ${lab.keyTakeaway}${codeSnippetText}`,
      contentSnippet: lab.summary,
      category: lab.domain,
      tags: [lab.domain, ...lab.toolsUsed, lab.code, 'Security Lab'],
      feedCategories,
      date: itemDate,
      author: authorFormatted,
      authorEmail,
      type: 'lab',
    });
  });

  // 3. RFC Research & Protocol Studies
  RESEARCH_ITEMS.forEach((research, index) => {
    const codeSnippetText = research.codeSnippet
      ? `\n\nReference Probe Syntax (${research.codeSnippet.language}):\n${research.codeSnippet.code}`
      : '';

    const feedCategories: FeedCategorySlug[] = [];
    if (research.category === 'RFC & Protocol Study') {
      feedCategories.push('networking');
      if (research.id === 'rfc-9110') feedCategories.push('backend');
    } else if (research.category === 'Network Defense') {
      feedCategories.push('cybersecurity');
      feedCategories.push('backend');
    } else if (research.category === 'Linux Systems') {
      feedCategories.push('linux');
    } else if (research.category === 'Backend Patterns') {
      feedCategories.push('backend');
    }

    const canonicalUrl = `${cleanBase}/#research`;
    const itemDate = new Date(baseEpoch - (index + 8) * 86400000 * 2).toUTCString();

    items.push({
      id: `research-${research.id}`,
      title: research.title,
      link: canonicalUrl,
      canonicalUrl,
      description: `${research.notes}\n\nField: ${research.category} | Status: ${research.status}\nReferences: ${research.references.join(', ')}${codeSnippetText}`,
      contentSnippet: research.notes,
      category: research.category,
      tags: [research.category, ...research.references, 'Research Log'],
      feedCategories,
      date: itemDate,
      author: authorFormatted,
      authorEmail,
      type: 'research',
    });
  });

  // 4. Verified Real Code Projects (Strictly filter out unverified/pending slots)
  VERIFIED_PROJECTS.filter((proj) => proj.isVerifiedReal && !proj.requiresInput).forEach((proj, index) => {
    const feedCategories: FeedCategorySlug[] = [];
    if (proj.category === 'Backend') {
      feedCategories.push('backend');
    } else if (proj.category === 'Systems & Scripts') {
      feedCategories.push('linux');
      feedCategories.push('backend');
    } else if (proj.category === 'Networking') {
      feedCategories.push('networking');
    } else if (proj.category === 'Cybersecurity') {
      feedCategories.push('cybersecurity');
    }

    const canonicalUrl = proj.githubUrl || `${cleanBase}/#projects`;
    const itemDate = new Date(baseEpoch - (index + 14) * 86400000 * 3).toUTCString();

    items.push({
      id: `project-${proj.id}`,
      title: `[Repository] ${proj.title} (${proj.category})`,
      link: canonicalUrl,
      canonicalUrl,
      description: `${proj.description}\n\nTechnical Highlights:\n• ${proj.technicalHighlights.join('\n• ')}\n\nArchitecture Stack: ${proj.architectureTags.join(', ')}`,
      contentSnippet: proj.description,
      category: proj.category,
      tags: [proj.category, ...proj.architectureTags, 'GitHub Repository'],
      feedCategories,
      date: itemDate,
      author: authorFormatted,
      authorEmail,
      type: 'project',
    });
  });

  return items;
}

/**
 * Filter items by category slug
 */
export function getFeedItemsByCategory(baseUrl: string, category: FeedCategorySlug): FeedItem[] {
  const allItems = getAllFeedItems(baseUrl);
  return allItems.filter((item) => item.feedCategories.includes(category));
}

/**
 * Generates an RSS 2.0 XML document for either the main feed or a specific category feed.
 */
export function generateRss2Xml(baseUrl: string, category?: FeedCategorySlug): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const items = category ? getFeedItemsByCategory(cleanBase, category) : getAllFeedItems(cleanBase);
  const buildDate = new Date().toUTCString();
  const catMeta = category ? CATEGORY_FEEDS[category] : null;

  const feedTitle = catMeta
    ? catMeta.channelTitle
    : `${PERSONAL_INFO.name} (${PERSONAL_INFO.handle}) | Technical Articles & Systems Hub`;

  const feedDescription = catMeta
    ? catMeta.description
    : 'Technical articles, computer networking protocol analyses, cybersecurity labs, Linux systems internals, and backend engineering documentation by Yeasin.';

  const selfFeedUrl = catMeta
    ? `${cleanBase}${catMeta.feedPath}`
    : `${cleanBase}/rss.xml`;

  const xmlItems = items
    .map((item) => {
      const tagElements = item.tags
        .slice(0, 8)
        .map((t) => `      <category>${escapeXml(t)}</category>`)
        .join('\n');

      return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="false">${escapeXml(`${cleanBase}/article/${item.id}`)}</guid>
      <description><![CDATA[${item.description}]]></description>
      <dc:creator>Yeasin</dc:creator>
      <author>${escapeXml(item.author)}</author>
      <category>${escapeXml(item.category)}</category>
${tagElements}
      <pubDate>${item.date}</pubDate>
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(feedTitle)}</title>
    <link>${escapeXml(cleanBase)}</link>
    <description>${escapeXml(feedDescription)}</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <docs>https://www.rssboard.org/rss-specification</docs>
    <generator>Yeasin Technical Hub RSS Engine v2.0</generator>
    <managingEditor>${escapeXml(`${PERSONAL_INFO.email} (${PERSONAL_INFO.name})`)}</managingEditor>
    <webMaster>${escapeXml(`${PERSONAL_INFO.email} (${PERSONAL_INFO.name})`)}</webMaster>
    <atom:link href="${escapeXml(selfFeedUrl)}" rel="self" type="application/rss+xml" />
${xmlItems}
  </channel>
</rss>`;
}

/**
 * Generates JSON Feed 1.1 specification payload.
 */
export function generateJsonFeed(baseUrl: string, category?: FeedCategorySlug) {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const items = category ? getFeedItemsByCategory(cleanBase, category) : getAllFeedItems(cleanBase);
  const catMeta = category ? CATEGORY_FEEDS[category] : null;

  return {
    version: 'https://jsonfeed.org/version/1.1',
    title: catMeta ? catMeta.channelTitle : `${PERSONAL_INFO.name} (${PERSONAL_INFO.handle}) | Technical Articles Hub`,
    home_page_url: cleanBase,
    feed_url: catMeta ? `${cleanBase}${catMeta.feedPath.replace('.xml', '.json')}` : `${cleanBase}/feed.json`,
    description: catMeta ? catMeta.description : 'Technical articles, security labs, RFC research, networking protocols, and backend engineering by Yeasin.',
    authors: [
      {
        name: PERSONAL_INFO.name,
        url: PERSONAL_INFO.githubUrl,
      },
    ],
    items: items.map((item) => ({
      id: `${cleanBase}/article/${item.id}`,
      url: item.link,
      title: item.title,
      content_text: item.description,
      summary: item.contentSnippet,
      date_published: new Date(item.date).toISOString(),
      tags: [item.category, ...item.tags],
    })),
  };
}

