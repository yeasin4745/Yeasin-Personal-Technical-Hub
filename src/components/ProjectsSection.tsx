import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { GitFork, ExternalLink, CheckCircle, Clock, AlertCircle, Code2 } from 'lucide-react';
import { VERIFIED_PROJECTS, PERSONAL_INFO } from '../data/portfolioData';
import { ScrollReveal, FadeInUpSection } from './ScrollReveal';
import { TiltCard } from './TiltCard';

export const ProjectsSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'verified' | 'pending'>('all');
  const shouldReduceMotion = useReducedMotion();

  const filteredProjects = VERIFIED_PROJECTS.filter((p) => {
    if (activeFilter === 'verified') return p.isVerifiedReal;
    if (activeFilter === 'pending') return !p.isVerifiedReal;
    return true;
  });

  return (
    <FadeInUpSection id="projects" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Viewport ScrollReveal */}
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

        {/* Project Cards Grid with Viewport Sequential Stagger & 3D Tilt */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout={!shouldReduceMotion}
                initial={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : { opacity: 0, y: 30, scale: 0.96, filter: 'blur(4px)' }
                }
                whileInView={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: 'blur(0px)',
                  transition: {
                    duration: 0.5,
                    delay: shouldReduceMotion ? 0 : (index % 3) * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  },
                }}
                viewport={{ once: false, amount: 0.15, margin: '-20px' }}
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        scale: 0.95,
                        y: 15,
                        filter: 'blur(3px)',
                        transition: { duration: 0.25, ease: 'easeIn' },
                      }
                }
                className="h-full"
              >
                <TiltCard
                  glareColor={project.isVerifiedReal ? 'cyan' : 'amber'}
                  maxTilt={6}
                  depth={8}
                  className="h-full"
                >
                  <div
                    id={`project-card-${project.id}`}
                    className={`h-full rounded-xl border p-6 flex flex-col justify-between transition-all duration-200 ${
                      project.isVerifiedReal
                        ? 'bg-[#0d1322] border-slate-800 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-950/30'
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
                            <Clock className="w-3 h-3" />
                            {project.status}
                          </span>
                        )}
                      </div>

                      {/* Project Title */}
                      <h3 className="text-lg font-display font-bold text-white mb-2 flex items-center gap-2">
                        <span>{project.title}</span>
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-slate-300 leading-relaxed mb-4">
                        {project.description}
                      </p>

                      {/* Architecture Highlights */}
                      <div className="space-y-1.5 mb-5 bg-[#090d18] p-3 rounded-lg border border-slate-800/80">
                        <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold block mb-1">
                          Architecture & Standards:
                        </span>
                        {project.technicalHighlights.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300 font-mono">
                            <span className="text-cyan-400">▸</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Card Footer: Tech Stack & Real Link */}
                    <div>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.architectureTags.map((tech, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#10172a] text-cyan-300 border border-slate-800"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        {project.isVerifiedReal && project.githubUrl ? (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            id={`project-link-${project.id}`}
                            className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline font-semibold"
                          >
                            <GitFork className="w-3.5 h-3.5" />
                            <span>View Source Code</span>
                            <ExternalLink className="w-3 h-3 ml-0.5" />
                          </a>
                        ) : (
                          <span className="text-[11px] font-mono text-slate-500 italic">
                            In-progress research / slot pending
                          </span>
                        )}

                        <span className="text-[10px] font-mono text-slate-500">
                          ID: {project.id}
                        </span>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </FadeInUpSection>
  );
};
