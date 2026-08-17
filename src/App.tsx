import React, { useState, useEffect } from 'react';
import { ScrollProgress } from './components/ScrollProgress';
import { Navbar } from './components/Navbar';
import { NetworkCanvas } from './components/NetworkCanvas';
import { Hero } from './components/Hero';
import { TechnicalPillars } from './components/TechnicalPillars';
import { ProjectsSection } from './components/ProjectsSection';
import { LabsSection } from './components/LabsSection';
import { LearningRoadmap } from './components/LearningRoadmap';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { TerminalModal } from './components/TerminalModal';

export default function App() {
  const [terminalOpen, setTerminalOpen] = useState(false);

  // Global hotkey support for opening CLI terminal (Ctrl+K / Cmd+K / `)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setTerminalOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && terminalOpen) {
        setTerminalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [terminalOpen]);

  return (
    <div className="relative min-h-screen bg-[#070a10] text-slate-200 selection:bg-cyan-500/30 selection:text-cyan-200 bg-grid-pattern overflow-hidden">
      {/* Fixed Viewport Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Interactive GPU-accelerated network packet simulation background */}
      <NetworkCanvas />

      {/* Primary Navigation */}
      <Navbar onOpenTerminal={() => setTerminalOpen(true)} />

      {/* Main Content Sections */}
      <main id="main-content" className="relative z-10">
        <Hero onOpenTerminal={() => setTerminalOpen(true)} />
        <TechnicalPillars />
        <ProjectsSection />
        <LabsSection />
        <LearningRoadmap />
        <AboutSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onOpenTerminal={() => setTerminalOpen(true)} />

      {/* Interactive CLI Terminal Emulator Modal */}
      <TerminalModal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
      />
    </div>
  );
}
