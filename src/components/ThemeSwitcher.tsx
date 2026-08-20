import React from 'react';
import { Contrast, Sparkles, Eye, SunMedium } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSystemAudio } from '../context/AudioContext';

interface ThemeSwitcherProps {
  className?: string;
  variant?: 'compact' | 'full' | 'pill';
  id?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  className = '',
  variant = 'pill',
  id = 'theme-switcher-toggle',
}) => {
  const { theme, isHighContrast, toggleTheme } = useTheme();
  const { playThemeSwitch } = useSystemAudio();

  const handleToggle = () => {
    playThemeSwitch();
    toggleTheme();
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={handleToggle}
        id={id}
        type="button"
        role="switch"
        aria-checked={isHighContrast}
        aria-label={`Toggle High Contrast Theme mode. Current mode: ${isHighContrast ? 'High Contrast' : 'Cyber Dark'}`}
        title={
          isHighContrast
            ? 'High Contrast mode active (Click to switch to Cyber Dark)'
            : 'Switch to High Contrast Accessibility Mode'
        }
        className={`p-2 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center ${
          isHighContrast
            ? 'bg-yellow-400 text-black border-2 border-white font-bold shadow-[0_0_12px_rgba(250,204,21,0.5)]'
            : 'bg-[#0d1424] hover:bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400'
        } ${className}`}
      >
        <Contrast className="w-4 h-4" />
      </button>
    );
  }

  if (variant === 'full') {
    return (
      <button
        onClick={handleToggle}
        id={id}
        type="button"
        role="switch"
        aria-checked={isHighContrast}
        aria-label={`Toggle theme: ${isHighContrast ? 'High Contrast' : 'Cyber Dark'}`}
        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
          isHighContrast
            ? 'bg-black border-2 border-yellow-400 text-white shadow-lg'
            : 'bg-[#0d1424] border-slate-800 hover:border-cyan-500/40 text-slate-200'
        } ${className}`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              isHighContrast
                ? 'bg-yellow-400 text-black'
                : 'bg-slate-800 text-cyan-400'
            }`}
          >
            <Contrast className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="block text-xs font-bold uppercase tracking-wider font-mono">
              {isHighContrast ? 'HIGH CONTRAST MODE' : 'CYBER DARK THEME'}
            </span>
            <span className="block text-[11px] text-slate-400 font-sans">
              {isHighContrast
                ? 'Maximum legibility & solid borders (Active)'
                : 'Neon glow & dark terminal aesthetic'}
            </span>
          </div>
        </div>

        <span
          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
            isHighContrast
              ? 'bg-yellow-400 text-black border-white'
              : 'bg-cyan-950/80 text-cyan-300 border-cyan-500/30'
          }`}
        >
          {isHighContrast ? 'ON' : 'OFF'}
        </span>
      </button>
    );
  }

  // Default 'pill' variant for Navbar header
  return (
    <button
      onClick={handleToggle}
      id={id}
      type="button"
      role="switch"
      aria-checked={isHighContrast}
      aria-label={`Toggle theme mode. Currently ${isHighContrast ? 'High Contrast Accessibility Mode' : 'Cyber Dark Theme'}`}
      title={
        isHighContrast
          ? 'High Contrast mode active (WCAG AAA) - Click for Cyber Dark'
          : 'Switch to High Contrast Accessibility Mode'
      }
      className={`group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-xs transition-all duration-200 cursor-pointer select-none ${
        isHighContrast
          ? 'bg-black text-yellow-300 border-2 border-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.4)]'
          : 'bg-[#0d1424] hover:bg-[#121c32] text-slate-300 hover:text-cyan-300 border border-slate-700/80 hover:border-cyan-500/40'
      } ${className}`}
    >
      <div className="flex items-center gap-1.5">
        <Contrast
          className={`w-3.5 h-3.5 transition-transform duration-300 ${
            isHighContrast ? 'text-yellow-400 rotate-180' : 'text-cyan-400'
          }`}
        />
        <span className="font-semibold">
          {isHighContrast ? 'High Contrast' : 'Cyber Dark'}
        </span>
      </div>

      <span
        className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-bold uppercase tracking-wider ${
          isHighContrast
            ? 'bg-yellow-400 text-black border-white'
            : 'bg-slate-800 text-slate-400 border-slate-700 group-hover:text-cyan-300 group-hover:border-cyan-500/30'
        }`}
      >
        {isHighContrast ? 'A11Y ON' : 'THEME'}
      </span>
    </button>
  );
};
