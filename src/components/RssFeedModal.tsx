import React, { useState } from 'react';
import { Rss, X, Copy, Check, ExternalLink, Radio, Terminal, FileCode2, BookOpen, Layers } from 'lucide-react';
import { getAllFeedItems, FeedItem } from '../utils/rssFeed';

interface RssFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RssFeedModal: React.FC<RssFeedModalProps> = ({ isOpen, onClose }) => {
  const [copiedType, setCopiedType] = useState<'xml' | 'json' | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const rssXmlUrl = `${currentOrigin}/rss.xml`;
  const jsonFeedUrl = `${currentOrigin}/feed.json`;

  const feedItems = getAllFeedItems(currentOrigin);

  const filteredItems = filterType === 'all'
    ? feedItems
    : feedItems.filter(item => item.type === filterType);

  const copyToClipboard = async (text: string, type: 'xml' | 'json') => {
    try {
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
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
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
                <span>RSS & Syndicate Feeds</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/30 uppercase">
                  Live Dispatch
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Subscribe to new technical posts, security labs, and protocol research.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            id="close-rss-modal-btn"
            aria-label="Close RSS modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Feed Endpoints Section */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-orange-400" />
              <span>Syndication Endpoints</span>
            </span>

            {/* RSS 2.0 XML Box */}
            <div className="p-3.5 rounded-lg bg-[#070a12] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-orange-300 flex items-center gap-1.5">
                  <FileCode2 className="w-3.5 h-3.5 text-orange-400" />
                  <span>RSS 2.0 (XML Feed)</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Standard Feed (Feedly, NetNewsWire, Inoreader)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={rssXmlUrl}
                  className="flex-1 px-3 py-1.5 rounded bg-[#0b101c] border border-slate-700/80 font-mono text-xs text-slate-200 select-all focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(rssXmlUrl, 'xml')}
                  id="copy-rss-xml-url-btn"
                  className="px-3 py-1.5 rounded bg-orange-600 hover:bg-orange-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Copy RSS 2.0 Feed URL"
                >
                  {copiedType === 'xml' ? (
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

            {/* JSON Feed 1.1 Box */}
            <div className="p-3.5 rounded-lg bg-[#070a12] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                  <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>JSON Feed 1.1 Specification</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Modern API & Script Readers
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={jsonFeedUrl}
                  className="flex-1 px-3 py-1.5 rounded bg-[#0b101c] border border-slate-700/80 font-mono text-xs text-slate-200 select-all focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(jsonFeedUrl, 'json')}
                  id="copy-json-feed-url-btn"
                  className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Copy JSON Feed URL"
                >
                  {copiedType === 'json' ? (
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
                  href="/feed.json"
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Open /feed.json in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Feed Filter & Feed Stream Preview */}
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Feed Content Stream ({filteredItems.length} items)
              </span>
              <div className="flex items-center gap-1 text-[11px] font-mono">
                {['all', 'lab', 'research', 'pillar', 'project'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-2 py-0.5 rounded capitalize transition-colors ${
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

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
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
                    <span>Published: {item.date.split(' ').slice(0, 4).join(' ')}</span>
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
            RFC 822 & Atom Compliant • Auto-discovering in &lt;head&gt;
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
