import React, { useState, useEffect } from 'react';
import { Terminal, Menu, X, GitFork } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { YeasinWordmark } from './YeasinWordmark';
import { ThemeSwitcher } from './ThemeSwitcher';
import { SystemAudioToggle } from './SystemAudioToggle';

interface NavbarProps {
  onOpenTerminal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTerminal }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

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

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const observed = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActiveSection(visible.target.id);
    }, { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.1, 0.25, 0.5] });
    const observeAvailableSections = () => navLinks.forEach((link) => {
      const section = document.querySelector<HTMLElement>(link.href);
      if (section && !observed.has(section)) { observed.add(section); observer.observe(section); }
    });
    observeAvailableSections();
    const mutations = new MutationObserver(observeAvailableSections);
    mutations.observe(document.getElementById('main-content') || document.body, { childList: true, subtree: true });
    return () => { mutations.disconnect(); observer.disconnect(); };
  }, []);

  return (
    <header
      id="main-navigation-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#080c14]/95 backdrop-blur-md border-b border-violet-500/20 py-2.5 sm:py-3 shadow-lg shadow-black/50'
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
              className={`text-xs font-medium transition-colors tracking-wide relative py-2 min-h-11 flex items-center ${activeSection === link.href.slice(1) ? 'text-violet-300 after:w-full' : 'text-slate-300 hover:text-violet-400 after:w-0'} after:h-[2px] after:bg-violet-400 after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-200`} aria-current={activeSection === link.href.slice(1) ? 'location' : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Action triggers */}
        <div className="hidden lg:flex items-center gap-3">
          {/* High Contrast / Cyber Dark Theme Switcher */}
          <ThemeSwitcher id="nav-theme-switcher" />

          {/* System Audio FX Toggle (Muted by default) */}
          <SystemAudioToggle id="nav-audio-toggle" variant="compact" />

          <button
            onClick={onOpenTerminal}
            id="nav-terminal-trigger"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0e1524] hover:bg-violet-950/60 border border-violet-500/30 hover:border-violet-400 text-violet-300 text-xs font-mono transition-all shadow-sm hover:shadow-violet-500/10 cursor-pointer"
            title="Launch Interactive CLI Terminal"
          >
            <Terminal className="w-3.5 h-3.5 text-violet-400" />
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
            <GitFork className="w-3.5 h-3.5 text-violet-400" />
            <span>GitHub</span>
          </a>
        </div>

        {/* Responsive / Mobile Navigation Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
          <ThemeSwitcher variant="compact" id="mobile-quick-theme-toggle" />
          <SystemAudioToggle variant="compact" id="mobile-quick-audio-toggle" />
          <button
            onClick={onOpenTerminal}
            id="mobile-terminal-trigger"
            className="min-w-11 min-h-11 p-2 rounded-lg bg-[#0e1524] border border-violet-500/30 text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
            aria-label="Open Terminal"
            title="Launch Interactive CLI Terminal"
          >
            <Terminal className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="nav-mobile-toggle"
            className="min-w-11 min-h-11 p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0e1a] border-b border-violet-500/20 px-4 py-4 space-y-4 animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium text-slate-200 hover:text-violet-400 py-3 px-3 min-h-11 flex items-center rounded-lg hover:bg-slate-900/60 border-b border-slate-800/40 transition-colors ${activeSection === link.href.slice(1) ? 'text-violet-300 bg-violet-950/30' : ''}`} aria-current={activeSection === link.href.slice(1) ? 'location' : undefined}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-2 space-y-2">
            <a
              href={PERSONAL_INFO.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 text-center rounded-lg bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700 hover:bg-slate-750 transition-colors"
            >
              <GitFork className="w-4 h-4 text-violet-400" />
              <span>GitHub (@{PERSONAL_INFO.handle})</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

