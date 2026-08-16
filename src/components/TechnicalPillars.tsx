import React, { useState } from 'react';
import { Server, Network, Shield, Cpu, Layers, CheckCircle2, Terminal } from 'lucide-react';
import { TECHNICAL_PILLARS } from '../data/portfolioData';
import { ScrollReveal, StaggerContainer, StaggerItem } from './ScrollReveal';

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
        };
      case 'emerald':
        return {
          border: 'border-emerald-500/40',
          bg: 'bg-emerald-500/10',
          text: 'text-emerald-400',
          badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
        };
      case 'indigo':
        return {
          border: 'border-indigo-500/40',
          bg: 'bg-indigo-500/10',
          text: 'text-indigo-400',
          badgeBg: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40',
        };
      case 'amber':
        return {
          border: 'border-amber-500/40',
          bg: 'bg-amber-500/10',
          text: 'text-amber-400',
          badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
        };
      default:
        return {
          border: 'border-cyan-500/40',
          bg: 'bg-cyan-500/10',
          text: 'text-cyan-400',
          badgeBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
        };
    }
  };

  return (
    <section id="pillars" className="py-20 bg-[#080c14] border-t border-b border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with ScrollReveal */}
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

        {/* Pillar Navigation Grid with Staggered Scroll Reveal */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {TECHNICAL_PILLARS.map((pillar) => {
            const isSelected = pillar.id === selectedPillarId;
            const accent = getAccentStyles(pillar.accentColor);

            return (
              <StaggerItem key={pillar.id}>
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
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Selected Pillar Deep Dive Card with ScrollReveal */}
        <ScrollReveal delay={0.1}>
          <div className="bg-[#0b101d] border border-cyan-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Pillar Breakdown Details */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-mono font-bold uppercase ${getAccentStyles(activePillar.accentColor).text}`}>
                      {activePillar.badge} // DEEP INSPECTION
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-3">
                    {activePillar.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {activePillar.description}
                  </p>
                </div>

                {/* Key topics covered */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    Key Focus & Practical Objectives:
                  </h4>
                  <div className="space-y-2">
                    {activePillar.keyTopics.map((topic, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-200">
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${getAccentStyles(activePillar.accentColor).text}`} />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Protocols & Architecture Focus (No fake curl command) */}
              <div className="lg:col-span-5 space-y-5 bg-[#070a12] p-5 rounded-xl border border-slate-800">
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase text-slate-400 mb-3">
                    Target Protocols & Technologies:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activePillar.protocols.map((proto, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-[#0f172a] text-slate-200 border border-slate-700 text-xs font-mono"
                      >
                        {proto}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>SYSTEM ARCHITECTURE FOCUS</span>
                    <span className="text-cyan-400 font-bold">CORE</span>
                  </div>
                  <div className="bg-[#0b101c] p-3 rounded-lg border border-slate-800/90 font-mono text-xs text-slate-200 flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-cyan-400" />
                    <span className="leading-snug">{activePillar.architectureFocus}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
