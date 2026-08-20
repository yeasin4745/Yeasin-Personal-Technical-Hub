import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

interface AudioContextType {
  isAudioEnabled: boolean;
  toggleAudio: () => void;
  setAudioEnabled: (enabled: boolean) => void;
  playClick: () => void;
  playKeyPress: () => void;
  playTerminalBeep: () => void;
  playCommandExecute: () => void;
  playCommandError: () => void;
  playModalOpen: () => void;
  playModalClose: () => void;
  playThemeSwitch: () => void;
}

const SystemAudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAudioEnabled, setIsAudioEnabledState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('system_audio_enabled') === 'true';
    } catch {
      return false;
    }
  });

  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  }, []);

  const setAudioEnabled = useCallback((enabled: boolean) => {
    setIsAudioEnabledState(enabled);
    try {
      localStorage.setItem('system_audio_enabled', enabled ? 'true' : 'false');
    } catch {
      // Ignore localStorage errors
    }
    if (enabled) {
      getAudioContext();
    }
  }, [getAudioContext]);

  const toggleAudio = useCallback(() => {
    setAudioEnabled(!isAudioEnabled);
  }, [isAudioEnabled, setAudioEnabled]);

  // Subtle synthesized audio generators (Non-intrusive, soft harmonic decay)
  const playClick = useCallback(() => {
    if (!isAudioEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(950, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.035);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Ignore audio synthesis errors
    }
  }, [isAudioEnabled, getAudioContext]);

  const playKeyPress = useCallback(() => {
    if (!isAudioEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Soft mechanical tap
      const freq = 650 + Math.random() * 80;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.02);

      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.025);
    } catch {
      // Ignore audio synthesis errors
    }
  }, [isAudioEnabled, getAudioContext]);

  const playTerminalBeep = useCallback(() => {
    if (!isAudioEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Classic soft terminal bell (750 Hz soft sine)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(750, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Ignore audio synthesis errors
    }
  }, [isAudioEnabled, getAudioContext]);

  const playCommandExecute = useCallback(() => {
    if (!isAudioEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      
      // Dual harmonic confirmation chime
      [587.33, 880.00].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        const startTime = now + idx * 0.04;
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.04, startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.09);
      });
    } catch {
      // Ignore audio synthesis errors
    }
  }, [isAudioEnabled, getAudioContext]);

  const playCommandError = useCallback(() => {
    if (!isAudioEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Gentle low blip for error
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Ignore audio synthesis errors
    }
  }, [isAudioEnabled, getAudioContext]);

  const playModalOpen = useCallback(() => {
    if (!isAudioEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.07);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Ignore audio synthesis errors
    }
  }, [isAudioEnabled, getAudioContext]);

  const playModalClose = useCallback(() => {
    if (!isAudioEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.06);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {
      // Ignore audio synthesis errors
    }
  }, [isAudioEnabled, getAudioContext]);

  const playThemeSwitch = useCallback(() => {
    if (!isAudioEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Ignore audio synthesis errors
    }
  }, [isAudioEnabled, getAudioContext]);

  return (
    <SystemAudioContext.Provider
      value={{
        isAudioEnabled,
        toggleAudio,
        setAudioEnabled,
        playClick,
        playKeyPress,
        playTerminalBeep,
        playCommandExecute,
        playCommandError,
        playModalOpen,
        playModalClose,
        playThemeSwitch,
      }}
    >
      {children}
    </SystemAudioContext.Provider>
  );
};

export const useSystemAudio = (): AudioContextType => {
  const context = useContext(SystemAudioContext);
  if (!context) {
    throw new Error('useSystemAudio must be used within an AudioProvider');
  }
  return context;
};
