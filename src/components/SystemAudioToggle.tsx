import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSystemAudio } from '../context/AudioContext';

interface SystemAudioToggleProps {
  id?: string;
  variant?: 'compact' | 'full' | 'pill';
  className?: string;
}

export const SystemAudioToggle: React.FC<SystemAudioToggleProps> = ({
  id = 'system-audio-toggle',
  variant = 'compact',
  className = '',
}) => {
  const { isAudioEnabled, toggleAudio, playClick } = useSystemAudio();

  const handleToggle = () => {
    // If enabling audio, playClick will be triggered on next tick or direct call
    toggleAudio();
  };

  if (variant === 'full') {
    return (
      <button
        type="button"
        id={id}
        onClick={handleToggle}
        className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
          isAudioEnabled
            ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300 shadow-sm shadow-cyan-500/20'
            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
        } ${className}`}
        title={isAudioEnabled ? 'System Audio Enabled (Click to Mute)' : 'System Audio Muted (Click to Unmute)'}
        aria-label="Toggle System Audio"
      >
        <div className="flex items-center gap-2">
          {isAudioEnabled ? (
            <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-500" />
          )}
          <span>System Audio</span>
        </div>
        <span
          className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
            isAudioEnabled
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'bg-slate-800 text-slate-500 border border-slate-700'
          }`}
        >
          {isAudioEnabled ? 'ACTIVE' : 'MUTED'}
        </span>
      </button>
    );
  }

  if (variant === 'pill') {
    return (
      <button
        type="button"
        id={id}
        onClick={handleToggle}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
          isAudioEnabled
            ? 'bg-cyan-950/40 hover:bg-cyan-900/60 border-cyan-500/40 text-cyan-300 shadow-sm shadow-cyan-500/20'
            : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-300'
        } ${className}`}
        title={isAudioEnabled ? 'System Audio: Enabled (Click to Mute)' : 'System Audio: Muted (Click to Unmute)'}
        aria-label="Toggle System Audio"
      >
        {isAudioEnabled ? (
          <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
        ) : (
          <VolumeX className="w-3.5 h-3.5 text-slate-500" />
        )}
        <span className="hidden sm:inline text-[11px]">Audio:</span>
        <span className={`text-[10px] font-bold ${isAudioEnabled ? 'text-cyan-300' : 'text-slate-500'}`}>
          {isAudioEnabled ? 'ON' : 'OFF'}
        </span>
      </button>
    );
  }

  // Compact variant (icon button)
  return (
    <button
      type="button"
      id={id}
      onClick={handleToggle}
      className={`p-1.5 sm:p-2 rounded-lg border transition-all cursor-pointer relative group flex items-center justify-center ${
        isAudioEnabled
          ? 'bg-cyan-950/40 hover:bg-cyan-900/60 border-cyan-500/40 text-cyan-300 shadow-sm shadow-cyan-500/10'
          : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-200'
      } ${className}`}
      title={isAudioEnabled ? 'System Audio: Active (Click to Mute)' : 'System Audio: Muted by default (Click to Enable FX)'}
      aria-label="Toggle System Audio Sound Effects"
    >
      {isAudioEnabled ? (
        <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
      ) : (
        <VolumeX className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-300" />
      )}
      {isAudioEnabled && (
        <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
      )}
    </button>
  );
};
