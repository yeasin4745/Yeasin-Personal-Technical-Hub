import { PERSONAL_INFO, SECURITY_LABS, RESEARCH_ITEMS, VERIFIED_PROJECTS, TECHNICAL_PILLARS } from '../data/portfolioData';

export interface FeedItem {
  id: string;
  title: string;
  link: string;
  description: string;
  contentSnippet?: string;
  category: string;
  date: string;
  author: string;
  type: 'lab' | 'research' | 'project' | 'pillar';
}

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

export function getAllFeedItems(baseUrl: string): FeedItem[] {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const items: FeedItem[] = [];

  // 1. Security & Networking Labs
  SECURITY_LABS.forEach((lab, index) => {
    const codeSnippetText = lab.codeSnippet
      ? `\n\nCode Snippet (${lab.codeSnippet.language}):\n${lab.codeSnippet.code}`
      : '';
    items.push({
      id: `lab-${lab.id}`,
      title: `[Lab ${lab.code}] ${lab.title}`,
      link: `${cleanBase}/#labs`,
      description: `${lab.summary}\n\nDomain: ${lab.domain} | Status: ${lab.status} | Tools: ${lab.toolsUsed.join(', ')}\nKey Takeaway: ${lab.keyTakeaway}${codeSnippetText}`,
      contentSnippet: lab.summary,
      category: lab.domain,
      date: new Date(Date.now() - index * 86400000 * 2).toUTCString(),
      author: `${PERSONAL_INFO.email} (${PERSONAL_INFO.name})`,
      type: 'lab',
    });
  });

  // 2. Research & RFC Items
  RESEARCH_ITEMS.forEach((research, index) => {
    const codeSnippetText = research.codeSnippet
      ? `\n\nReference Inspection (${research.codeSnippet.language}):\n${research.codeSnippet.code}`
      : '';
    items.push({
      id: `research-${research.id}`,
      title: `[Research] ${research.title}`,
      link: `${cleanBase}/#research`,
      description: `${research.notes}\n\nCategory: ${research.category} | Status: ${research.status}\nReferences: ${research.references.join(', ')}${codeSnippetText}`,
      contentSnippet: research.notes,
      category: research.category,
      date: new Date(Date.now() - (index + 4) * 86400000 * 2).toUTCString(),
      author: `${PERSONAL_INFO.email} (${PERSONAL_INFO.name})`,
      type: 'research',
    });
  });

  // 3. Technical Pillars
  TECHNICAL_PILLARS.forEach((pillar, index) => {
    items.push({
      id: `pillar-${pillar.id}`,
      title: `[Core Domain] ${pillar.title}`,
      link: `${cleanBase}/#pillars`,
      description: `${pillar.description}\n\nProtocols: ${pillar.protocols.join(', ')}\nArchitecture: ${pillar.architectureFocus}`,
      contentSnippet: pillar.description,
      category: 'Core Engineering',
      date: new Date(Date.now() - (index + 8) * 86400000 * 3).toUTCString(),
      author: `${PERSONAL_INFO.email} (${PERSONAL_INFO.name})`,
      type: 'pillar',
    });
  });

  // 4. Verified Projects
  VERIFIED_PROJECTS.forEach((proj, index) => {
    items.push({
      id: `project-${proj.id}`,
      title: `[Project] ${proj.title} (${proj.category})`,
      link: proj.githubUrl || `${cleanBase}/#projects`,
      description: `${proj.description}\n\nHighlights: ${proj.technicalHighlights.join(' • ')}\nStack: ${proj.architectureTags.join(', ')}`,
      contentSnippet: proj.description,
      category: proj.category,
      date: new Date(Date.now() - (index + 12) * 86400000 * 3).toUTCString(),
      author: `${PERSONAL_INFO.email} (${PERSONAL_INFO.name})`,
      type: 'project',
    });
  });

  return items;
}

/**
 * Generates an RSS 2.0 valid XML document with full items, enclosures, and metadata.
 */
export function generateRss2Xml(baseUrl: string): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const items = getAllFeedItems(cleanBase);
  const buildDate = new Date().toUTCString();

  const xmlItems = items
    .map((item) => {
      return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="false">${escapeXml(`${cleanBase}/item/${item.id}`)}</guid>
      <description><![CDATA[${item.description}]]></description>
      <category>${escapeXml(item.category)}</category>
      <pubDate>${item.date}</pubDate>
      <author>${escapeXml(item.author)}</author>
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${PERSONAL_INFO.name} (${PERSONAL_INFO.handle}) | Personal Technical Hub`)}</title>
    <link>${escapeXml(cleanBase)}</link>
    <description>${escapeXml(
      'Technical journal, security labs, RFC research, networking protocol analysis, and backend engineering documentation by Yeasin.'
    )}</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <docs>https://www.rssboard.org/rss-specification</docs>
    <generator>Yeasin Technical Hub Feed Generator v1.0</generator>
    <managingEditor>${escapeXml(`${PERSONAL_INFO.email} (${PERSONAL_INFO.name})`)}</managingEditor>
    <webMaster>${escapeXml(`${PERSONAL_INFO.email} (${PERSONAL_INFO.name})`)}</webMaster>
    <atom:link href="${escapeXml(`${cleanBase}/rss.xml`)}" rel="self" type="application/rss+xml" />
${xmlItems}
  </channel>
</rss>`;
}

/**
 * Generates JSON Feed 1.1 specification payload.
 */
export function generateJsonFeed(baseUrl: string) {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const items = getAllFeedItems(cleanBase);

  return {
    version: 'https://jsonfeed.org/version/1.1',
    title: `${PERSONAL_INFO.name} (${PERSONAL_INFO.handle}) | Personal Technical Hub`,
    home_page_url: cleanBase,
    feed_url: `${cleanBase}/feed.json`,
    description: 'Technical journal, security labs, RFC research, networking protocols, and backend engineering by Yeasin.',
    authors: [
      {
        name: PERSONAL_INFO.name,
        url: PERSONAL_INFO.githubUrl,
      },
    ],
    items: items.map((item) => ({
      id: `${cleanBase}/item/${item.id}`,
      url: item.link,
      title: item.title,
      content_text: item.description,
      summary: item.contentSnippet,
      date_published: new Date(item.date).toISOString(),
      tags: [item.category, item.type],
    })),
  };
}
