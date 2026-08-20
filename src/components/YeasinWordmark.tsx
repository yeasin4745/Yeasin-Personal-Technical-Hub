import React, { useState, useEffect, useRef } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';

export type WordmarkVariant = 'header' | 'hero' | 'compact' | 'footer';

interface YeasinWordmarkProps {
  variant?: WordmarkVariant;
  showHandle?: boolean;
  className?: string;
  id?: string;
}

const FULL_NAME = 'YEASIN';
const LETTERS = FULL_NAME.split(''); // ['Y', 'E', 'A', 'S', 'I', 'N']

export const YeasinWordmark: React.FC<YeasinWordmarkProps> = ({
  variant = 'header',
  showHandle = true,
  className = '',
  id = 'yeasin-wordmark-identity',
}) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number>(0);
  const [phase, setPhase] = useState<'typing' | 'holding' | 'deconstructing' | 'idle'>('typing');
  const [latestCharIndex, setLatestCharIndex] = useState<number>(-1);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
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
      isMountedRef.current = false;
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMotionChange);
      } else {
        mediaQuery.removeListener(handleMotionChange);
      }
    };
  }, []);

  // Cinematic Letter Construction & Deconstruction Loop
  useEffect(() => {
    if (prefersReducedMotion) {
      setVisibleCount(LETTERS.length);
      setPhase('holding');
      return;
    }

    let timer: ReturnType<typeof setTimeout>;

    if (phase === 'idle') {
      // Clean empty pause before beginning reveal sequence
      timer = setTimeout(() => {
        if (!isMountedRef.current) return;
        setPhase('typing');
        setVisibleCount(1);
        setLatestCharIndex(0);
      }, 450);
    } else if (phase === 'typing') {
      if (visibleCount < LETTERS.length) {
        timer = setTimeout(() => {
          if (!isMountedRef.current) return;
          setVisibleCount((prev) => {
            const next = prev + 1;
            setLatestCharIndex(next - 1);
            if (next === LETTERS.length) {
              setPhase('holding');
            }
            return next;
          });
        }, 220); // Smooth natural letter construction delay
      }
    } else if (phase === 'holding') {
      // Hold complete "YEASIN" wordmark fully visible for 3.2 seconds
      timer = setTimeout(() => {
        if (!isMountedRef.current) return;
        setPhase('deconstructing');
      }, 3200);
    } else if (phase === 'deconstructing') {
      if (visibleCount > 0) {
        timer = setTimeout(() => {
          if (!isMountedRef.current) return;
          setVisibleCount((prev) => {
            const next = prev - 1;
            if (next === 0) {
              setPhase('idle');
            }
            return next;
          });
        }, 90); // Swift, rhythmic terminal deconstruction
      } else {
        setPhase('idle');
      }
    }

    return () => clearTimeout(timer);
  }, [phase, visibleCount, prefersReducedMotion]);

  // Render individual animated letter array with accessible label
  const renderAnimatedLetters = (isHero: boolean) => {
    if (prefersReducedMotion) {
      return (
        <span
          data-text={FULL_NAME}
          className="wordmark-glitch-text text-white font-display font-black tracking-[0.18em] uppercase"
          style={{ textShadow: '0 0 20px rgba(0, 240, 255, 0.35)' }}
        >
          {FULL_NAME}
        </span>
      );
    }

    return (
      <span className="relative inline-flex items-center" aria-hidden="true">
        {LETTERS.map((char, index) => {
          const isVisible = index < visibleCount;
          const isNewlyConstructed = index === latestCharIndex && phase === 'typing';

          return (
            <span
              key={index}
              className={`inline-block font-display font-black tracking-[0.16em] uppercase transition-all duration-150 ${
                isVisible
                  ? isNewlyConstructed
                    ? 'animate-letter-construct text-cyan-200'
                    : 'opacity-100 scale-100 text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-sky-300'
                  : 'opacity-0 scale-90 w-0 pointer-events-none select-none overflow-hidden'
              }`}
              style={{
                textShadow: isVisible ? '0 0 22px rgba(0, 240, 255, 0.35)' : 'none',
              }}
            >
              {char}
            </span>
          );
        })}
      </span>
    );
  };

  // HERO VARIANT: Unboxed, Sleek, Futuristic Identity with Live Construction & Telemetry
  if (variant === 'hero') {
    return (
      <div
        id={id}
        className={`relative inline-flex flex-col items-start select-none ${className}`}
        aria-label="YEASIN — Personal Technical Identity"
      >
        {/* Top cybersecurity telemetry signal bar */}
        <div className="flex items-center gap-2 mb-2.5">
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-[#08101e]/90 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 backdrop-blur-md shadow-sm shadow-cyan-950/40">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="text-slate-400 tracking-wider font-semibold">IDENTITY //</span>
            <span className="text-cyan-300 font-bold tracking-wide">SEC.NODE:4745</span>
            <span className="text-slate-600 font-mono">|</span>
            <span className="text-emerald-400 font-medium hidden xs:inline text-[10px]">TLS 1.3 SECURED</span>
          </div>
          <span className="hidden sm:inline-block w-12 h-[1px] bg-gradient-to-r from-cyan-500/40 via-cyan-400/20 to-transparent" />
        </div>

        {/* Clean Unboxed Cyber Wordmark */}
        <div className="relative group py-1">
          {/* Subtle ambient luminous aura behind wordmark */}
          <div
            className={`absolute -inset-2 bg-gradient-to-r from-cyan-500/20 via-sky-500/15 to-indigo-500/15 rounded-xl blur-xl opacity-60 group-hover:opacity-95 transition-opacity duration-700 pointer-events-none ${
              !prefersReducedMotion ? 'wordmark-glow-ambient' : ''
            }`}
          />

          <div className="relative flex items-center min-h-[48px] sm:min-h-[64px] lg:min-h-[72px]">
            {/* Left technical bracket accent */}
            <span
              className="font-mono text-cyan-400/80 text-3xl sm:text-5xl lg:text-6xl font-light select-none mr-2 font-bold transition-opacity"
              aria-hidden="true"
            >
              [›
            </span>

            {/* Cinematic Animated Wordmark */}
            <div
              className="font-display font-black text-4xl sm:text-5xl lg:text-6xl leading-none tracking-[0.16em] inline-flex items-center"
            >
              {renderAnimatedLetters(true)}

              {/* Active Terminal Cursor */}
              {!prefersReducedMotion && (
                <span
                  className={`inline-block w-2 sm:w-2.5 h-7 sm:h-10 bg-cyan-400 ml-2 rounded-xs shadow-[0_0_12px_#00f0ff] ${
                    phase === 'holding' ? 'animate-signal-blink' : 'opacity-100 shadow-[0_0_16px_#00f0ff]'
                  } align-middle`}
                  aria-hidden="true"
                />
              )}
            </div>

            {/* Right technical bracket accent */}
            <span
              className="font-mono text-cyan-400/80 text-3xl sm:text-5xl lg:text-6xl font-light select-none ml-2 font-bold transition-opacity"
              aria-hidden="true"
            >
              ‹]
            </span>
          </div>
        </div>

        {/* Subordinate Handle & Systems Metadata */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
          <span className="font-mono text-xs text-cyan-300 font-semibold px-2.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 shadow-xs">
            @{PERSONAL_INFO.handle}
          </span>
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-cyan-400" />
            <span>Backend Systems & Network Security Specialist</span>
          </span>
        </div>

        {/* Bottom micro circuit trace accent */}
        <div className="w-full max-w-[320px] sm:max-w-[420px] flex items-center gap-2 mt-2 opacity-75">
          <div className="w-1.5 h-1.5 rounded-full border border-cyan-400 bg-cyan-950" />
          <div className="h-[1px] flex-1 bg-gradient-to-r from-cyan-400/60 via-sky-500/30 to-transparent" />
          <span className="text-[10px] font-mono text-slate-500 tracking-wider">SEC.UID // 0x4745_SYS</span>
        </div>
      </div>
    );
  }

  // COMPACT VARIANT
  if (variant === 'compact') {
    return (
      <div
        id={id}
        className={`inline-flex items-center gap-2 select-none ${className}`}
        aria-label="YEASIN"
      >
        <div className="relative flex items-center min-h-[24px]">
          <span className="font-mono text-cyan-500/60 text-sm mr-0.5 select-none">[</span>
          <span className="font-display font-black text-base tracking-[0.14em] uppercase text-white">
            {renderAnimatedLetters(false)}
          </span>
          <span className="font-mono text-cyan-500/60 text-sm ml-0.5 select-none">]</span>
          {!prefersReducedMotion && (
            <span className="inline-block w-1.5 h-3.5 bg-cyan-400 ml-1 rounded-xs shadow-[0_0_6px_#00f0ff] animate-signal-blink" />
          )}
        </div>
        {showHandle && (
          <span className="font-mono text-[10px] text-cyan-400/90 tracking-wider px-1.5 py-0.5 rounded bg-[#091120] border border-cyan-500/30">
            @{PERSONAL_INFO.handle}
          </span>
        )}
      </div>
    );
  }

  // DEFAULT 'HEADER' AND 'FOOTER' VARIANT
  return (
    <div
      id={id}
      className={`group inline-flex items-center gap-2.5 sm:gap-3 select-none focus:outline-none ${className}`}
      aria-label="YEASIN Technical Hub"
    >
      {/* Wordmark Typographic Container */}
      <div className="relative flex items-center min-h-[28px] sm:min-h-[32px]">
        {/* Ambient background hover aura */}
        <div
          className={`absolute -inset-1 bg-cyan-500/15 rounded blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
            !prefersReducedMotion ? 'wordmark-glow-ambient' : ''
          }`}
        />

        {/* Left minimal terminal bracket */}
        <span className="font-mono text-cyan-500/60 text-base sm:text-lg font-light select-none mr-1" aria-hidden="true">
          [
        </span>

        {/* Main Animated Wordmark */}
        <div className="font-display font-extrabold text-base sm:text-lg tracking-[0.16em] uppercase inline-flex items-center">
          {renderAnimatedLetters(false)}
        </div>

        {/* Right minimal terminal bracket */}
        <span className="font-mono text-cyan-500/60 text-base sm:text-lg font-light select-none ml-1" aria-hidden="true">
          ]
        </span>

        {/* Digital blinking cursor node */}
        {!prefersReducedMotion && (
          <span
            className={`inline-block w-1 sm:w-1.5 h-3.5 sm:h-4 bg-cyan-400 ml-1 rounded-xs shadow-[0_0_8px_#00f0ff] ${
              phase === 'holding' ? 'animate-signal-blink' : 'opacity-100'
            }`}
            aria-hidden="true"
          />
        )}
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
