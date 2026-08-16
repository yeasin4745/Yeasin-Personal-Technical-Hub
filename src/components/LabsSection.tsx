import React, { useState } from 'react';
import { Shield, CheckCircle2 } from 'lucide-react';
import { SECURITY_LABS } from '../data/portfolioData';
import { ScrollReveal, StaggerContainer, StaggerItem } from './ScrollReveal';

export const LabsSection: React.FC = () => {
  const [selectedLabId, setSelectedLabId] = useState<string>(SECURITY_LABS[0].id);

  const activeLab = SECURITY_LABS.find((l) => l.id === selectedLabId) || SECURITY_LABS[0];

  return (
    <section id="labs" className="py-20 bg-[#080c14] border-t border-b border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with ScrollReveal */}
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
          
          {/* Left Column: Lab Selector List with Staggered Scroll Reveal */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select Documented Lab Scenario:
            </h3>

            <StaggerContainer className="space-y-3">
              {SECURITY_LABS.map((lab) => {
                const isSelected = lab.id === selectedLabId;

                return (
                  <StaggerItem key={lab.id}>
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
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>

          {/* Right Column: Lab Detail & Protocol Inspection Inspector */}
          <div className="lg:col-span-7">
            <ScrollReveal delay={0.1}>
              <div className="bg-[#0b101c] border border-emerald-500/30 rounded-xl p-6 shadow-2xl space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
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
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">
                    {activeLab.status}
                  </span>
                </div>

                {/* Lab Summary */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold uppercase text-slate-400">
                    Experimental Objective & Methodology:
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#070b14] p-3.5 rounded-lg border border-slate-800">
                    {activeLab.summary}
                  </p>
                </div>

                {/* Tools & Protocols Used */}
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase text-slate-400 mb-2">
                    Tools & Protocols Inspected:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeLab.toolsUsed.map((tool, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-[#101827] text-cyan-300 text-xs font-mono border border-cyan-500/20"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Practical Takeaway */}
                <div className="border-t border-slate-800 pt-4">
                  <div className="flex items-start gap-2.5 bg-emerald-950/20 border border-emerald-500/30 p-3.5 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-mono font-bold text-emerald-300 block mb-0.5">
                        KEY PRACTICAL TAKEAWAY
                      </span>
                      <p className="text-xs text-slate-300">
                        {activeLab.keyTakeaway}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Topology / Packet flow simulation visual */}
                <div className="bg-[#060910] p-4 rounded-lg border border-slate-800/80 font-mono text-[11px] space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span>LAB TELEMETRY LINK</span>
                    <span className="text-cyan-400 font-bold">STATE: VERIFIED & LOGGED</span>
                  </div>
                  <div className="flex items-center justify-around py-2 border-y border-slate-800/60 text-slate-300 text-center">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 block">ENDPOINT A</span>
                      <span className="text-cyan-400 font-bold">Client Node</span>
                    </div>
                    <span className="text-emerald-400">══[TLS/TCP]══►</span>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 block">SECURITY LAYER</span>
                      <span className="text-amber-400 font-bold">Firewall / Filter</span>
                    </div>
                    <span className="text-emerald-400">══[Secure Pipe]══►</span>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 block">ENDPOINT B</span>
                      <span className="text-indigo-400 font-bold">Backend Host</span>
                    </div>
                  </div>
                </div>

              </div>
            </ScrollReveal>
          </div>

        </div>

      </div>
    </section>
  );
};
