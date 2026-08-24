import React, { useState, useEffect, useRef, useCallback } from 'react';

interface TerminalOutputPrinterProps {
  children: React.ReactNode;
  isClassicGreen?: boolean;
  animate?: boolean;
  onComplete?: () => void;
  onTick?: () => void;
  speedMs?: number;
}

export const TerminalOutputPrinter: React.FC<TerminalOutputPrinterProps> = ({
  children,
  isClassicGreen = false,
  animate = true,
  onComplete,
  onTick,
  speedMs = 22,
}) => {
  const [isDone, setIsDone] = useState(!animate);
  const [visibleCount, setVisibleCount] = useState(animate ? 1 : 9999);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const onCompleteRef = useRef(onComplete);
  const onTickRef = useRef(onTick);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onTickRef.current = onTick;
  }, [onComplete, onTick]);

  // Check user prefers reduced motion
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleSkip = useCallback(() => {
    setIsDone(true);
    setVisibleCount(9999);
    onCompleteRef.current?.();
  }, []);

  useEffect(() => {
    if (!animate || prefersReducedMotion) {
      handleSkip();
      return;
    }

    // Determine child elements length if children is an array or has sub-elements
    let totalItems = 1;
    if (React.isValidElement(children)) {
      const childProps = children.props as { children?: React.ReactNode };
      if (Array.isArray(childProps?.children)) {
        totalItems = childProps.children.length;
      } else if (childProps?.children) {
        totalItems = 6; // Multi-level fallback steps
      }
    }

    // For longer responses (like neofetch, help, projects, articles), estimate ~6-16 fast print frames
    const maxSteps = Math.max(totalItems, 8);
    let currentStep = 1;

    const interval = setInterval(() => {
      currentStep += 1;
      setVisibleCount(currentStep);
      onTickRef.current?.();

      if (currentStep >= maxSteps) {
        clearInterval(interval);
        setIsDone(true);
        onCompleteRef.current?.();
      }
    }, speedMs);

    return () => clearInterval(interval);
  }, [animate, children, prefersReducedMotion, speedMs, handleSkip]);

  // Listen for Escape or Space or Click to instantly skip typing animation
  useEffect(() => {
    if (isDone) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDone, handleSkip]);

  if (isDone || !animate) {
    return <div className="terminal-output-printed">{children}</div>;
  }

  return (
    <div
      ref={containerRef}
      onClick={handleSkip}
      className="terminal-output-streaming relative cursor-pointer group"
      title="Click or press Escape to finish printing instantly"
    >
      <div
        className="transition-all duration-75 overflow-hidden"
        style={{
          maxHeight: `${visibleCount * 90}px`,
          opacity: 1,
        }}
      >
        {children}
      </div>

      {/* High-speed console print head indicator */}
      <div className="flex items-center gap-1.5 pt-1 select-none text-[11px] font-mono">
        <span
          className={`inline-block w-2 h-3.5 animate-pulse ${
            isClassicGreen
              ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
              : 'bg-cyan-400 shadow-sm shadow-cyan-400/50'
          }`}
        />
        <span
          className={`text-[10px] font-mono italic opacity-60 group-hover:opacity-100 transition-opacity ${
            isClassicGreen ? 'text-emerald-400' : 'text-cyan-400'
          }`}
        >
          streaming output... [click or ESC to skip]
        </span>
      </div>
    </div>
  );
};
