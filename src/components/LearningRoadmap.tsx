import React from 'react';
import { BookOpen, Clock } from 'lucide-react';
import { RESEARCH_ITEMS } from '../data/portfolioData';
import { ScrollReveal, StaggerContainer, StaggerItem, FadeInUpSection } from './ScrollReveal';
import { CodeSnippetBox } from './CodeSnippetBox';

export const LearningRoadmap: React.FC = () => {
  return (
    <FadeInUpSection id="research" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with ScrollReveal */}
        <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-xs font-mono text-indigo-300 mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>THEORETICAL FOUNDATIONS & RFC STUDIES</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
              Research & Learning Log
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl">
              Deconstructing protocols and systems from formal specifications, IETF RFC standards, and systems engineering documentation.
            </p>
          </div>

          <div className="text-right self-start md:self-auto font-mono text-xs text-slate-400">
            <span className="text-emerald-400 font-bold">STATUS:</span> Active Study Mode
          </div>
        </ScrollReveal>

        {/* Research Grid with Staggered Scroll Reveal */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {RESEARCH_ITEMS.map((item) => (
            <StaggerItem key={item.id}>
              <div
                id={`research-card-${item.id}`}
                className="h-full bg-[#0c111e] border border-slate-800 hover:border-indigo-500/40 rounded-xl p-6 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 font-semibold">
                      {item.category}
                    </span>
                    <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.status}
                    </span>
                  </div>

                  <h3 className="text-base font-display font-bold text-white mb-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {item.notes}
                  </p>

                  {item.codeSnippet && (
                    <div className="mb-4">
                      <CodeSnippetBox
                        code={item.codeSnippet.code}
                        language={item.codeSnippet.language}
                        title={item.codeSnippet.title}
                        description={item.codeSnippet.description}
                        id={`research-snippet-${item.id}`}
                        compact={true}
                      />
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800/80">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1.5">
                    Core References:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.references.map((ref, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-mono text-slate-300 bg-[#121929] px-2 py-0.5 rounded border border-slate-800"
                      >
                        {ref}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Learning Methodology Card with ScrollReveal */}
        <ScrollReveal delay={0.1}>
          <div className="bg-[#090d17] border border-cyan-500/20 rounded-2xl p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm">
                  01
                </div>
                <h4 className="text-sm font-bold text-white">First-Principles Analysis</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Reading RFCs, whitepapers, and kernel source notes to understand why protocols are designed the way they are.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm">
                  02
                </div>
                <h4 className="text-sm font-bold text-white">Reproducible Labs</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Verifying theory with packet captures (Wireshark), socket experiments in Node.js/Python, and Linux server configs.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-mono font-bold text-sm">
                  03
                </div>
                <h4 className="text-sm font-bold text-white">Defensive Security Focus</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Evaluating endpoints and network boundaries against real-world threat vectors, insecure configurations, and data leakage.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </FadeInUpSection>
  );
};
