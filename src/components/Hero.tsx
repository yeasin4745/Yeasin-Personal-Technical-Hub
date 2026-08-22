import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Terminal, Shield, Network, Server, ArrowRight, ShieldCheck, Cpu, ExternalLink, Radio, Activity } from 'lucide-react';
import { PERSONAL_INFO, TELEMETRY_STATS } from '../data/portfolioData';
import { ProfileImage } from './ProfileImage';
import { YeasinWordmark } from './YeasinWordmark';
import { TiltCard } from './TiltCard';

interface HeroProps {
  onOpenTerminal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTerminal }) => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24, filter: 'blur(4px)', scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      scale: 1,
      transition: {
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section
      id="overview"
      className="relative pt-24 pb-14 md:pt-32 md:pb-20 lg:pt-36 lg:pb-24 overflow-hidden"
    >
      {/* Background Cyber Matrix / Dot Grid Overlay & Parallax Ambient Glows */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none z-0" />
      
      {/* Ambient glowing orbs */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-br from-cyan-500/15 via-sky-500/8 to-transparent rounded-full blur-3xl pointer-events-none z-0"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Floating HUD Telemetry Markers (Desktop) */}
      <div className="hidden xl:block absolute top-28 left-8 font-mono text-[10px] text-cyan-500/50 space-y-1 select-none pointer-events-none">
        <div>[SYS_LAT]: 23.8103° N</div>
        <div>[SYS_LON]: 90.4125° E</div>
        <div>[SECURITY_DOMAIN]: 0x4745</div>
      </div>
      <div className="hidden xl:block absolute top-28 right-8 font-mono text-[10px] text-emerald-500/50 space-y-1 text-right select-none pointer-events-none">
        <div>[NET.LAYER]: 4/7 HARDENED</div>
        <div>[CIPHER]: TLS_AES_256_GCM</div>
        <div>[POSTURE]: DEFENSIVE_READY</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Two-Column Responsive Desktop Hero Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.1, margin: '-20px' }}
        >
          
          {/* LEFT COLUMN: Identity, Headline, Systems Narrative, Domain Focus & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Wordmark Identification */}
            <motion.div variants={itemVariants}>
              <YeasinWordmark variant="hero" id="hero-yeasin-wordmark" />
            </motion.div>

            {/* Main Headline */}
            <motion.div variants={itemVariants} className="space-y-3 pt-1">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-white leading-[1.14]">
                Architecting <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">Backend Systems</span>, Securing Networks.
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-sans">
                Dedicated technical practitioner focused on foundational systems engineering across{' '}
                <span className="text-cyan-300 font-medium">backend architectures</span>,{' '}
                <span className="text-emerald-300 font-medium">computer networking protocols</span>,{' '}
                <span className="text-indigo-300 font-medium">defensive cybersecurity</span>, and{' '}
                <span className="text-amber-300 font-medium">Linux systems internals</span>.
              </p>
            </motion.div>

            {/* Technical Domain Badges */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
              <span className="px-2.5 py-1 rounded-md bg-[#0c1424] text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 shadow-sm shadow-cyan-950/40 hover:border-cyan-400 transition-colors">
                <Server className="w-3.5 h-3.5 text-cyan-400" />
                <span>Backend Dev (Node/Python)</span>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#0c1424] text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm shadow-emerald-950/40 hover:border-emerald-400 transition-colors">
                <Network className="w-3.5 h-3.5 text-emerald-400" />
                <span>Computer Networking (TCP/IP)</span>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#0c1424] text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 shadow-sm shadow-indigo-950/40 hover:border-indigo-400 transition-colors">
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                <span>Network Security & Defense</span>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#0c1424] text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shadow-sm shadow-amber-950/40 hover:border-amber-400 transition-colors">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span>Linux & Kernel Systems</span>
              </span>
            </motion.div>

            {/* Cybersecurity HUD Live Status Bar */}
            <motion.div
              variants={itemVariants}
              className="p-3 rounded-lg bg-[#070e1a]/90 border border-cyan-500/25 flex flex-wrap items-center justify-between gap-2.5 font-mono text-[11px] backdrop-blur-sm shadow-inner"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
                <span className="text-slate-400">DEFENSE POSTURE:</span>
                <span className="text-emerald-300 font-bold">HARDENED / ACTIVE</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <span className="hidden sm:inline text-slate-600">|</span>
                <span className="flex items-center gap-1 text-cyan-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>TLS 1.3</span>
                </span>
                <span className="hidden sm:inline text-slate-600">|</span>
                <span className="text-slate-300">
                  NODE: <strong className="text-white font-mono">0x4745</strong>
                </span>
              </div>
            </motion.div>

            {/* Action Callouts */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3.5 pt-2">
              <a
                href="#projects"
                id="hero-cta-projects"
                className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Explore Verified Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#labs"
                id="hero-cta-labs"
                className="px-5 py-2.5 rounded-lg bg-[#0c1220] hover:bg-[#111a2e] text-slate-200 border border-slate-700 hover:border-cyan-500/50 font-medium text-sm transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Security & Labs</span>
              </a>

              {/* Secondary Official Website Link */}
              <a
                href="https://yeasin4745-node.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                id="hero-cta-secondary-hub"
                className="group px-4 py-2.5 rounded-lg bg-[#091322] hover:bg-[#0c1b33] text-emerald-300 hover:text-emerald-200 border border-emerald-500/40 hover:border-emerald-400 font-mono text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-950/30 hover:shadow-[0_0_16px_rgba(16,185,129,0.25)] transform hover:-translate-y-0.5 active:translate-y-0"
                title="Open Secondary Technical Hub: Node.js Architecture (opens in new tab)"
                aria-label="Open Node.js Technical Hub at yeasin4745-node.vercel.app (opens in new tab)"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:animate-ping" />
                <span>Node.js Technical Hub</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <button
                onClick={onOpenTerminal}
                id="hero-cta-terminal"
                className="px-4 py-2.5 rounded-lg bg-[#0e1626] hover:bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 font-mono text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-sm transform hover:-translate-y-0.5 active:translate-y-0"
                title="Launch Interactive CLI Terminal"
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>CLI Terminal</span>
              </button>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Profile Image & Cyber Telemetry HUD */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-5 flex flex-col items-center justify-center space-y-6 w-full max-w-md mx-auto lg:max-w-none"
          >
            {/* Primary Neon Circular Profile Component */}
            <div className="relative pt-2">
              <ProfileImage
                size="hero"
                interactive={true}
                showBadge={true}
                badgeText="SECURITY // IDENTITY VERIFIED"
                glowIntensity="high"
                id="hero-profile-avatar"
              />
            </div>

            {/* Live System Telemetry Status HUD Card with 3D tilt */}
            <TiltCard
              className="w-full"
              glareColor="cyan"
              maxTilt={5}
              depth={6}
            >
              <div className="w-full bg-[#0b101c]/95 border border-cyan-500/30 rounded-xl p-4 shadow-xl shadow-cyan-950/40 relative overflow-hidden backdrop-blur-md">
                {/* Card top bar */}
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-800/90">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono text-[11px] font-bold text-slate-200 uppercase tracking-wider">
                      SYSTEM STATUS TELEMETRY
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40 font-semibold">
                    ESTABLISHED
                  </span>
                </div>

                {/* Telemetry Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {TELEMETRY_STATS.map((stat, idx) => (
                    <div key={idx} className="bg-[#0e1526]/90 p-2.5 rounded-lg border border-slate-800/80 hover:border-cyan-500/40 transition-colors">
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
                <div className="bg-[#070b14] p-2.5 rounded-lg border border-slate-800/90 font-mono text-[10px] space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400 text-[9px]">
                    <span className="text-cyan-400 font-semibold">[PACKET FLOW TRACER]</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Activity className="w-3 h-3 animate-pulse text-emerald-400" />
                      SYN → SYN-ACK → ACK
                    </span>
                  </div>
                  <div className="space-y-0.5 text-slate-300">
                    <div className="flex items-center gap-1.5 text-[9.5px]">
                      <span className="text-cyan-400">SRC:</span>
                      <span>192.168.1.105:54322</span>
                      <span className="text-slate-500">→</span>
                      <span className="text-emerald-400">DST:</span>
                      <span>yeasin4745.node:443</span>
                    </div>
                    <div className="text-slate-400 text-[9px] flex items-center justify-between pt-0.5 border-t border-slate-800/60">
                      <span>PROTO: TLS 1.3 / TCP</span>
                      <span className="text-cyan-300 font-semibold">RTT: 14ms (OPTIMAL)</span>
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>

          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
