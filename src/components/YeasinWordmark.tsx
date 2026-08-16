import React, { useState, useEffect } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';

export type WordmarkVariant = 'header' | 'hero' | 'compact' | 'footer';

interface YeasinWordmarkProps {
  variant?: WordmarkVariant;
  showHandle?: boolean;
  className?: string;
  id?: string;
}

export const YeasinWordmark: React.FC<YeasinWordmarkProps> = ({
  variant = 'header',
  showHandle = true,
  className = '',
  id = 'yeasin-wordmark-identity',
}) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMotionChange);
    } else {
      mediaQuery.addListener(handleMotionChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMotionChange);
      } else {
        mediaQuery.removeListener(handleMotionChange);
      }
    };
  }, []);

  if (variant === 'hero') {
    return (
      <div
        id={id}
        className={`relative inline-flex flex-col items-start select-none ${className}`}
      >
        {/* Top telemetry signal line */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#00f0ff]" />
            <span className="tracking-widest uppercase text-slate-300">CORE IDENTITY //</span>
            <span className="text-cyan-300 font-bold">@{PERSONAL_INFO.handle}</span>
          </div>
          <span className="hidden sm:inline-block w-8 h-[1px] bg-gradient-to-r from-cyan-500/40 to-transparent" />
        </div>

        {/* Hero Expressive Wordmark */}
        <div className="relative group">
          {/* Ambient luminous glow behind text */}
          <div
            className={`absolute -inset-2 bg-gradient-to-r from-cyan-500/20 via-sky-500/15 to-indigo-500/20 rounded-lg blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-700 pointer-events-none ${
              !prefersReducedMotion ? 'wordmark-glow-ambient' : ''
            }`}
          />

          <div className="relative flex items-center">
            {/* Left technical bracket accent */}
            <span className="font-mono text-cyan-500/40 text-3xl sm:text-4xl lg:text-5xl font-light select-none mr-1">
              [
            </span>

            {/* Custom Styled Main Name "YEASIN" */}
            <span
              className={`font-display font-black tracking-[0.16em] uppercase text-3xl sm:text-5xl lg:text-6xl ${
                !prefersReducedMotion ? 'wordmark-text-gradient animate-wordmark-reveal' : 'text-white'
              }`}
              style={{
                letterSpacing: '0.14em',
                textShadow: '0 0 20px rgba(0, 240, 255, 0.25)',
              }}
            >
              YEASIN
            </span>

            {/* Right technical bracket accent */}
            <span className="font-mono text-cyan-500/40 text-3xl sm:text-4xl lg:text-5xl font-light select-none ml-1">
              ]
            </span>

            {/* Active digital signal cursor accent */}
            <span className="inline-block w-1.5 sm:w-2 h-6 sm:h-9 bg-cyan-400 ml-2 rounded-xs shadow-[0_0_8px_#00f0ff] animate-signal-blink align-middle" />
          </div>
        </div>

        {/* Bottom micro circuit trace accent */}
        <div className="w-full max-w-[280px] sm:max-w-[340px] flex items-center gap-1.5 mt-2 opacity-75">
          <div className="w-2 h-2 rounded-full border border-cyan-400 bg-cyan-950" />
          <div className="h-[1px] flex-1 bg-gradient-to-r from-cyan-400/60 via-sky-500/30 to-transparent" />
          <span className="text-[10px] font-mono text-slate-500 tracking-wider">SEC.ID.4745</span>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div id={id} className={`inline-flex items-center gap-2 select-none ${className}`}>
        <div className="relative flex items-center">
          <span
            className={`font-display font-black text-lg tracking-[0.14em] uppercase ${
              !prefersReducedMotion ? 'wordmark-text-gradient' : 'text-white'
            }`}
          >
            YEASIN
          </span>
          <span className="inline-block w-1 h-3 bg-cyan-400 ml-1 rounded-xs shadow-[0_0_6px_#00f0ff] animate-signal-blink" />
        </div>
        {showHandle && (
          <span className="font-mono text-[10px] text-cyan-400/80 tracking-wider">
            @{PERSONAL_INFO.handle}
          </span>
        )}
      </div>
    );
  }

  // Default 'header' and 'footer' variant
  return (
    <div
      id={id}
      className={`group inline-flex items-center gap-2.5 sm:gap-3.5 select-none focus:outline-none ${className}`}
    >
      {/* Wordmark Typographic Container */}
      <div className="relative flex items-center">
        {/* Ambient background hover aura */}
        <div
          className={`absolute -inset-1 bg-cyan-500/15 rounded blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
            !prefersReducedMotion ? 'wordmark-glow-ambient' : ''
          }`}
        />

        {/* Left minimal terminal bracket */}
        <span className="font-mono text-cyan-500/50 text-base sm:text-lg font-light select-none mr-0.5">
          [
        </span>

        {/* Main "YEASIN" Wordmark */}
        <span
          className={`font-display font-extrabold text-base sm:text-lg tracking-[0.16em] uppercase transition-all duration-300 ${
            !prefersReducedMotion ? 'wordmark-text-gradient animate-wordmark-reveal' : 'text-white'
          }`}
          style={{
            letterSpacing: '0.14em',
          }}
        >
          YEASIN
        </span>

        {/* Right minimal terminal bracket */}
        <span className="font-mono text-cyan-500/50 text-base sm:text-lg font-light select-none ml-0.5">
          ]
        </span>

        {/* Digital blinking cursor node */}
        <span className="inline-block w-1 sm:w-1.5 h-3.5 sm:h-4 bg-cyan-400 ml-1.5 rounded-xs shadow-[0_0_6px_#00f0ff] animate-signal-blink" />
      </div>

      {/* Secondary technical handle @yeasin4745 */}
      {showHandle && (
        <div className="hidden xs:inline-flex items-center">
          <span className="font-mono text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded bg-[#091120] text-cyan-400/90 border border-cyan-500/30 group-hover:border-cyan-400/60 group-hover:text-cyan-300 transition-colors tracking-wide shadow-sm shadow-cyan-950/40">
            @{PERSONAL_INFO.handle}
          </span>
        </div>
      )}
    </div>
  );
};
