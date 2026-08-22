import React from 'react';
import { User, Terminal, Shield, Network, Server, CheckCircle2 } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ProfileImage } from './ProfileImage';
import { ScrollReveal, StaggerContainer, StaggerItem, FadeInUpSection } from './ScrollReveal';
import { TiltCard } from './TiltCard';

export const AboutSection: React.FC = () => {
  return (
    <FadeInUpSection id="about" className="py-20 bg-[#080c14] border-t border-b border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Personal Identity & Overview with ScrollReveal */}
          <div className="lg:col-span-5 space-y-6">
            <ScrollReveal>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-400 mb-3">
                <User className="w-3.5 h-3.5" />
                <span>ABOUT & SYSTEMS MINDSET</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight mb-6">
                Building Strong Foundations in Systems Engineering
              </h2>

              <TiltCard glareColor="cyan" maxTilt={4} depth={6}>
                <div className="bg-[#0c1220] border border-cyan-500/30 rounded-xl p-5 space-y-4 shadow-xl">
                  <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
                    <ProfileImage
                      size="md"
                      interactive={false}
                      showBadge={false}
                      glowIntensity="medium"
                      id="about-profile-avatar"
                    />
                    <div>
                      <h3 className="font-display font-bold text-lg text-white">
                        {PERSONAL_INFO.name}
                      </h3>
                      <span className="font-mono text-xs text-cyan-400 block">
                        @{PERSONAL_INFO.handle}
                      </span>
                      <span className="block text-[11px] text-slate-400 font-mono mt-0.5">
                        Legal: {PERSONAL_INFO.legalFullName}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs font-mono text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">LOCATION:</span>
                      <span className="text-slate-200">{PERSONAL_INFO.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">PRIMARY FOCUS:</span>
                      <span className="text-cyan-300">Backend, Net, Sec, Linux</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">GITHUB REPOS:</span>
                      <a
                        href={PERSONAL_INFO.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:underline"
                      >
                        github.com/{PERSONAL_INFO.handle}
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">STATUS:</span>
                      <span className="text-emerald-400">Active Technical Learner</span>
                    </div>
                  </div>
                </div>
              </TiltCard>

              {/* Quick Principles */}
              <div className="space-y-2.5 mt-6">
                <div className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>Zero superficial claims — every repository and lab is transparently documented.</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>Focusing on how bits travel over wire protocols, how servers scale, and how defenses hold.</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Philosophy & Core Values with Staggered Scroll Reveal */}
          <div className="lg:col-span-7 space-y-6 text-sm text-slate-300 leading-relaxed">
            <ScrollReveal delay={0.1}>
              <div className="space-y-4">
                <h3 className="text-lg font-display font-bold text-white">
                  The Systems & Networking Journey
                </h3>
                <p>
                  Rather than treating software as a surface-level layer of UI templates, my passion lies in exploring what happens under the hood: how HTTP requests are structured into TCP segments, how IP packets are routed across diverse autonomous systems, how operating systems manage concurrent threads, and how security policies defend critical infrastructure.
                </p>
                <p>
                  My development journey started with programming fundamentals in Python and server development in Node.js, and has steadily expanded into wire-level networking analysis (Wireshark, TCP/IP stack) and cybersecurity defense practices.
                </p>
              </div>
            </ScrollReveal>

            {/* Core Values Staggered Grid */}
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <StaggerItem>
                <TiltCard glareColor="cyan" maxTilt={4} depth={4} className="h-full">
                  <div className="bg-[#0b101c] p-4 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition-colors h-full">
                    <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 w-fit mb-3 border border-cyan-500/30">
                      <Server className="w-4 h-4" />
                    </div>
                    <h4 className="font-display font-bold text-white text-sm mb-1">
                      Systems-First Thinking
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Understanding operating system internals, process memory spaces, asynchronous concurrency, and POSIX file streams.
                    </p>
                  </div>
                </TiltCard>
              </StaggerItem>

              <StaggerItem>
                <TiltCard glareColor="emerald" maxTilt={4} depth={4} className="h-full">
                  <div className="bg-[#0b101c] p-4 rounded-xl border border-slate-800 hover:border-emerald-500/40 transition-colors h-full">
                    <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 w-fit mb-3 border border-emerald-500/30">
                      <Network className="w-4 h-4" />
                    </div>
                    <h4 className="font-display font-bold text-white text-sm mb-1">
                      Protocol Depth
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Studying OSI and TCP/IP stack protocols, packet routing mechanics, DNS lookup workflows, and socket lifecycle management.
                    </p>
                  </div>
                </TiltCard>
              </StaggerItem>

              <StaggerItem>
                <TiltCard glareColor="indigo" maxTilt={4} depth={4} className="h-full">
                  <div className="bg-[#0b101c] p-4 rounded-xl border border-slate-800 hover:border-indigo-500/40 transition-colors h-full">
                    <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400 w-fit mb-3 border border-indigo-500/30">
                      <Shield className="w-4 h-4" />
                    </div>
                    <h4 className="font-display font-bold text-white text-sm mb-1">
                      Defensive Security
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Auditing access boundaries, implementing input validation routines, managing firewall rules, and mitigating OWASP Top 10 vectors.
                    </p>
                  </div>
                </TiltCard>
              </StaggerItem>

              <StaggerItem>
                <TiltCard glareColor="amber" maxTilt={4} depth={4} className="h-full">
                  <div className="bg-[#0b101c] p-4 rounded-xl border border-slate-800 hover:border-amber-500/40 transition-colors h-full">
                    <div className="p-2 rounded-lg bg-amber-950 text-amber-400 w-fit mb-3 border border-amber-500/30">
                      <Terminal className="w-4 h-4" />
                    </div>
                    <h4 className="font-display font-bold text-white text-sm mb-1">
                      Verifiable Honesty
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Refusing superficial inflated credentials; prioritizing transparently verifiable GitHub code and technical research documentation.
                    </p>
                  </div>
                </TiltCard>
              </StaggerItem>
            </StaggerContainer>
          </div>

        </div>

      </div>
    </FadeInUpSection>
  );
};
