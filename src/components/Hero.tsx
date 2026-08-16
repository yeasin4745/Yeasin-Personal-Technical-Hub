import React from 'react';
import { Terminal, Shield, Network, Server, ArrowRight, Activity, Database, Lock, Cpu, Radio } from 'lucide-react';
import { PERSONAL_INFO, TELEMETRY_STATS } from '../data/portfolioData';
import { ProfileImage } from './ProfileImage';
import { YeasinWordmark } from './YeasinWordmark';

interface HeroProps {
  onOpenTerminal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTerminal }) => {
  return (
    <section id="overview" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Expressive Hero Wordmark & Telemetry */}
        <div className="mb-8">
          <YeasinWordmark variant="hero" id="hero-yeasin-wordmark" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Main Hero Narrative Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-white leading-[1.15]">
                Architecting <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">Backend Systems</span>, Securing Networks.
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                Hi, I'm <strong className="text-white font-semibold">{PERSONAL_INFO.name}</strong>. I am a technical learner and future technology professional dedicated to deep foundational engineering across <span className="text-cyan-300 font-medium">backend server architectures</span>, <span className="text-emerald-300 font-medium">computer networking protocols</span>, <span className="text-indigo-300 font-medium">network security defense</span>, and <span className="text-amber-300 font-medium">Linux systems</span>.
              </p>
            </div>

            {/* Core Domain Badges */}
            <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
              <span className="px-2.5 py-1 rounded bg-slate-900/90 text-cyan-300 border border-cyan-500/20 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-cyan-400" />
                Backend Dev
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900/90 text-emerald-300 border border-emerald-500/20 flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-emerald-400" />
                Computer Networking
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900/90 text-indigo-300 border border-indigo-500/20 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                Network Security
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900/90 text-amber-300 border border-amber-500/20 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                Linux / Systems
              </span>
            </div>

            {/* Action Callouts */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <a
                href="#projects"
                id="hero-cta-projects"
                className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/25 cursor-pointer"
              >
                <span>Explore Verified Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#labs"
                id="hero-cta-labs"
                className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-500/50 font-medium text-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Security & Labs</span>
              </a>

              <button
                onClick={onOpenTerminal}
                id="hero-cta-terminal"
                className="px-4 py-2.5 rounded-lg bg-[#0e1626] hover:bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 font-mono text-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>CLI Terminal</span>
              </button>
            </div>
          </div>

          {/* Right Column: Neon Circular Profile Identity + Telemetry Metrics */}
          <div className="lg:col-span-5 flex flex-col items-center space-y-6">
            
            {/* Primary Neon Circular Profile Component */}
            <ProfileImage
              size="hero"
              interactive={true}
              showBadge={true}
              badgeText="IDENTITY // VERIFIED"
              glowIntensity="high"
              id="hero-profile-avatar"
            />

            {/* Live System Telemetry Status Card */}
            <div className="w-full bg-[#0b101c]/90 border border-cyan-500/30 rounded-xl p-4 shadow-xl shadow-cyan-950/30 relative overflow-hidden backdrop-blur-md">
              {/* Card top bar */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-[11px] font-bold text-slate-200 uppercase tracking-wider">
                    SYSTEM STATUS TELEMETRY
                  </span>
                </div>
                <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-500/30">
                  ESTABLISHED
                </span>
              </div>

              {/* Telemetry Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5 mb-3">
                {TELEMETRY_STATS.map((stat, idx) => (
                  <div key={idx} className="bg-[#0e1526]/80 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-[9px] font-mono text-slate-400 block mb-0.5">
                      {stat.label}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-cyan-300 block truncate">
                      {stat.value}
                    </span>
                    <span className="text-[9px] text-slate-500 font-sans block mt-0.5">
                      {stat.detail}
                    </span>
                  </div>
                ))}
              </div>

              {/* Protocol Packet Tracer Simulation */}
              <div className="bg-[#070b14] p-3 rounded-lg border border-slate-800 font-mono text-[10px] space-y-1.5">
                <div className="flex items-center justify-between text-slate-400 text-[9px]">
                  <span>[PACKET FLOW TRACER]</span>
                  <span className="text-emerald-400 font-semibold">SYN → SYN-ACK → ACK</span>
                </div>
                <div className="space-y-0.5 text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400">SRC:</span>
                    <span>192.168.1.105:54322</span>
                    <span className="text-slate-500">→</span>
                    <span className="text-emerald-400">DST:</span>
                    <span>yeasin4745.node:443</span>
                  </div>
                  <div className="text-slate-400 text-[9px] flex items-center justify-between">
                    <span>PROTO: TLS 1.3 / TCP</span>
                    <span className="text-cyan-300">RTT: 14ms (OPTIMAL)</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
