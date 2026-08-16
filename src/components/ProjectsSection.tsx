import React, { useState } from 'react';
import { GitFork, ExternalLink, CheckCircle, Clock, AlertCircle, Code2 } from 'lucide-react';
import { VERIFIED_PROJECTS, PERSONAL_INFO } from '../data/portfolioData';
import { ScrollReveal, StaggerContainer, StaggerItem } from './ScrollReveal';

export const ProjectsSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'verified' | 'pending'>('all');

  const filteredProjects = VERIFIED_PROJECTS.filter((p) => {
    if (activeFilter === 'verified') return p.isVerifiedReal;
    if (activeFilter === 'pending') return !p.isVerifiedReal;
    return true;
  });

  return (
    <section id="projects" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with ScrollReveal */}
        <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-3">
              <Code2 className="w-3.5 h-3.5" />
              <span>GITHUB REPOSITORIES & SYSTEMS CODE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
              Projects & Codebases
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl">
              Verified repositories directly from GitHub (<strong className="text-slate-200">@{PERSONAL_INFO.handle}</strong>). Real projects are explicitly separated from in-progress research slots.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-[#0d121f] p-1.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveFilter('all')}
              id="filter-projects-all"
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Items ({VERIFIED_PROJECTS.length})
            </button>
            <button
              onClick={() => setActiveFilter('verified')}
              id="filter-projects-verified"
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeFilter === 'verified'
                  ? 'bg-emerald-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Verified Real ({VERIFIED_PROJECTS.filter((p) => p.isVerifiedReal).length})
            </button>
            <button
              onClick={() => setActiveFilter('pending')}
              id="filter-projects-pending"
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeFilter === 'pending'
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Slots Pending Input ({VERIFIED_PROJECTS.filter((p) => !p.isVerifiedReal).length})
            </button>
          </div>
        </ScrollReveal>

        {/* Project Cards Grid with Staggered Scroll Reveal */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <StaggerItem key={project.id}>
              <div
                id={`project-card-${project.id}`}
                className={`h-full rounded-xl border p-6 flex flex-col justify-between transition-all duration-200 ${
                  project.isVerifiedReal
                    ? 'bg-[#0d1322] border-slate-800 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-950/20'
                    : 'bg-[#0a0e17] border-dashed border-amber-500/30'
                }`}
              >
                <div>
                  {/* Status Indicator */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 border border-slate-700">
                      {project.category}
                    </span>

                    {project.isVerifiedReal ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Verified Repo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/30">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Pending User Input
                      </span>
                    )}
                  </div>

                  {/* Project Title & Repo info */}
                  <h3 className="text-lg font-display font-bold text-white mb-1">
                    {project.title}
                  </h3>
                  <span className="text-xs font-mono text-cyan-400 block mb-3">
                    {project.repoName}
                  </span>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-1.5 mb-6">
                    {project.technicalHighlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-400">
                        <span className="text-cyan-400 font-bold">›</span>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom tags & Links */}
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.architectureTags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#131a2b] text-slate-300 border border-slate-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {project.githubUrl ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      id={`project-link-${project.id}`}
                      className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-600 transition-colors"
                    >
                      <GitFork className="w-3.5 h-3.5 text-cyan-400" />
                      <span>View Repository on GitHub</span>
                      <ExternalLink className="w-3 h-3 ml-auto text-slate-400" />
                    </a>
                  ) : (
                    <div className="w-full py-2 px-3 rounded-lg bg-amber-950/20 text-amber-300/80 text-[11px] font-mono flex items-center justify-center gap-2 border border-amber-500/20">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Awaiting project details from Yeasin</span>
                    </div>
                  )}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* GitHub profile banner with ScrollReveal */}
        <ScrollReveal delay={0.15} className="mt-10 p-4 rounded-xl bg-gradient-to-r from-[#0d1424] to-[#0a0f1b] border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
              <GitFork className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Looking for all public code commits and updates?
              </h4>
              <p className="text-xs text-slate-400">
                Explore all active repositories on GitHub profile: <strong className="text-cyan-300">@{PERSONAL_INFO.handle}</strong>
              </p>
            </div>
          </div>
          <a
            href={PERSONAL_INFO.githubUrl}
            target="_blank"
            rel="noreferrer"
            id="projects-github-cta"
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors shrink-0"
          >
            Visit github.com/{PERSONAL_INFO.handle}
          </a>
        </ScrollReveal>

      </div>
    </section>
  );
};
