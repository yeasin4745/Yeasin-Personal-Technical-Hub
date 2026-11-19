import React, { Suspense, lazy, useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AudioProvider } from './context/AudioContext';
import { ScrollProgress } from './components/ScrollProgress';
import { Navbar } from './components/Navbar';
import { NetworkCanvas } from './components/NetworkCanvas';
import { Hero } from './components/Hero';
import { TechnicalPillars } from './components/TechnicalPillars';
import { ProjectsSection } from './components/ProjectsSection';
const LabsSection = lazy(() => import('./components/LabsSection').then((m) => ({ default: m.LabsSection })));
const LearningRoadmap = lazy(() => import('./components/LearningRoadmap').then((m) => ({ default: m.LearningRoadmap })));
import { AboutSection } from './components/AboutSection';
const ContactSection = lazy(() => import('./components/ContactSection').then((m) => ({ default: m.ContactSection })));
import { Footer } from './components/Footer';
const TerminalModal = lazy(() => import('./components/TerminalModal').then((m) => ({ default: m.TerminalModal })));
import { BootSequence } from './components/BootSequence';
import { SpeedInsights } from '@vercel/speed-insights/react';

export default function App() {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [isBooting, setIsBooting] = useState(() => {
    // Check if session has already booted or user prefers reduced motion
    if (typeof window !== 'undefined') {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let alreadyBooted = false;
      try { alreadyBooted = sessionStorage.getItem('yeasin_hub_booted') === 'true'; } catch { /* Storage may be disabled. */ }
      return !reducedMotion && !alreadyBooted;
    }
    return false;
  });

  // Global hotkey support for opening CLI terminal (Ctrl+K / Cmd+K / `)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setTerminalOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        if (terminalOpen) setTerminalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [terminalOpen]);

  return (
    <ThemeProvider>
      <AudioProvider>
        <div className="relative min-h-screen bg-[#0a0813] text-slate-200 selection:bg-violet-500/30 selection:text-violet-200 bg-grid-pattern">
          <a className="skip-link" href="#main-content">Skip to main content</a>
          {/* Initial Lightweight Cybersecurity Hub Boot Sequence */}
          {isBooting && <BootSequence onComplete={() => setIsBooting(false)} />}

          {/* Fixed Viewport Scroll Progress Indicator */}
          <ScrollProgress />

          {/* Interactive GPU-accelerated network packet simulation background */}
          <NetworkCanvas />

          {/* Primary Navigation */}
          <Navbar
            onOpenTerminal={() => setTerminalOpen(true)}
          />

          {/* Main Content Sections */}
          <main id="main-content" tabIndex={-1} className="relative z-10">
            <Hero onOpenTerminal={() => setTerminalOpen(true)} />
            <TechnicalPillars />
            <ProjectsSection />
            <Suspense fallback={<div className="min-h-24" aria-hidden="true" />}><LabsSection /><LearningRoadmap /></Suspense>
            <AboutSection />
            <Suspense fallback={<div className="min-h-24" aria-hidden="true" />}><ContactSection /></Suspense>
          </main>

          {/* Footer */}
          <Footer
            onOpenTerminal={() => setTerminalOpen(true)}
          />

          {/* Interactive CLI Terminal Emulator Modal */}
          {terminalOpen && <Suspense fallback={null}><TerminalModal isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} /></Suspense>}

          {/* Vercel Speed Insights Telemetry */}
          <SpeedInsights />
        </div>
      </AudioProvider>
    </ThemeProvider>
  );
}
