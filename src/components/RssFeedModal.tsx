import React, { useState } from 'react';
import { Rss, X, Copy, Check, ExternalLink, Radio, FileCode2, Globe, Shield, Server, Terminal, Filter } from 'lucide-react';
import { getAllFeedItems, FeedItem, CATEGORY_FEEDS, FeedCategorySlug } from '../utils/rssFeed';
import { useSystemAudio } from '../context/AudioContext';

interface RssFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RssFeedModal: React.FC<RssFeedModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedFeedCategory, setSelectedFeedCategory] = useState<'all' | FeedCategorySlug>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const { playClick, playCommandExecute, playModalClose } = useSystemAudio();

  if (!isOpen) return null;

  const handleClose = () => {
    playModalClose();
    onClose();
  };

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const mainRssUrl = `${currentOrigin}/rss.xml`;
  const jsonFeedUrl = `${currentOrigin}/feed.json`;

  const categoryEndpoints: { slug: FeedCategorySlug; name: string; icon: React.FC<{ className?: string }>; url: string; xmlPath: string; color: string }[] = [
    { slug: 'networking', name: 'Networking Feed', icon: Globe, url: `${currentOrigin}/rss/networking.xml`, xmlPath: '/rss/networking.xml', color: 'emerald' },
    { slug: 'cybersecurity', name: 'Cybersecurity Feed', icon: Shield, url: `${currentOrigin}/rss/cybersecurity.xml`, xmlPath: '/rss/cybersecurity.xml', color: 'indigo' },
    { slug: 'backend', name: 'Backend Feed', icon: Server, url: `${currentOrigin}/rss/backend.xml`, xmlPath: '/rss/backend.xml', color: 'cyan' },
    { slug: 'linux', name: 'Linux Feed', icon: Terminal, url: `${currentOrigin}/rss/linux.xml`, xmlPath: '/rss/linux.xml', color: 'amber' },
  ];

  const allItems = getAllFeedItems(currentOrigin);

  const categoryFilteredItems = selectedFeedCategory === 'all'
    ? allItems
    : allItems.filter(item => item.feedCategories.includes(selectedFeedCategory));

  const filteredItems = filterType === 'all'
    ? categoryFilteredItems
    : categoryFilteredItems.filter(item => item.type === filterType);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      playCommandExecute();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch (err) {
      console.error('Failed to copy feed URL:', err);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rss-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#0b101c] border border-orange-500/30 rounded-xl shadow-2xl shadow-orange-950/20 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#080c16] border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-950/80 border border-orange-500/40 text-orange-400">
              <Rss className="w-5 h-5" />
            </div>
            <div>
              <h2 id="rss-modal-title" className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>RSS & Category Feeds</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/30 uppercase">
                  Live Dispatch
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Subscribe to full feed or category-specific technical article channels.
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            id="close-rss-modal-btn"
            aria-label="Close RSS modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Feed Endpoints Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-orange-400" />
                <span>Primary Syndication Endpoints</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">
                Auto-Discovery Active
              </span>
            </div>

            {/* Main RSS 2.0 XML Box */}
            <div className="p-3 rounded-lg bg-[#070a12] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-orange-300 flex items-center gap-1.5">
                  <FileCode2 className="w-3.5 h-3.5 text-orange-400" />
                  <span>Main Feed (All Articles) — /rss.xml</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Full Technical Journal
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={mainRssUrl}
                  className="flex-1 px-3 py-1.5 rounded bg-[#0b101c] border border-slate-700/80 font-mono text-xs text-slate-200 select-all focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(mainRssUrl, 'main-xml')}
                  id="copy-rss-xml-url-btn"
                  className="px-3 py-1.5 rounded bg-orange-600 hover:bg-orange-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  title="Copy RSS 2.0 Feed URL"
                >
                  {copiedKey === 'main-xml' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>
                <a
                  href="/rss.xml"
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Open /rss.xml in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Category-Specific RSS Feeds Accordion/List */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Category-Specific Feeds:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {categoryEndpoints.map((cat) => {
                  const Icon = cat.icon;
                  const count = allItems.filter(i => i.feedCategories.includes(cat.slug)).length;
                  return (
                    <div
                      key={cat.slug}
                      className="p-2.5 rounded-lg bg-[#070a12] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5 text-slate-400" />
                          <span>{cat.name}</span>
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          {count} articles
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-mono text-slate-400 truncate flex-1 bg-[#0b101c] px-2 py-1 rounded border border-slate-800">
                          {cat.xmlPath}
                        </span>
                        <button
                          onClick={() => copyToClipboard(cat.url, cat.slug)}
                          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title={`Copy ${cat.name} URL`}
                        >
                          {copiedKey === cat.slug ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <a
                          href={cat.xmlPath}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title={`Open ${cat.xmlPath} in new tab`}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* JSON Feed 1.1 Box */}
            <div className="p-2.5 rounded-lg bg-[#070a12] border border-slate-800/80 flex items-center justify-between gap-2">
              <span className="text-xs text-cyan-300 font-mono flex items-center gap-1.5">
                <FileCode2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>JSON Feed 1.1: /feed.json</span>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => copyToClipboard(jsonFeedUrl, 'json')}
                  id="copy-json-feed-url-btn"
                  className="px-2.5 py-1 rounded bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 text-xs font-mono border border-cyan-800/50 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Copy JSON Feed URL"
                >
                  {copiedKey === 'json' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'json' ? 'Copied' : 'Copy'}</span>
                </button>
                <a
                  href="/feed.json"
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Open /feed.json in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Feed Filter & Feed Stream Preview */}
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Feed Article Stream ({filteredItems.length} items)
                </span>
                <div className="flex items-center gap-1 text-[11px] font-mono">
                  {['all', 'pillar', 'lab', 'research', 'project'].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        playClick();
                        setFilterType(type);
                      }}
                      className={`px-2 py-0.5 rounded capitalize transition-colors cursor-pointer ${
                        filterType === type
                          ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category pills filter */}
              <div className="flex items-center gap-1.5 text-[11px] font-mono overflow-x-auto pb-1">
                <span className="text-slate-500 text-[10px]">Filter Feed:</span>
                {(['all', 'networking', 'cybersecurity', 'backend', 'linux'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      playClick();
                      setSelectedFeedCategory(cat);
                    }}
                    className={`px-2 py-0.5 rounded capitalize text-[11px] transition-colors cursor-pointer ${
                      selectedFeedCategory === cat
                        ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 font-semibold'
                        : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {cat === 'all' ? 'All Channels' : cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-[#080c14] border border-slate-800/80 hover:border-slate-700 transition-all space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-200">
                        {item.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 whitespace-nowrap">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.contentSnippet || item.description}
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                    <span>Author: Yeasin • {item.date.split(' ').slice(0, 4).join(' ')}</span>
                    <a
                      href={item.link}
                      onClick={onClose}
                      className="text-orange-400 hover:underline flex items-center gap-1"
                    >
                      <span>Jump to section</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#080c16] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px]">
            RFC 822 & Atom Compliant • 5 Active Syndication Channels
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

