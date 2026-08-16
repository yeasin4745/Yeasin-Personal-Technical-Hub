import React from 'react';
import { Cpu, Terminal, GitFork, Mail, ArrowUp, Shield } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface FooterProps {
  onOpenTerminal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTerminal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-[#05080e] border-t border-slate-800/80 pt-14 pb-10 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand & Identity */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-base text-white tracking-tight">
                {PERSONAL_INFO.name}
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                @{PERSONAL_INFO.handle}
              </span>
            </div>
            <p className="text-slate-400 text-xs max-w-md leading-relaxed">
              Personal Technical Hub focusing on Backend Systems, Computer Networking, Network Security, and Linux Systems. Built with zero artificial claims.
            </p>
          </div>

          {/* Quick Jump Links */}
          <div className="md:col-span-3 space-y-2">
            <span className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider block">
              Direct Sections
            </span>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#overview" className="hover:text-cyan-400 transition-colors">Overview</a></li>
              <li><a href="#pillars" className="hover:text-cyan-400 transition-colors">Technical Pillars</a></li>
              <li><a href="#projects" className="hover:text-cyan-400 transition-colors">Verified Projects</a></li>
              <li><a href="#labs" className="hover:text-cyan-400 transition-colors">Security & Labs</a></li>
              <li><a href="#research" className="hover:text-cyan-400 transition-colors">Research & RFCs</a></li>
              <li><a href="#about" className="hover:text-cyan-400 transition-colors">About & Mindset</a></li>
              <li><a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Verified Channels & Tools */}
          <div className="md:col-span-3 space-y-3">
            <span className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider block">
              Verified Outlets
            </span>
            <div className="space-y-2 font-mono text-xs">
              <a
                href={PERSONAL_INFO.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors"
              >
                <GitFork className="w-3.5 h-3.5 text-cyan-400" />
                <span>GitHub: @{PERSONAL_INFO.handle}</span>
              </a>
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>{PERSONAL_INFO.email}</span>
              </a>
              <button
                onClick={onOpenTerminal}
                className="flex items-center gap-2 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer text-left"
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Launch Interactive CLI Terminal</span>
              </button>
            </div>
          </div>

        </div>



        {/* Bottom copyright & Back to top */}
        <div className="pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Yeasin ({PERSONAL_INFO.legalFullName}) • All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Shield className="w-3 h-3" />
              <span>TLS 1.3 Verified</span>
            </span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
