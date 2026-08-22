import React, { useState } from 'react';
import { Server, Network, Shield, Cpu, Layers, CheckCircle2, Terminal, Code2 } from 'lucide-react';
import { TECHNICAL_PILLARS } from '../data/portfolioData';
import { ScrollReveal, StaggerContainer, StaggerItem, FadeInUpSection } from './ScrollReveal';
import { CodeSnippetBox } from './CodeSnippetBox';
import { TiltCard } from './TiltCard';

export const TechnicalPillars: React.FC = () => {
  const [selectedPillarId, setSelectedPillarId] = useState<string>(TECHNICAL_PILLARS[0].id);

  const activePillar = TECHNICAL_PILLARS.find((p) => p.id === selectedPillarId) || TECHNICAL_PILLARS[0];

  const getIcon = (id: string) => {
    switch (id) {
      case 'backend':
        return <Server className="w-5 h-5" />;
      case 'networking':
        return <Network className="w-5 h-5" />;
      case 'security':
        return <Shield className="w-5 h-5" />;
      case 'linux':
        return <Cpu className="w-5 h-5" />;
      default:
        return <Layers className="w-5 h-5" />;
    }
  };

  const getAccentStyles = (accent: string) => {
    switch (accent) {
      case 'cyan':
        return {
          border: 'border-cyan-500/40',
          bg: 'bg-cyan-500/10',
          text: 'text-cyan-400',
          badgeBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
          glare: 'cyan' as const,
        };
      case 'emerald':
        return {
          border: 'border-emerald-500/40',
          bg: 'bg-emerald-500/10',
          text: 'text-emerald-400',
          badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
          glare: 'emerald' as const,
        };
      case 'indigo':
        return {
          border: 'border-indigo-500/40',
          bg: 'bg-indigo-500/10',
          text: 'text-indigo-400',
          badgeBg: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40',
          glare: 'indigo' as const,
        };
      case 'amber':
        return {
          border: 'border-amber-500/40',
          bg: 'bg-amber-500/10',
          text: 'text-amber-400',
          badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
          glare: 'amber' as const,
        };
      default:
        return {
          border: 'border-cyan-500/40',
          bg: 'bg-cyan-500/10',
          text: 'text-cyan-400',
          badgeBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
          glare: 'cyan' as const,
        };
    }
  };

  return (
    <FadeInUpSection id="pillars" className="py-20 bg-[#080c14] border-t border-b border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Viewport ScrollReveal */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-400">
            <Layers className="w-3.5 h-3.5" />
            <span>SPECIALIZED TECHNICAL MATRIX</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Core Engineering & Research Pillars
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Focused strictly on systems depth: server backends, networking fundamentals, defensive cybersecurity, and Linux environments.
          </p>
        </ScrollReveal>

        {/* Pillar Navigation Grid with Staggered Scroll Reveal & 3D Tilt */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {TECHNICAL_PILLARS.map((pillar) => {
            const isSelected = pillar.id === selectedPillarId;
            const accent = getAccentStyles(pillar.accentColor);

            return (
              <StaggerItem key={pillar.id}>
                <TiltCard glareColor={accent.glare} maxTilt={6} depth={6}>
                  <button
                    onClick={() => setSelectedPillarId(pillar.id)}
                    id={`pillar-btn-${pillar.id}`}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? `${accent.border} ${accent.bg} shadow-lg shadow-black/40`
                        : 'bg-[#0d121f] border-slate-800 hover:border-slate-700 hover:bg-[#111728]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg ${isSelected ? accent.bg : 'bg-slate-800'} ${accent.text}`}>
                        {getIcon(pillar.id)}
                      </div>
                      <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${accent.badgeBg}`}>
                        {pillar.badge}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-sm text-white mb-1">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {pillar.subtitle}
                    </p>
                  </button>
                </TiltCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Active Pillar Details Card with ScrollReveal */}
        <ScrollReveal delay={0.1}>
          <div className="bg-[#0b101c] border border-cyan-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Details Column */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                      // CORE ARCHITECTURE & PROTOCOL RIGOR
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
                    {activePillar.title}
                  </h3>
                  <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                    {activePillar.description}
                  </p>
                </div>

                {/* Key Topics Bullet Checklist */}
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Verified Competencies & Theoretical Grounding:
                  </h4>
                  <ul className="space-y-2">
                    {activePillar.keyTopics.map((topic, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Protocols / Tools Tags */}
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Protocols & Standards:
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activePillar.protocols.map((proto, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-mono px-2.5 py-1 rounded bg-[#0f172a] text-cyan-300 border border-slate-700"
                      >
                        {proto}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Embedded Real Architecture Code Snippet */}
              <div className="lg:col-span-6 space-y-3">
                {activePillar.codeSnippet && (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-mono text-slate-300 font-bold">
                          {activePillar.codeSnippet.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                        {activePillar.codeSnippet.language}
                      </span>
                    </div>

                    <CodeSnippetBox
                      code={activePillar.codeSnippet.code}
                      language={activePillar.codeSnippet.language}
                      title={activePillar.codeSnippet.title}
                      description={activePillar.codeSnippet.description}
                      id={`pillar-snippet-${activePillar.id}`}
                    />
                  </>
                )}
              </div>

            </div>
          </div>
        </ScrollReveal>

      </div>
    </FadeInUpSection>
  );
};
