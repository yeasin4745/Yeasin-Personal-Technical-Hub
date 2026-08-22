import React, { useState } from 'react';
import { Shield, CheckCircle2, Terminal } from 'lucide-react';
import { SECURITY_LABS } from '../data/portfolioData';
import { ScrollReveal, StaggerContainer, StaggerItem, FadeInUpSection, CyberHudFrame } from './ScrollReveal';
import { CodeSnippetBox } from './CodeSnippetBox';
import { TiltCard } from './TiltCard';

export const LabsSection: React.FC = () => {
  const [selectedLabId, setSelectedLabId] = useState<string>(SECURITY_LABS[0].id);

  const activeLab = SECURITY_LABS.find((l) => l.id === selectedLabId) || SECURITY_LABS[0];

  return (
    <FadeInUpSection id="labs" className="py-20 bg-[#080c14] border-t border-b border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Viewport ScrollReveal */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-xs font-mono text-emerald-300">
            <Shield className="w-3.5 h-3.5" />
            <span>HANDS-ON LABS & SECURITY SIMULATIONS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Networking & Security Labs
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Practical experimentation across Wireshark packet dissection, defensive firewall configuration, Linux server hardening, and network topologies.
          </p>
        </ScrollReveal>

        {/* Labs Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Lab Selector List with Staggered Scroll Reveal & TiltCard */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>Select Documented Lab Scenario:</span>
              <span className="text-emerald-400 font-semibold">{SECURITY_LABS.length} LABS</span>
            </h3>

            <StaggerContainer className="space-y-3">
              {SECURITY_LABS.map((lab) => {
                const isSelected = lab.id === selectedLabId;

                return (
                  <StaggerItem key={lab.id}>
                    <TiltCard glareColor="emerald" maxTilt={4} depth={4}>
                      <button
                        onClick={() => setSelectedLabId(lab.id)}
                        id={`lab-select-btn-${lab.id}`}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-[#0f172a] border-emerald-500/50 shadow-lg shadow-emerald-950/20'
                            : 'bg-[#0d121f] border-slate-800 hover:border-slate-700 hover:bg-[#111728]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                            {lab.code}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {lab.domain}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1">
                          {lab.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {lab.summary}
                        </p>
                      </button>
                    </TiltCard>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>

          {/* Right Column: Lab Detail & Protocol Inspection Inspector with HUD container */}
          <div className="lg:col-span-7">
            <ScrollReveal delay={0.1}>
              <CyberHudFrame accent="emerald" id="lab-active-hud-inspector">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-emerald-400 font-bold">
                        [{activeLab.code}]
                      </span>
                      <span className="text-xs font-mono text-slate-400 uppercase">
                        // {activeLab.domain}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-white mt-1">
                      {activeLab.title}
                    </h3>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {activeLab.status}
                  </span>
                </div>

                {/* Lab Summary */}
                <div className="space-y-4 text-xs text-slate-300 mb-6 leading-relaxed">
                  <p>{activeLab.summary}</p>
                </div>

                {/* Key Takeaway */}
                <div className="mb-6 space-y-2 bg-[#060a12] p-4 rounded-xl border border-emerald-500/20">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Key Takeaway & Defensive Result:</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed pl-5">
                    {activeLab.keyTakeaway}
                  </p>
                </div>

                {/* Lab Snippet / Wireshark / Rule Definition */}
                {activeLab.codeSnippet && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-400 font-semibold flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                        <span>CONFIGURATION / TELEMETRY TRACE:</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        {activeLab.codeSnippet.language}
                      </span>
                    </div>

                    <CodeSnippetBox
                      code={activeLab.codeSnippet.code}
                      language={activeLab.codeSnippet.language}
                      title={activeLab.codeSnippet.title}
                      description={activeLab.codeSnippet.description}
                      id={`lab-snippet-${activeLab.id}`}
                    />
                  </div>
                )}

                {/* Tools Applied */}
                <div className="pt-4 mt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      Lab Tools:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {activeLab.toolsUsed.map((tool, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#09111e] text-emerald-300 border border-emerald-900/50"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-500">
                    LAB ID: {activeLab.id}
                  </span>
                </div>
              </CyberHudFrame>
            </ScrollReveal>
          </div>

        </div>

      </div>
    </FadeInUpSection>
  );
};
