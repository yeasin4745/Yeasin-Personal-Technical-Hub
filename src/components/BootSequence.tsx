import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Shield, Terminal, Cpu, CheckCircle2, Lock } from 'lucide-react';

interface BootSequenceProps {
  onComplete: () => void;
}

const BOOT_STEPS = [
  { text: 'INITIALIZING TECHNICAL HUB CORE...', label: 'SYS', color: 'text-cyan-400' },
  { text: 'LOADING BACKEND SUBSYSTEMS & NODE.JS RUNTIME...', label: 'CPU', color: 'text-sky-400' },
  { text: 'VERIFYING TCP/IP NETSTACK & WIRESHARK PROTOCOLS...', label: 'NET', color: 'text-emerald-400' },
  { text: 'ENFORCING OWASP HARDENING & TLS 1.3 CIPHER SUITES...', label: 'SEC', color: 'text-indigo-400' },
  { text: 'TELEMETRY NODE 0x4745 // ACCESS GRANTED', label: 'OK', color: 'text-emerald-300' },
];

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const shouldReduceMotion = useReducedMotion();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(15);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // If reduced motion is requested or user previously saw the boot in this session
    if (shouldReduceMotion) {
      onComplete();
      return;
    }

    const hasBooted = sessionStorage.getItem('yeasin_hub_booted');
    if (hasBooted === 'true') {
      onComplete();
      return;
    }

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < BOOT_STEPS.length - 1) {
          const next = prev + 1;
          setProgress(Math.round(((next + 1) / BOOT_STEPS.length) * 100));
          return next;
        } else {
          clearInterval(interval);
          setProgress(100);
          setTimeout(() => {
            setIsFinished(true);
            try {
              sessionStorage.setItem('yeasin_hub_booted', 'true');
            } catch {
              // ignore storage errors
            }
            setTimeout(onComplete, 400);
          }, 350);
          return prev;
        }
      });
    }, 280);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        clearInterval(interval);
        setIsFinished(true);
        try {
          sessionStorage.setItem('yeasin_hub_booted', 'true');
        } catch {}
        onComplete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete, shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          id="boot-sequence-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 bg-[#060910] text-slate-200 flex flex-col items-center justify-center p-4 select-none cursor-pointer overflow-hidden"
          onClick={() => {
            setIsFinished(true);
            try {
              sessionStorage.setItem('yeasin_hub_booted', 'true');
            } catch {}
            onComplete();
          }}
        >
          {/* Cyber grid & ambient glow */}
          <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 w-full max-w-lg bg-[#090e18]/95 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/60 backdrop-blur-md">
            
            {/* Top Bar with security indicator */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f0ff]" />
                <span className="font-mono text-xs font-bold text-slate-200 tracking-wider">
                  YEASIN.DEV // CYBERSECURITY HUB
                </span>
              </div>
              <span className="font-mono text-[10px] text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40 font-semibold">
                SYS.INIT
              </span>
            </div>

            {/* Terminal Boot Log Lines */}
            <div className="font-mono text-xs space-y-2.5 min-h-[140px] mb-6 bg-[#04060b] p-4 rounded-xl border border-slate-800/80">
              {BOOT_STEPS.slice(0, currentStepIndex + 1).map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-bold">
                    {step.label}
                  </span>
                  <span className={`text-xs ${step.color} truncate`}>
                    {step.text}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Glowing Progress Bar */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1 text-cyan-400">
                  <Terminal className="w-3 h-3" />
                  <span>CALIBRATING ENVIRONMENT</span>
                </span>
                <span className="text-emerald-400 font-bold">{progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 rounded-full shadow-[0_0_10px_#00f0ff]"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>

            {/* Skip Prompt */}
            <div className="text-center text-[10px] font-mono text-slate-500 flex items-center justify-center gap-2 pt-2 border-t border-slate-800/60">
              <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">ESC</kbd> or click anywhere to enter</span>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
