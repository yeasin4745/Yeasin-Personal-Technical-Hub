import React, { useState, useEffect } from 'react';
import { Terminal, Menu, X, GitFork, Rss, Globe, ExternalLink } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { YeasinWordmark } from './YeasinWordmark';
import { ThemeSwitcher } from './ThemeSwitcher';
import { SystemAudioToggle } from './SystemAudioToggle';

interface NavbarProps {
  onOpenTerminal: () => void;
  onOpenRss: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTerminal, onOpenRss }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Overview', href: '#overview' },
    { label: 'Core Pillars', href: '#pillars' },
    { label: 'Verified Projects', href: '#projects' },
    { label: 'Network & Labs', href: '#labs' },
    { label: 'Research & RFCs', href: '#research' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      id="main-navigation-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#080c14]/95 backdrop-blur-md border-b border-cyan-500/20 py-2.5 sm:py-3 shadow-lg shadow-black/50'
          : 'bg-transparent py-3.5 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand identity: Distinctive Animated YEASIN Wordmark */}
        <a
          href="#overview"
          id="nav-brand-logo"
          className="group flex items-center focus:outline-none"
          aria-label="Yeasin Technical Hub"
        >
          <YeasinWordmark variant="header" showHandle={true} id="nav-brand-wordmark" />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-medium text-slate-300 hover:text-cyan-400 transition-colors tracking-wide relative py-1 hover:after:w-full after:w-0 after:h-[2px] after:bg-cyan-400 after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Action triggers */}
        <div className="hidden lg:flex items-center gap-3">
          {/* RSS Feed Trigger Button */}
          <button
            onClick={onOpenRss}
            id="nav-rss-trigger"
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-orange-950/40 hover:bg-orange-900/60 text-orange-300 hover:text-orange-200 border border-orange-500/30 hover:border-orange-400 text-xs font-medium transition-all cursor-pointer shadow-sm"
            title="Subscribe to RSS & JSON Feeds"
            aria-label="Subscribe to RSS Feed"
          >
            <Rss className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            <span className="font-mono">RSS</span>
          </button>

          {/* High Contrast / Cyber Dark Theme Switcher */}
          <ThemeSwitcher id="nav-theme-switcher" />

          {/* System Audio FX Toggle (Muted by default) */}
          <SystemAudioToggle id="nav-audio-toggle" variant="compact" />

          {/* Secondary Official Technical Hub (Node.js) Link */}
          <a
            href="https://yeasin4745-node.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            id="nav-secondary-hub-link"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 hover:text-emerald-200 border border-emerald-500/30 hover:border-emerald-400 text-xs font-medium transition-all shadow-sm group"
            title="Open Secondary Technical Hub: Node.js Architecture (opens in new tab)"
            aria-label="Open Secondary Technical Hub (opens in new tab)"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-xs">Node.js Hub</span>
            <ExternalLink className="w-3 h-3 text-emerald-400/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          <button
            onClick={onOpenTerminal}
            id="nav-terminal-trigger"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0e1524] hover:bg-cyan-950/60 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-xs font-mono transition-all shadow-sm hover:shadow-cyan-500/10 cursor-pointer"
            title="Launch Interactive CLI Terminal"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive CLI</span>
            <kbd className="text-[10px] bg-slate-800 text-slate-400 px-1 py-0.5 rounded border border-slate-700">
              &gt;_
            </kbd>
          </button>

          <a
            href={PERSONAL_INFO.githubUrl}
            target="_blank"
            rel="noreferrer"
            id="nav-github-link"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 hover:border-slate-600 transition-colors"
          >
            <GitFork className="w-3.5 h-3.5 text-cyan-400" />
            <span>GitHub</span>
          </a>
        </div>

        {/* Responsive / Mobile Navigation Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
          <button
            onClick={onOpenRss}
            id="mobile-rss-trigger"
            className="p-2 rounded-lg bg-orange-950/40 border border-orange-500/40 text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
            aria-label="Open RSS Feeds"
            title="RSS Feed"
          >
            <Rss className="w-4 h-4" />
          </button>
          <ThemeSwitcher variant="compact" id="mobile-quick-theme-toggle" />
          <SystemAudioToggle variant="compact" id="mobile-quick-audio-toggle" />
          <button
            onClick={onOpenTerminal}
            id="mobile-terminal-trigger"
            className="p-2 rounded-lg bg-[#0e1524] border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
            aria-label="Open Terminal"
            title="Launch Interactive CLI Terminal"
          >
            <Terminal className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="nav-mobile-toggle"
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0e1a] border-b border-cyan-500/20 px-4 py-4 space-y-4 animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-200 hover:text-cyan-400 py-2.5 px-3 rounded-lg hover:bg-slate-900/60 border-b border-slate-800/40 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-2 space-y-2">
            <a
              href="https://yeasin4745-node.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 text-center rounded-lg bg-emerald-950/40 text-emerald-300 text-xs font-mono font-medium border border-emerald-500/40 hover:bg-emerald-900/60 transition-colors"
            >
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Node.js Technical Hub (Secondary)</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400/80" />
            </a>
            <a
              href={PERSONAL_INFO.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 text-center rounded-lg bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700 hover:bg-slate-750 transition-colors"
            >
              <GitFork className="w-4 h-4 text-cyan-400" />
              <span>GitHub (@{PERSONAL_INFO.handle})</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

