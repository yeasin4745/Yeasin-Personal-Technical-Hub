import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, CornerDownLeft, Shield, Server, Network, Contrast, Sparkles, Monitor, Volume2, VolumeX } from 'lucide-react';
import { PERSONAL_INFO, VERIFIED_PROJECTS, SECURITY_LABS } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';
import { useSystemAudio } from '../context/AudioContext';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type TerminalColorTheme = 'classic-green' | 'modern-cyber';

interface CommandLog {
  id: string;
  command: string;
  output: React.ReactNode;
  timestamp: string;
}

export const TerminalModal: React.FC<TerminalModalProps> = ({ isOpen, onClose }) => {
  const { theme, isHighContrast, toggleTheme, setTheme } = useTheme();
  const {
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
  } = useSystemAudio();

  const [inputVal, setInputVal] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [terminalTheme, setTerminalTheme] = useState<TerminalColorTheme>(() => {
    try {
      const saved = localStorage.getItem('terminal_color_theme');
      if (saved === 'classic-green' || saved === 'modern-cyber') {
        return saved;
      }
    } catch {
      // Ignore localStorage errors
    }
    return 'modern-cyber';
  });

  const isClassicGreen = terminalTheme === 'classic-green';

  useEffect(() => {
    try {
      localStorage.setItem('terminal_color_theme', terminalTheme);
    } catch {
      // Ignore localStorage errors
    }
  }, [terminalTheme]);

  const [history, setHistory] = useState<CommandLog[]>([
    {
      id: 'init-1',
      command: 'sys.init --verbose',
      timestamp: '00:00:01',
      output: (
        <div className="space-y-1">
          <p className="text-emerald-400 font-semibold">[SYS] Connected to Yeasin Technical Host (yeasin4745.node)</p>
          <p className="text-cyan-400 text-xs">Core Focus: Backend Architecture • Computer Networking • Cybersecurity • Linux Systems</p>
          <p className="text-slate-400 text-xs">Type <span className="text-cyan-300 font-bold">'help'</span> to see available system diagnostic commands.</p>
        </div>
      ),
    },
  ]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      playModalOpen();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      const handleTerminalShortcuts = (e: KeyboardEvent) => {
        // Ctrl+L or Cmd+L to clear terminal
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
          e.preventDefault();
          playTerminalBeep();
          setHistory([]);
          setInputVal('');
        }
      };

      window.addEventListener('keydown', handleTerminalShortcuts);
      return () => window.removeEventListener('keydown', handleTerminalShortcuts);
    }
  }, [isOpen, playModalOpen, playTerminalBeep]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, terminalTheme]);

  if (!isOpen) return null;

  const handleClose = () => {
    playModalClose();
    onClose();
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const rawCmd = inputVal.trim();
    const cmd = rawCmd.toLowerCase();
    if (!cmd) return;

    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    let output: React.ReactNode;
    let isSuccess = true;

    switch (cmd) {
      case 'help':
        output = (
          <div className="space-y-1.5 text-xs">
            <p className={isClassicGreen ? 'text-emerald-300 font-semibold' : 'text-cyan-300 font-semibold'}>AVAILABLE COMMANDS:</p>
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-1 ${isClassicGreen ? 'text-emerald-200/90' : 'text-slate-300'}`}>
              <div><button type="button" onClick={() => setInputVal('whoami')} className="text-emerald-400 font-mono hover:underline text-left cursor-pointer">whoami</button> : Identity & formatted bio of Yeasin</div>
              <div><button type="button" onClick={() => setInputVal('date')} className="text-emerald-400 font-mono hover:underline text-left cursor-pointer">date</button> : Linux system date & current time</div>
              <div><button type="button" onClick={() => setInputVal('audio on')} className="text-emerald-400 font-mono hover:underline text-left cursor-pointer">audio [on|off]</button> : System sound effects toggle</div>
              <div><button type="button" onClick={() => setInputVal('status')} className="text-emerald-400 font-mono hover:underline text-left cursor-pointer">status</button> : Telemetry & system health state</div>
              <div><button type="button" onClick={() => setInputVal('projects')} className="text-emerald-400 font-mono hover:underline text-left cursor-pointer">projects</button> : Verified backend & logic repositories</div>
              <div><button type="button" onClick={() => setInputVal('labs')} className="text-emerald-400 font-mono hover:underline text-left cursor-pointer">labs</button> : Active network & security lab logs</div>
              <div><button type="button" onClick={() => setInputVal('netstat')} className="text-emerald-400 font-mono hover:underline text-left cursor-pointer">netstat</button> : Protocol stack & active ports</div>
              <div><button type="button" onClick={() => setInputVal('rss')} className="text-emerald-400 font-mono hover:underline text-left cursor-pointer">rss</button> : Live RSS & JSON Feed endpoints</div>
              <div><button type="button" onClick={() => setInputVal('color cyber')} className="text-emerald-400 font-mono hover:underline text-left cursor-pointer">color [green|cyber]</button> : Switch terminal color theme</div>
              <div><button type="button" onClick={() => setInputVal('theme')} className="text-emerald-400 font-mono hover:underline text-left cursor-pointer">theme</button> : Toggle global site display theme</div>
              <div><button type="button" onClick={() => setInputVal('contact')} className="text-emerald-400 font-mono hover:underline text-left cursor-pointer">contact</button> : Verified communication channels</div>
              <div><button type="button" onClick={() => { playTerminalBeep(); setHistory([]); setInputVal(''); }} className="text-emerald-400 font-mono hover:underline text-left cursor-pointer">clear</button> : Reset terminal history (or Ctrl+L)</div>
              <div><button type="button" onClick={handleClose} className="text-emerald-400 font-mono hover:underline text-left cursor-pointer">exit</button> : Close terminal interactive view</div>
            </div>
          </div>
        );
        break;

      case 'date':
      case 'date -u':
      case 'date --utc':
      case 'time':
      case 'datetime': {
        const now = new Date();
        const isUtc = cmd.includes('-u') || cmd.includes('--utc');
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        let dayName: string;
        let monthName: string;
        let dayNum: string;
        let hours: string;
        let mins: string;
        let secs: string;
        let year: number;
        let tzAbbr: string;

        if (isUtc) {
          dayName = days[now.getUTCDay()];
          monthName = months[now.getUTCMonth()];
          dayNum = String(now.getUTCDate()).padStart(2, '0');
          hours = String(now.getUTCHours()).padStart(2, '0');
          mins = String(now.getUTCMinutes()).padStart(2, '0');
          secs = String(now.getUTCSeconds()).padStart(2, '0');
          year = now.getUTCFullYear();
          tzAbbr = 'UTC';
        } else {
          dayName = days[now.getDay()];
          monthName = months[now.getMonth()];
          dayNum = String(now.getDate()).padStart(2, '0');
          hours = String(now.getHours()).padStart(2, '0');
          mins = String(now.getMinutes()).padStart(2, '0');
          secs = String(now.getSeconds()).padStart(2, '0');
          year = now.getFullYear();
          tzAbbr = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' }).formatToParts(now).find((p) => p.type === 'timeZoneName')?.value || 'UTC';
        }

        const linuxDateStr = `${dayName} ${monthName} ${dayNum} ${hours}:${mins}:${secs} ${tzAbbr} ${year}`;
        const epochSeconds = Math.floor(now.getTime() / 1000);

        output = (
          <div className={`text-xs font-mono space-y-1 ${isClassicGreen ? 'text-emerald-200' : 'text-slate-200'}`}>
            <p className={`font-semibold ${isClassicGreen ? 'text-emerald-300' : 'text-cyan-300'}`}>
              {linuxDateStr}
            </p>
            <p className={`text-[11px] ${isClassicGreen ? 'text-emerald-500' : 'text-slate-500'}`}>
              epoch: {epochSeconds} • iso: {now.toISOString()}
            </p>
          </div>
        );
        break;
      }

      case 'audio':
      case 'audio on':
      case 'audio off':
      case 'audio toggle':
      case 'sound':
      case 'sound on':
      case 'sound off':
      case 'mute':
      case 'unmute':
      case 'bell': {
        if (cmd === 'audio on' || cmd === 'sound on' || cmd === 'unmute') {
          setAudioEnabled(true);
          playTerminalBeep();
          output = (
            <div className="text-xs space-y-1 text-cyan-300 font-mono">
              <p className="text-cyan-400 font-bold">✓ SYSTEM AUDIO ENABLED [UNMUTED]</p>
              <p className="text-slate-300 text-[11px]">Subtle UI clicks, terminal bell beeps, and command chimes are now active.</p>
            </div>
          );
        } else if (cmd === 'audio off' || cmd === 'sound off' || cmd === 'mute') {
          setAudioEnabled(false);
          output = (
            <div className="text-xs space-y-1 text-slate-400 font-mono">
              <p className="text-amber-400 font-bold">✓ SYSTEM AUDIO DISABLED [MUTED]</p>
              <p className="text-slate-500 text-[11px]">All non-intrusive sound effects muted. Type 'audio on' to re-enable.</p>
            </div>
          );
        } else if (cmd === 'bell') {
          playTerminalBeep();
          output = (
            <div className="text-xs space-y-1 text-emerald-300 font-mono">
              <p className="text-emerald-400 font-bold">🔔 BEL [0x07] Soft Terminal Bell Triggered</p>
            </div>
          );
        } else {
          const next = !isAudioEnabled;
          setAudioEnabled(next);
          if (next) playTerminalBeep();
          output = (
            <div className="text-xs space-y-1 font-mono">
              <p className={next ? 'text-cyan-400 font-bold' : 'text-amber-400 font-bold'}>
                ✓ SYSTEM AUDIO: {next ? 'ENABLED [UNMUTED]' : 'DISABLED [MUTED]'}
              </p>
              <p className="text-slate-400 text-[11px]">Type 'audio on' or 'audio off' to set state explicitly.</p>
            </div>
          );
        }
        break;
      }

      case 'color':
      case 'color green':
      case 'color classic':
      case 'color cyber':
      case 'color modern':
      case 'theme classic':
      case 'theme green': {
        playThemeSwitch();
        if (cmd.includes('green') || cmd.includes('classic')) {
          setTerminalTheme('classic-green');
          output = (
            <div className="text-xs space-y-1 text-emerald-300 font-mono">
              <p className="text-emerald-400 font-bold terminal-glow-green">✓ TERMINAL THEME UPDATED: Classic Green (Phosphor CRT)</p>
              <p className="text-emerald-200/80 text-[11px]">Retro monochrome phosphor aesthetics and phosphor scanlines active.</p>
            </div>
          );
        } else if (cmd.includes('cyber') || cmd.includes('modern')) {
          setTerminalTheme('modern-cyber');
          output = (
            <div className="text-xs space-y-1 text-cyan-300 font-mono">
              <p className="text-cyan-400 font-bold terminal-glow-cyan">✓ TERMINAL THEME UPDATED: Modern Cyber</p>
              <p className="text-slate-300 text-[11px]">Multi-chromatic neon highlights, electric blue signals, and deep slate matrix active.</p>
            </div>
          );
        } else {
          const next = isClassicGreen ? 'modern-cyber' : 'classic-green';
          setTerminalTheme(next);
          output = (
            <div className="text-xs space-y-1 font-mono">
              <p className={next === 'classic-green' ? 'text-emerald-400 font-bold' : 'text-cyan-400 font-bold'}>
                ✓ TERMINAL THEME TOGGLED: {next === 'classic-green' ? 'Classic Green' : 'Modern Cyber'}
              </p>
              <p className="text-slate-400 text-[11px]">Type 'color green' or 'color cyber' to switch directly.</p>
            </div>
          );
        }
        break;
      }

      case 'whoami':
      case 'who am i':
      case 'bio':
      case 'about':
      case 'id':
        output = (
          <div className={`text-xs space-y-2.5 font-mono border-l-2 pl-3 py-1.5 rounded-r-md ${
            isClassicGreen
              ? 'text-emerald-200 border-emerald-400 bg-emerald-950/30'
              : 'text-slate-200 border-cyan-400 bg-cyan-950/20'
          }`}>
            {/* Header Identity Row */}
            <div className={`flex flex-wrap items-center justify-between gap-2 border-b pb-2 ${
              isClassicGreen ? 'border-emerald-500/30' : 'border-cyan-500/20'
            }`}>
              <div>
                <span className={`font-bold text-sm ${isClassicGreen ? 'text-emerald-300' : 'text-cyan-300'}`}>
                  {PERSONAL_INFO.name}
                </span>
                <span className={`text-xs ml-2 ${isClassicGreen ? 'text-emerald-400/80' : 'text-slate-400'}`}>
                  (@{PERSONAL_INFO.handle})
                </span>
                <span className={`text-[10px] block ${isClassicGreen ? 'text-emerald-500' : 'text-slate-500'}`}>
                  Legal Full Name: {PERSONAL_INFO.legalFullName}
                </span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                ● {PERSONAL_INFO.status}
              </span>
            </div>

            {/* Tagline */}
            <div className={`italic text-[11px] leading-relaxed ${
              isClassicGreen ? 'text-emerald-300/90' : 'text-cyan-200/90'
            }`}>
              "{PERSONAL_INFO.tagline}"
            </div>

            {/* Role Summary & Bio */}
            <div className="text-xs leading-relaxed space-y-0.5">
              <p className={`font-semibold ${isClassicGreen ? 'text-emerald-400' : 'text-cyan-400'}`}>TECHNICAL PROFILE & BIO:</p>
              <p className={isClassicGreen ? 'text-emerald-200/90' : 'text-slate-300'}>{PERSONAL_INFO.roleSummary}</p>
            </div>

            {/* Engineering Pillars & Protocol Stack */}
            <div className="space-y-1 text-xs">
              <p className={`font-semibold ${isClassicGreen ? 'text-emerald-400' : 'text-cyan-400'}`}>CORE SPECIALIZATIONS:</p>
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] ${isClassicGreen ? 'text-emerald-200/90' : 'text-slate-300'}`}>
                <div className="flex items-start gap-1.5">
                  <span className={`font-bold ${isClassicGreen ? 'text-emerald-400' : 'text-cyan-400'}`}>▸</span>
                  <span><strong>Backend Systems:</strong> Node.js, Python, REST APIs, Async I/O, SQL</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">▸</span>
                  <span><strong>Computer Networking:</strong> TCP/IP, Sockets, Wireshark, DNS, TLS 1.3</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className={`font-bold ${isClassicGreen ? 'text-emerald-400' : 'text-indigo-400'}`}>▸</span>
                  <span><strong>Cybersecurity:</strong> Threat Modeling, OWASP, Defense, Hardening</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className={`font-bold ${isClassicGreen ? 'text-emerald-400' : 'text-amber-400'}`}>▸</span>
                  <span><strong>Linux Systems:</strong> POSIX CLI, Shell Scripts, Kernel /proc internals</span>
                </div>
              </div>
            </div>

            {/* Coordinates & Verified Links */}
            <div className={`border-t pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] ${
              isClassicGreen ? 'border-emerald-500/20 text-emerald-300/80' : 'border-cyan-500/20 text-slate-400'
            }`}>
              <div>
                <span className={isClassicGreen ? 'text-emerald-500' : 'text-slate-500'}>Location:</span>{' '}
                <span className={isClassicGreen ? 'text-emerald-200' : 'text-slate-200'}>{PERSONAL_INFO.location}</span>
                <span className={`mx-2 ${isClassicGreen ? 'text-emerald-800' : 'text-slate-700'}`}>•</span>
                <span className={isClassicGreen ? 'text-emerald-500' : 'text-slate-500'}>GitHub:</span>{' '}
                <a href={PERSONAL_INFO.githubUrl} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
                  @{PERSONAL_INFO.handle}
                </a>
              </div>
              <div>
                <span className={isClassicGreen ? 'text-emerald-500' : 'text-slate-500'}>Inquiry:</span>{' '}
                <a href="#contact" onClick={handleClose} className="text-emerald-400 hover:underline">
                  Direct Secure Form (#contact)
                </a>
              </div>
            </div>
          </div>
        );
        break;

      case 'status':
        output = (
          <div className={`text-xs space-y-1 font-mono ${isClassicGreen ? 'text-emerald-200' : 'text-slate-300'}`}>
            <p className="text-emerald-400 font-semibold">✓ UPTIME: 99.98% [NOMINAL]</p>
            <p className={isClassicGreen ? 'text-emerald-300' : 'text-cyan-400'}>✓ CORE STACK: Node.js (v20+), Python (v3.11+), Linux (POSIX CLI)</p>
            <p className={isClassicGreen ? 'text-emerald-300' : 'text-indigo-400'}>✓ PROTOCOL LAYER: TCP/IP Stack, Wire-level Inspection, Socket I/O</p>
            <p className="text-emerald-400">✓ DEFENSE STATUS: Hardened Headers, TLS Enforced, Zero Fake Claims</p>
            <p className={isAudioEnabled ? 'text-cyan-400' : 'text-slate-500'}>
              ✓ AUDIO FX SUBSYSTEM: {isAudioEnabled ? 'ACTIVE [CLICK/BEEP ENABLED]' : 'MUTED'}
            </p>
          </div>
        );
        break;

      case 'projects':
        output = (
          <div className="text-xs space-y-2">
            <p className={`${isClassicGreen ? 'text-emerald-300' : 'text-cyan-300'} font-semibold`}>
              VERIFIED PUBLIC REPOSITORIES (GitHub @{PERSONAL_INFO.handle}):
            </p>
            {VERIFIED_PROJECTS.map((p) => (
              <div key={p.id} className={`border-l-2 pl-2 ${isClassicGreen ? 'border-emerald-500/50' : 'border-cyan-500/40'}`}>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-mono font-bold">{p.title}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                    isClassicGreen
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {p.category}
                  </span>
                </div>
                <p className={`text-[11px] ${isClassicGreen ? 'text-emerald-200/80' : 'text-slate-400'}`}>{p.description}</p>
                {p.githubUrl && (
                  <a href={p.githubUrl} target="_blank" rel="noreferrer" className={`hover:underline text-[10px] font-mono ${
                    isClassicGreen ? 'text-emerald-400' : 'text-cyan-400'
                  }`}>
                    → {p.githubUrl}
                  </a>
                )}
              </div>
            ))}
          </div>
        );
        break;

      case 'labs':
        output = (
          <div className="text-xs space-y-2">
            <p className="text-emerald-300 font-semibold">NETWORK & SECURITY LAB JOURNAL:</p>
            {SECURITY_LABS.map((l) => (
              <div key={l.id} className="border-l-2 border-emerald-500/40 pl-2">
                <span className={`font-mono font-semibold ${isClassicGreen ? 'text-emerald-300' : 'text-cyan-400'}`}>[{l.code}] {l.title}</span>
                <p className={`text-[11px] ${isClassicGreen ? 'text-emerald-200/80' : 'text-slate-400'}`}>{l.summary}</p>
                <p className={`text-[10px] ${isClassicGreen ? 'text-emerald-500' : 'text-slate-500'}`}>Tools: {l.toolsUsed.join(', ')}</p>
              </div>
            ))}
          </div>
        );
        break;

      case 'netstat':
        output = (
          <div className={`text-xs font-mono space-y-1 ${isClassicGreen ? 'text-emerald-200' : 'text-slate-300'}`}>
            <p className={`font-bold ${isClassicGreen ? 'text-emerald-300' : 'text-cyan-400'}`}>ACTIVE PROTOCOL LISTENERS:</p>
            <p>tcp  0  0  0.0.0.0:443      0.0.0.0:*  LISTEN  [HTTPS / TLS 1.3]</p>
            <p>tcp  0  0  0.0.0.0:80       0.0.0.0:*  LISTEN  [HTTP Redirect]</p>
            <p>tcp  0  0  127.0.0.1:3000   0.0.0.0:*  LISTEN  [nodeJS-server API]</p>
            <p>udp  0  0  0.0.0.0:53       0.0.0.0:*          [DNS Resolver / Cache]</p>
            <p className="text-emerald-400 text-[11px] mt-1">State: ESTABLISHED / SECURE</p>
          </div>
        );
        break;

      case 'rss':
      case 'feed':
      case 'feeds':
        output = (
          <div className="text-xs font-mono space-y-2">
            <p className={isClassicGreen ? 'text-emerald-300 font-bold' : 'text-orange-400 font-bold'}>SYNDICATION & RSS FEED ENDPOINTS:</p>
            <div className={`space-y-1 ${isClassicGreen ? 'text-emerald-200' : 'text-slate-300'}`}>
              <p>• <strong className={isClassicGreen ? 'text-emerald-400' : 'text-orange-300'}>RSS 2.0 XML:</strong> <a href="/rss.xml" target="_blank" rel="noreferrer" className={`${isClassicGreen ? 'text-emerald-300' : 'text-cyan-400'} underline`}>/rss.xml</a></p>
              <p>• <strong className={isClassicGreen ? 'text-emerald-400' : 'text-orange-300'}>JSON Feed 1.1:</strong> <a href="/feed.json" target="_blank" rel="noreferrer" className={`${isClassicGreen ? 'text-emerald-300' : 'text-cyan-400'} underline`}>/feed.json</a></p>
              <p>• <strong className={isClassicGreen ? 'text-emerald-400' : 'text-orange-300'}>REST Feed API:</strong> <a href="/api/feed/items" target="_blank" rel="noreferrer" className={`${isClassicGreen ? 'text-emerald-300' : 'text-cyan-400'} underline`}>/api/feed/items</a></p>
            </div>
            <p className={`text-[11px] ${isClassicGreen ? 'text-emerald-400/80' : 'text-slate-400'}`}>
              Covers all verified labs, RFC studies, and systems posts with full XML payload enclosures.
            </p>
          </div>
        );
        break;

      case 'contact':
        output = (
          <div className={`text-xs space-y-1 ${isClassicGreen ? 'text-emerald-200' : 'text-slate-300'}`}>
            <p><strong className={isClassicGreen ? 'text-emerald-400' : 'text-cyan-400'}>Communication:</strong> Secure Inquiry Form on site (routed to verified inbox)</p>
            <p><strong className={isClassicGreen ? 'text-emerald-400' : 'text-cyan-400'}>Verified GitHub:</strong> {PERSONAL_INFO.githubUrl}</p>
            <p><strong className={isClassicGreen ? 'text-emerald-400' : 'text-cyan-400'}>Official Hubs:</strong> https://yeasin4745-dev.vercel.app | https://yeasin-sec.vercel.app</p>
            <p className={`text-[11px] ${isClassicGreen ? 'text-emerald-400/80' : 'text-slate-400'}`}>Direct encrypted message transmission with zero third-party trackers.</p>
          </div>
        );
        break;

      case 'theme':
      case 'theme contrast':
      case 'theme high-contrast':
      case 'theme dark': {
        playThemeSwitch();
        if (cmd === 'theme contrast' || cmd === 'theme high-contrast') {
          setTheme('high-contrast');
          output = (
            <div className="text-xs space-y-1 text-yellow-300 font-mono">
              <p className="text-yellow-400 font-bold">✓ GLOBAL THEME UPDATED: High Contrast Accessibility Mode</p>
              <p className="text-white text-[11px]">Solid high-contrast borders and WCAG AAA readability enabled across site.</p>
            </div>
          );
        } else if (cmd === 'theme dark') {
          setTheme('cyber-dark');
          output = (
            <div className="text-xs space-y-1 text-cyan-300 font-mono">
              <p className="text-cyan-400 font-bold">✓ GLOBAL THEME UPDATED: Cyber Dark Theme</p>
              <p className="text-slate-300 text-[11px]">Subtle neon gradients and terminal glow enabled across site.</p>
            </div>
          );
        } else {
          toggleTheme();
          const targetTheme = !isHighContrast ? 'High Contrast Accessibility Mode' : 'Cyber Dark Theme';
          output = (
            <div className="text-xs space-y-1 text-slate-300 font-mono">
              <p className="text-emerald-400 font-bold">✓ TOGGLED GLOBAL THEME: {targetTheme}</p>
              <p className="text-slate-400 text-[11px]">Type 'theme contrast' or 'theme dark' to switch explicitly.</p>
            </div>
          );
        }
        break;
      }

      case 'clear':
      case 'cls':
      case 'reset':
        playTerminalBeep();
        setHistory([]);
        setInputVal('');
        return;

      case 'exit':
        handleClose();
        setInputVal('');
        return;

      default:
        isSuccess = false;
        output = (
          <div className={`text-xs ${isClassicGreen ? 'text-emerald-400/90' : 'text-rose-400'}`}>
            Command not recognized: <span className="font-mono font-bold">'{cmd}'</span>. Type <span className={`${isClassicGreen ? 'text-emerald-300 underline' : 'text-cyan-300 underline'} font-bold cursor-pointer`} onClick={() => setInputVal('help')}>'help'</span> to view the command directory.
          </div>
        );
    }

    if (isSuccess) {
      playCommandExecute();
    } else {
      playCommandError();
    }

    setHistory((prev) => [
      ...prev,
      {
        id: `cmd-${Date.now()}`,
        command: rawCmd,
        timestamp: time,
        output,
      },
    ]);
    setInputVal('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="cyber-terminal-modal"
        className={`w-full ${
          isExpanded ? 'max-w-6xl h-[85vh]' : 'max-w-3xl h-[570px]'
        } ${
          isClassicGreen
            ? 'bg-[#020a05] border border-emerald-500/50 shadow-2xl shadow-emerald-950/80'
            : 'bg-[#0b0f19] border border-cyan-500/30 shadow-2xl shadow-cyan-950/50'
        } rounded-xl flex flex-col overflow-hidden transition-all duration-200 font-mono`}
      >
        {/* Terminal Titlebar */}
        <div className={`${
          isClassicGreen
            ? 'bg-[#061509] border-b border-emerald-900/60'
            : 'bg-[#111726] border-b border-slate-800'
        } px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 select-none`}>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleClose}
                className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-400 transition-colors cursor-pointer"
                title="Close"
                aria-label="Close Terminal Window"
              />
              <button
                onClick={() => {
                  playClick();
                  setIsExpanded(!isExpanded);
                }}
                className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-400 transition-colors cursor-pointer"
                title="Resize"
                aria-label="Toggle Window Size"
              />
              <button
                onClick={playTerminalBeep}
                className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-400 transition-colors cursor-pointer"
                title="Active (Click for Terminal Bell)"
                aria-label="Active Terminal Bell"
              />
            </div>
            <span className={`text-xs font-semibold ml-2 flex items-center gap-1.5 ${
              isClassicGreen ? 'text-emerald-300' : 'text-slate-300'
            }`}>
              <TerminalIcon className={`w-3.5 h-3.5 ${isClassicGreen ? 'text-emerald-400' : 'text-cyan-400'}`} />
              <span className="hidden sm:inline">yeasin@terminal: ~ [sys.telemetry]</span>
              <span className="sm:hidden">yeasin@terminal</span>
            </span>
          </div>

          {/* Theme Switcher, Audio FX Toggle & Window Action Controls */}
          <div className="flex items-center gap-2">
            {/* System Audio FX Toggle Button */}
            <button
              type="button"
              id="terminal-audio-toggle"
              onClick={toggleAudio}
              className={`p-1 px-2 rounded-lg border text-[11px] font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                isAudioEnabled
                  ? isClassicGreen
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-500/20'
                    : 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-sm shadow-cyan-500/20'
                  : 'bg-black/30 border-slate-700/60 text-slate-500 hover:text-slate-300'
              }`}
              title={isAudioEnabled ? 'System Audio: Active (Click to Mute)' : 'System Audio: Muted (Click to Enable FX)'}
              aria-label="Toggle Terminal Sound Effects"
            >
              {isAudioEnabled ? (
                <Volume2 className={`w-3 h-3 ${isClassicGreen ? 'text-emerald-400' : 'text-cyan-400'} animate-pulse`} />
              ) : (
                <VolumeX className="w-3 h-3 text-slate-500" />
              )}
              <span className="text-[10px] hidden sm:inline">{isAudioEnabled ? 'AUDIO: ON' : 'MUTED'}</span>
            </button>

            {/* Visual Color Theme Toggle */}
            <div
              id="terminal-theme-toggle"
              className={`flex items-center p-0.5 rounded-lg border text-[11px] font-mono transition-colors ${
                isClassicGreen
                  ? 'bg-[#030e06] border-emerald-800/80'
                  : 'bg-[#080d1a] border-slate-700/80'
              }`}
            >
              <button
                type="button"
                id="terminal-theme-green-btn"
                onClick={() => {
                  playThemeSwitch();
                  setTerminalTheme('classic-green');
                }}
                className={`px-2 py-0.5 rounded flex items-center gap-1.5 transition-all cursor-pointer ${
                  isClassicGreen
                    ? 'bg-emerald-500/25 text-emerald-300 font-bold border border-emerald-500/50 shadow-sm shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-emerald-400'
                }`}
                title="Switch to Classic Green Phosphor CRT theme"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isClassicGreen ? 'bg-emerald-400 animate-pulse' : 'bg-emerald-800'}`} />
                <span className="text-[10.5px]">Classic Green</span>
              </button>
              <button
                type="button"
                id="terminal-theme-cyber-btn"
                onClick={() => {
                  playThemeSwitch();
                  setTerminalTheme('modern-cyber');
                }}
                className={`px-2 py-0.5 rounded flex items-center gap-1.5 transition-all cursor-pointer ${
                  !isClassicGreen
                    ? 'bg-cyan-500/25 text-cyan-300 font-bold border border-cyan-500/50 shadow-sm shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-cyan-300'
                }`}
                title="Switch to Modern Cyber theme"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${!isClassicGreen ? 'bg-cyan-400 animate-pulse' : 'bg-cyan-800'}`} />
                <span className="text-[10.5px]">Modern Cyber</span>
              </button>
            </div>

            <div className={`flex items-center gap-1 ${isClassicGreen ? 'text-emerald-400' : 'text-slate-400'}`}>
              <button
                onClick={() => {
                  playClick();
                  setIsExpanded(!isExpanded);
                }}
                className={`p-1 rounded transition-colors cursor-pointer ${
                  isClassicGreen ? 'hover:text-emerald-200 hover:bg-emerald-950/40' : 'hover:text-cyan-400 hover:bg-slate-800'
                }`}
                title="Toggle Size"
                aria-label="Toggle Size"
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleClose}
                className="p-1 hover:text-rose-400 rounded transition-colors cursor-pointer"
                title="Close Terminal"
                aria-label="Close Terminal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Terminal Body */}
        <div className={`flex-1 overflow-y-auto p-4 space-y-4 text-sm font-mono ${
          isClassicGreen ? 'terminal-scanline-green text-emerald-300' : 'scanline text-slate-200'
        }`}>
          {history.map((item) => (
            <div key={item.id} className="space-y-1.5">
              <div className={`flex items-center gap-2 text-xs ${
                isClassicGreen ? 'text-emerald-400/70' : 'text-slate-400'
              }`}>
                <span className={`font-bold ${isClassicGreen ? 'text-emerald-400 terminal-glow-green' : 'text-emerald-400'}`}>
                  yeasin@sys:~$
                </span>
                <span className={`font-semibold ${isClassicGreen ? 'text-emerald-100' : 'text-slate-100'}`}>
                  {item.command}
                </span>
                <span className={`text-[10px] ml-auto ${isClassicGreen ? 'text-emerald-700' : 'text-slate-600'}`}>
                  {item.timestamp}
                </span>
              </div>
              <div className="pl-4 py-1">{item.output}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Terminal Input Line */}
        <form onSubmit={handleCommand} className={`${
          isClassicGreen
            ? 'bg-[#030f07] border-t border-emerald-900/60'
            : 'bg-[#0e1422] border-t border-slate-800/80'
        } p-3 flex items-center gap-2`}>
          <span className={`font-mono text-xs font-bold whitespace-nowrap ${
            isClassicGreen ? 'text-emerald-400 terminal-glow-green' : 'text-emerald-400'
          }`}>
            yeasin@sys:~$
          </span>
          <input
            ref={inputRef}
            type="text"
            id="terminal-command-input"
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
              playKeyPress();
            }}
            placeholder="Type 'help', 'whoami', 'date', 'audio [on|off]', 'projects'..."
            className={`flex-1 bg-transparent font-mono text-xs focus:outline-none ${
              isClassicGreen
                ? 'text-emerald-300 placeholder:text-emerald-800/80'
                : 'text-cyan-300 placeholder:text-slate-600'
            }`}
            autoComplete="off"
            spellCheck="false"
          />
          <button
            type="submit"
            id="terminal-submit-btn"
            className={`transition-colors p-1 cursor-pointer ${
              isClassicGreen
                ? 'text-emerald-600 hover:text-emerald-300'
                : 'text-slate-500 hover:text-cyan-400'
            }`}
            title="Execute Command"
            aria-label="Execute Command"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
