import React, { useState, useEffect } from 'react';
import { Terminal, Shield, Menu, X, GitFork, Cpu, Activity } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ProfileImage } from './ProfileImage';

interface NavbarProps {
  onOpenTerminal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTerminal }) => {
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
          ? 'bg-[#080c14]/90 backdrop-blur-md border-b border-cyan-500/20 py-3 shadow-lg shadow-black/40'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand identity with circular neon avatar */}
        <a
          href="#overview"
          id="nav-brand-logo"
          className="group flex items-center gap-3 text-left focus:outline-none"
        >
          <ProfileImage
            size="sm"
            interactive={false}
            showBadge={false}
            glowIntensity="subtle"
            id="nav-profile-avatar"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-base tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                {PERSONAL_INFO.name}
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                @{PERSONAL_INFO.handle}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>SYS: OPERATIONAL</span>
            </div>
          </div>
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

        {/* Action triggers */}
        <div className="hidden sm:flex items-center gap-3">
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

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={onOpenTerminal}
            className="p-2 rounded-lg bg-[#0e1524] border border-cyan-500/30 text-cyan-400"
            aria-label="Open Terminal"
          >
            <Terminal className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="nav-mobile-toggle"
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0e1a] border-b border-cyan-500/20 px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-200 hover:text-cyan-400 py-2 border-b border-slate-800/50"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-2 flex items-center gap-2">
            <a
              href={PERSONAL_INFO.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2 text-center rounded-lg bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700"
            >
              GitHub (@{PERSONAL_INFO.handle})
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
