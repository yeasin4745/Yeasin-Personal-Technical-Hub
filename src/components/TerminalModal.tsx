import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, CornerDownLeft, Shield, Server, Network, Contrast, Sparkles, Monitor, Volume2, VolumeX, Palette, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { PERSONAL_INFO, VERIFIED_PROJECTS, SECURITY_LABS } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';
import { useSystemAudio } from '../context/AudioContext';
import { parseAnsiToReact, AnsiText, ANSI } from '../utils/ansiParser';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type TerminalColorTheme = 'classic-green' | 'modern-cyber';

export interface TerminalCommandDef {
  command: string;
  description: string;
  category: 'Core' | 'Systems' | 'Display' | 'Audio' | 'Portfolio' | 'Network';
  aliases?: string[];
}

export const COMMAND_REGISTRY: TerminalCommandDef[] = [
  { command: 'help', description: 'List available diagnostic commands', category: 'Core' },
  { command: 'colors', description: 'ANSI 16-color test palette (Green/Red/Yellow)', category: 'Display', aliases: ['ansi', 'palette', 'test-ansi'] },
  { command: 'echo', description: 'Print text with ANSI escape sequence support', category: 'Core' },
  { command: 'history', description: 'Show previously executed commands', category: 'Core', aliases: ['hist'] },
  { command: 'neofetch', description: 'System specs & ASCII logo summary', category: 'Systems', aliases: ['fetch', 'screenfetch', 'sysinfo', 'systeminfo'] },
  { command: 'whoami', description: 'Identity & formatted bio of Yeasin', category: 'Portfolio', aliases: ['who am i', 'bio', 'about', 'id'] },
  { command: 'status', description: 'Real-time telemetry, uptime & stack health', category: 'Systems', aliases: ['uptime', 'health', 'sysstat'] },
  { command: 'ping', description: 'Simulate network ICMP socket latency check', category: 'Network' },
  { command: 'projects', description: 'List verified public repositories', category: 'Portfolio', aliases: ['repos', 'work'] },
  { command: 'labs', description: 'Network & cybersecurity lab journals', category: 'Systems', aliases: ['security', 'experiments'] },
  { command: 'skills', description: 'Core technical stack & engineering competencies', category: 'Portfolio', aliases: ['stack', 'tech'] },
  { command: 'netstat', description: 'Active protocol listeners & network sockets', category: 'Network' },
  { command: 'date', description: 'Linux system date & current time', category: 'Systems', aliases: ['time', 'datetime', 'date -u', 'date --utc'] },
  { command: 'audio on', description: 'Enable system acoustic sound effects', category: 'Audio', aliases: ['sound on', 'unmute'] },
  { command: 'audio off', description: 'Mute system sound effects', category: 'Audio', aliases: ['sound off', 'mute'] },
  { command: 'audio toggle', description: 'Toggle sound effects state', category: 'Audio', aliases: ['audio', 'sound'] },
  { command: 'bell', description: 'Trigger soft terminal acoustic bell (BEL 0x07)', category: 'Audio' },
  { command: 'color green', description: 'Switch to CRT Phosphor Green theme', category: 'Display', aliases: ['color classic', 'theme green', 'theme classic'] },
  { command: 'color cyber', description: 'Switch to Modern Cyber theme', category: 'Display', aliases: ['color modern', 'theme cyber', 'theme modern'] },
  { command: 'theme', description: 'Toggle site-wide accessibility theme', category: 'Display' },
  { command: 'theme contrast', description: 'Enable High Contrast accessibility mode', category: 'Display', aliases: ['theme high-contrast'] },
  { command: 'theme dark', description: 'Enable Cyber Dark default theme', category: 'Display' },
  { command: 'rss', description: 'Syndication endpoints (XML & JSON feeds)', category: 'Core', aliases: ['feed', 'feeds'] },
  { command: 'contact', description: 'Direct contact info & verified GitHub', category: 'Portfolio', aliases: ['email', 'socials'] },
  { command: 'clear', description: 'Clear terminal screen log (or Ctrl+L)', category: 'Core', aliases: ['cls', 'reset'] },
  { command: 'exit', description: 'Close terminal session window', category: 'Core', aliases: ['quit', 'close'] },
];

interface CommandLog {
  id: string;
  command: string;
  output: React.ReactNode;
  timestamp: string;
  status?: 'success' | 'error' | 'system' | 'neutral';
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
  const [commandHistory, setCommandHistory] = useState<string[]>(() => {
    try {
      const saved = sessionStorage.getItem('terminal_cmd_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore sessionStorage errors
    }
    return ['help', 'neofetch', 'whoami'];
  });
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const tempDraftRef = useRef<string>('');
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<number>(0);

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

  useEffect(() => {
    try {
      sessionStorage.setItem('terminal_cmd_history', JSON.stringify(commandHistory));
    } catch {
      // Ignore sessionStorage errors
    }
  }, [commandHistory]);

  const [history, setHistory] = useState<CommandLog[]>([
    {
      id: 'init-1',
      command: 'sys.init --verbose',
      timestamp: '00:00:01',
      status: 'system',
      output: (
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="bg-amber-950/80 text-amber-300 border border-amber-800/60 px-1.5 py-0.5 rounded text-[10px] font-bold">
              [SYS]
            </span>
            <span className="text-emerald-400 font-semibold font-mono">
              Connected to Yeasin Technical Host (yeasin4745.node)
            </span>
          </div>
          <p className="text-cyan-400 text-xs">
            Core Focus: Backend Architecture • Computer Networking • Cybersecurity • Linux Systems
          </p>
          <p className="text-slate-400 text-xs">
            Type <span className="text-emerald-300 font-bold cursor-pointer underline" onClick={() => setInputVal('help')}>'help'</span> or <span className="text-cyan-300 font-bold cursor-pointer underline" onClick={() => setInputVal('colors')}>'colors'</span> to view ANSI palette & diagnostic directory.
          </p>
        </div>
      ),
    },
  ]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Command auto-completion matching and ghost prediction
  const trimmedInput = inputVal.trimStart().toLowerCase();

  const matchingSuggestions = React.useMemo(() => {
    if (!trimmedInput) return [];

    const exactPrefixMatches: TerminalCommandDef[] = [];
    const aliasPrefixMatches: TerminalCommandDef[] = [];
    const substringMatches: TerminalCommandDef[] = [];

    COMMAND_REGISTRY.forEach((def) => {
      const cmdLower = def.command.toLowerCase();
      if (cmdLower.startsWith(trimmedInput)) {
        exactPrefixMatches.push(def);
      } else if (def.aliases?.some((a) => a.toLowerCase().startsWith(trimmedInput))) {
        aliasPrefixMatches.push(def);
      } else if (cmdLower.includes(trimmedInput)) {
        substringMatches.push(def);
      }
    });

    const combined = [...exactPrefixMatches, ...aliasPrefixMatches, ...substringMatches];
    const seen = new Set<string>();
    return combined.filter((item) => {
      if (seen.has(item.command)) return false;
      seen.add(item.command);
      return true;
    });
  }, [trimmedInput]);

  const topMatch = matchingSuggestions[0];
  const ghostSuffix = React.useMemo(() => {
    if (!topMatch || !trimmedInput) return '';
    const topCmdLower = topMatch.command.toLowerCase();
    const rawLower = inputVal.toLowerCase();
    if (topCmdLower.startsWith(rawLower)) {
      return topMatch.command.slice(inputVal.length);
    }
    return '';
  }, [topMatch, trimmedInput, inputVal]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Tab key: Autocomplete matching suggestion or cycle suggestions (Shift+Tab goes backward)
    if (e.key === 'Tab') {
      e.preventDefault();
      if (matchingSuggestions.length > 0) {
        if (e.shiftKey) {
          const prevIdx = (selectedSuggestionIndex - 1 + matchingSuggestions.length) % matchingSuggestions.length;
          setSelectedSuggestionIndex(prevIdx);
          const targetCommand = matchingSuggestions[prevIdx]?.command;
          if (targetCommand) {
            setInputVal(targetCommand);
            playKeyPress();
          }
        } else {
          const targetCommand = matchingSuggestions[selectedSuggestionIndex]?.command || topMatch?.command;
          if (targetCommand) {
            setInputVal(targetCommand);
            playKeyPress();
            if (matchingSuggestions.length > 1) {
              setSelectedSuggestionIndex((prev) => (prev + 1) % matchingSuggestions.length);
            }
          }
        }
      }
      return;
    }

    // Right Arrow: Complete ghost suggestion if cursor is at end of input
    if (e.key === 'ArrowRight') {
      const input = inputRef.current;
      if (input && input.selectionStart === inputVal.length && ghostSuffix && topMatch) {
        e.preventDefault();
        setInputVal(topMatch.command);
        playKeyPress();
        return;
      }
    }

    // Up Arrow: Recall previous command from history (navigates backwards into history)
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        let nextIndex: number;
        if (historyIndex === -1) {
          // Store currently typed unsubmitted draft before navigating history
          tempDraftRef.current = inputVal;
          nextIndex = commandHistory.length - 1;
        } else {
          nextIndex = Math.max(0, historyIndex - 1);
        }
        setHistoryIndex(nextIndex);
        const recalledCmd = commandHistory[nextIndex] || '';
        setInputVal(recalledCmd);
        playKeyPress();

        // Move cursor to the end of input
        setTimeout(() => {
          if (inputRef.current) {
            const len = recalledCmd.length;
            inputRef.current.setSelectionRange(len, len);
          }
        }, 0);
      }
      return;
    }

    // Down Arrow: Recall newer command from history or restore draft prompt
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIndex = historyIndex + 1;
        if (nextIndex >= commandHistory.length) {
          // Reached beyond newest history entry: restore temporary draft
          setHistoryIndex(-1);
          const restoredDraft = tempDraftRef.current;
          setInputVal(restoredDraft);
          playKeyPress();
          setTimeout(() => {
            if (inputRef.current) {
              const len = restoredDraft.length;
              inputRef.current.setSelectionRange(len, len);
            }
          }, 0);
        } else {
          setHistoryIndex(nextIndex);
          const recalledCmd = commandHistory[nextIndex] || '';
          setInputVal(recalledCmd);
          playKeyPress();
          setTimeout(() => {
            if (inputRef.current) {
              const len = recalledCmd.length;
              inputRef.current.setSelectionRange(len, len);
            }
          }, 0);
        }
      }
      return;
    }

    // Escape: Clear current input and reset history navigation
    if (e.key === 'Escape') {
      if (inputVal) {
        e.preventDefault();
        setInputVal('');
        setHistoryIndex(-1);
        tempDraftRef.current = '';
        setSelectedSuggestionIndex(0);
      }
    }
  };

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
    let logStatus: 'success' | 'error' | 'system' | 'neutral' = 'success';

    // Parse command arguments for echo, ping, etc.
    const cmdParts = rawCmd.split(/\s+/);
    const primaryCmd = cmdParts[0].toLowerCase();
    const cmdArgs = rawCmd.substring(cmdParts[0].length).trim();

    if (primaryCmd === 'echo') {
      let textToEcho = cmdArgs;
      if (textToEcho.startsWith('-e ')) {
        textToEcho = textToEcho.substring(3).trim();
      }
      if ((textToEcho.startsWith('"') && textToEcho.endsWith('"')) ||
          (textToEcho.startsWith("'") && textToEcho.endsWith("'"))) {
        textToEcho = textToEcho.slice(1, -1);
      }

      output = (
        <div className="text-xs font-mono py-0.5">
          {parseAnsiToReact(textToEcho, { isClassicGreen })}
        </div>
      );
      logStatus = 'neutral';
    } else if (primaryCmd === 'ping') {
      const host = cmdArgs || 'yeasin4745.node';
      const pingTime1 = (Math.random() * 4 + 1.2).toFixed(1);
      const pingTime2 = (Math.random() * 5 + 1.4).toFixed(1);
      const pingTime3 = (Math.random() * 3 + 1.1).toFixed(1);
      const pingTime4 = (Math.random() * 4 + 1.3).toFixed(1);
      const avg = ((parseFloat(pingTime1) + parseFloat(pingTime2) + parseFloat(pingTime3) + parseFloat(pingTime4)) / 4).toFixed(2);

      output = (
        <div className="text-xs font-mono space-y-1 py-1">
          <p className={isClassicGreen ? 'text-emerald-300' : 'text-cyan-300'}>
            PING {host} (127.0.0.1): 56 data bytes
          </p>
          <div className="space-y-0.5 pl-1 text-[11.5px]">
            <p className={isClassicGreen ? 'text-emerald-200' : 'text-slate-300'}>
              64 bytes from {host}: icmp_seq=1 ttl=64 time=<span className="text-emerald-400 font-bold">{pingTime1} ms</span>
            </p>
            <p className={isClassicGreen ? 'text-emerald-200' : 'text-slate-300'}>
              64 bytes from {host}: icmp_seq=2 ttl=64 time=<span className="text-emerald-400 font-bold">{pingTime2} ms</span>
            </p>
            <p className={isClassicGreen ? 'text-emerald-200' : 'text-slate-300'}>
              64 bytes from {host}: icmp_seq=3 ttl=64 time=<span className="text-emerald-400 font-bold">{pingTime3} ms</span>
            </p>
            <p className={isClassicGreen ? 'text-emerald-200' : 'text-slate-300'}>
              64 bytes from {host}: icmp_seq=4 ttl=64 time=<span className="text-emerald-400 font-bold">{pingTime4} ms</span>
            </p>
          </div>
          <div className={`border-t pt-1 mt-1 text-[11px] ${isClassicGreen ? 'border-emerald-500/30' : 'border-cyan-500/20'}`}>
            <p className="text-emerald-400 font-semibold">--- {host} ping statistics ---</p>
            <p className={isClassicGreen ? 'text-emerald-200/90' : 'text-slate-300'}>
              4 packets transmitted, 4 received, <span className="text-emerald-400 font-bold">0% packet loss</span>, time 3004ms
            </p>
            <p className={isClassicGreen ? 'text-emerald-400' : 'text-cyan-400'}>
              rtt min/avg/max = {pingTime3}/{avg}/{pingTime2} ms
            </p>
          </div>
        </div>
      );
      logStatus = 'success';
    } else {
      switch (cmd) {
        case 'help':
          output = (
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 px-1.5 py-0.2 rounded text-[10px] font-bold">[OK]</span>
                <span className={isClassicGreen ? 'text-emerald-300 font-semibold' : 'text-cyan-300 font-semibold'}>
                  AVAILABLE DIAGNOSTIC & TELEMETRY COMMANDS:
                </span>
              </div>
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-1.5 ${isClassicGreen ? 'text-emerald-200/90' : 'text-slate-300'}`}>
                <div><button type="button" onClick={() => setInputVal('colors')} className="text-emerald-400 font-mono hover:underline text-left cursor-pointer font-semibold">colors / ansi</button> : ANSI color palette & status indicators</div>
                <div><button type="button" onClick={() => setInputVal('echo -e "\\x1b[32m[OK]\\x1b[0m System nominal"')} className="text-emerald-400 font-mono hover:underline text-left cursor-pointer font-semibold">echo -e &lt;msg&gt;</button> : Print text with ANSI codes</div>
                <div><button type="button" onClick={() => setInputVal('history')} className="text-emerald-400 font-mono hover:underline text-left cursor-pointer font-semibold">history</button> : View previously executed commands (↑/↓)</div>
                <div><button type="button" onClick={() => setInputVal('neofetch')} className="text-emerald-400 font-mono hover:underline text-left cursor-pointer font-semibold">neofetch</button> : System specs & ASCII logo summary</div>
                <div><button type="button" onClick={() => setInputVal('whoami')} className="text-emerald-400 font-mono hover:underline text-left cursor-pointer font-semibold">whoami</button> : Identity & formatted bio of Yeasin</div>
                <div><button type="button" onClick={() => setInputVal('status')} className="text-emerald-400 font-mono hover:underline text-left cursor-pointer font-semibold">status</button> : Telemetry & system health state</div>
                <div><button type="button" onClick={() => setInputVal('skills')} className="text-emerald-400 font-mono hover:underline text-left cursor-pointer font-semibold">skills</button> : Core engineering competencies</div>
                <div><button type="button" onClick={() => setInputVal('ping')} className="text-emerald-400 font-mono hover:underline text-left cursor-pointer font-semibold">ping [host]</button> : Socket ICMP latency benchmark</div>
                <div><button type="button" onClick={() => setInputVal('projects')} className="text-emerald-400 font-mono hover:underline text-left cursor-pointer font-semibold">projects</button> : Verified backend & logic repositories</div>
                <div><button type="button" onClick={() => setInputVal('labs')} className="text-emerald-400 font-mono hover:underline text-left cursor-pointer font-semibold">labs</button> : Active network & security lab logs</div>
                <div><button type="button" onClick={() => setInputVal('netstat')} className="text-emerald-400 font-mono hover:underline text-left cursor-pointer font-semibold">netstat</button> : Protocol stack & active ports</div>
                <div><button type="button" onClick={() => setInputVal('date')} className="text-emerald-400 font-mono hover:underline text-left cursor-pointer font-semibold">date</button> : Linux system date & current time</div>
                <div><button type="button" onClick={() => setInputVal('audio on')} className="text-emerald-400 font-mono hover:underline text-left cursor-pointer font-semibold">audio [on|off]</button> : System sound effects toggle</div>
                <div><button type="button" onClick={() => setInputVal('color cyber')} className="text-emerald-400 font-mono hover:underline text-left cursor-pointer font-semibold">color [green|cyber]</button> : Switch terminal CRT theme</div>
                <div><button type="button" onClick={() => setInputVal('theme')} className="text-emerald-400 font-mono hover:underline text-left cursor-pointer font-semibold">theme</button> : Toggle global site display theme</div>
                <div><button type="button" onClick={() => setInputVal('rss')} className="text-emerald-400 font-mono hover:underline text-left cursor-pointer font-semibold">rss</button> : Live RSS & JSON Feed endpoints</div>
                <div><button type="button" onClick={() => setInputVal('contact')} className="text-emerald-400 font-mono hover:underline text-left cursor-pointer font-semibold">contact</button> : Verified communication channels</div>
                <div><button type="button" onClick={() => { playTerminalBeep(); setHistory([]); setInputVal(''); }} className="text-emerald-400 font-mono hover:underline text-left cursor-pointer font-semibold">clear</button> : Reset terminal history (or Ctrl+L)</div>
                <div><button type="button" onClick={handleClose} className="text-emerald-400 font-mono hover:underline text-left cursor-pointer font-semibold">exit</button> : Close interactive session window</div>
              </div>
            </div>
          );
          logStatus = 'success';
          break;

        case 'colors':
        case 'ansi':
        case 'palette':
        case 'test-ansi': {
          output = (
            <div className="text-xs space-y-3 font-mono">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 px-1.5 py-0.2 rounded text-[10px] font-bold">[OK]</span>
                <span className={`font-semibold ${isClassicGreen ? 'text-emerald-300' : 'text-cyan-300'}`}>
                  ANSI COLOR & STATUS SIGNAL SYSTEM:
                </span>
              </div>

              {/* Status indicator examples: Green, Red, Yellow */}
              <div className={`p-2.5 rounded border space-y-1.5 ${
                isClassicGreen ? 'bg-emerald-950/40 border-emerald-800/60' : 'bg-slate-900/80 border-slate-800'
              }`}>
                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Visual Status Signals:</p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-700/80">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    [SUCCESS] Successful Command (Green \x1b[32m)
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-950/90 text-rose-300 border border-rose-700/80">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    [ERROR] Command / Socket Failed (Red \x1b[31m)
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-950/90 text-amber-300 border border-amber-700/80">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    [SYSTEM] Telemetry / Config Notice (Yellow \x1b[33m)
                  </span>
                </div>
              </div>

              {/* Standard 8 Colors Foreground */}
              <div className="space-y-1">
                <p className={`text-[11px] font-semibold ${isClassicGreen ? 'text-emerald-400' : 'text-slate-400'}`}>
                  Standard ANSI Colors (30-37):
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px]">
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-slate-900 border border-slate-700" /><span className="text-slate-500 font-bold">30 Black</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-rose-500" /><span className="text-rose-400 font-bold">31 Red</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-500" /><span className="text-emerald-400 font-bold">32 Green</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-500" /><span className="text-amber-300 font-bold">33 Yellow</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-500" /><span className="text-blue-400 font-bold">34 Blue</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-purple-500" /><span className="text-purple-400 font-bold">35 Magenta</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-cyan-400" /><span className="text-cyan-300 font-bold">36 Cyan</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-slate-100" /><span className="text-slate-200 font-bold">37 White</span></div>
                </div>
              </div>

              {/* Try echo usage example */}
              <div className={`p-2 rounded text-[11px] ${
                isClassicGreen ? 'bg-emerald-950/60 text-emerald-300' : 'bg-slate-900 text-slate-300'
              }`}>
                <span className="font-semibold text-emerald-400">Pro-tip:</span> Try running:{' '}
                <span
                  className="underline text-cyan-300 cursor-pointer font-bold"
                  onClick={() => setInputVal('echo -e "\\x1b[32m[SUCCESS]\\x1b[0m All systems nominal. \\x1b[33m[SYS]\\x1b[0m Audio active."')}
                >
                  echo -e "\x1b[32m[SUCCESS]\x1b[0m All systems nominal. \x1b[33m[SYS]\x1b[0m Audio active."
                </span>
              </div>
            </div>
          );
          logStatus = 'success';
          break;
        }

        case 'skills':
        case 'stack':
        case 'tech': {
          output = (
            <div className="text-xs space-y-2 font-mono">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 px-1.5 py-0.2 rounded text-[10px] font-bold">[OK]</span>
                <span className={isClassicGreen ? 'text-emerald-300 font-semibold' : 'text-cyan-300 font-semibold'}>
                  CORE ENGINEERING COMPETENCIES:
                </span>
              </div>
              <div className={`space-y-1.5 pl-2 border-l-2 ${isClassicGreen ? 'border-emerald-500/50 text-emerald-200' : 'border-cyan-500/50 text-slate-300'}`}>
                <div>
                  <span className="text-emerald-400 font-bold">● Backend Architecture:</span> Node.js, Express, TypeScript, Python, REST APIs, Asynchronous I/O, PostgreSQL
                </div>
                <div>
                  <span className="text-cyan-400 font-bold">● Computer Networking:</span> TCP/IP Model, Sockets, Packet Inspection, Wireshark, DNS, HTTP/2 & HTTP/3, TLS 1.3
                </div>
                <div>
                  <span className="text-amber-400 font-bold">● Linux & Systems:</span> POSIX Shell Scripting, Kernel /proc telemetry, Process Management, systemd
                </div>
                <div>
                  <span className="text-indigo-400 font-bold">● Cybersecurity:</span> OWASP Top 10, Defense in Depth, Security Headers (CSP, HSTS), Threat Modeling
                </div>
              </div>
            </div>
          );
          logStatus = 'success';
          break;
        }

      case 'history':
      case 'hist': {
        output = (
          <div className="space-y-1.5 text-xs font-mono">
            <p className={isClassicGreen ? 'text-emerald-300 font-semibold' : 'text-cyan-300 font-semibold'}>
              COMMAND EXECUTION HISTORY:
            </p>
            {commandHistory.length === 0 ? (
              <p className={isClassicGreen ? 'text-emerald-600' : 'text-slate-500'}>
                No commands recorded in this session yet.
              </p>
            ) : (
              <div className="space-y-1 max-h-48 overflow-y-auto pr-2">
                {commandHistory.map((cmdStr, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className={`w-6 text-right font-semibold ${isClassicGreen ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setInputVal(cmdStr);
                        inputRef.current?.focus();
                      }}
                      className={`text-left font-mono hover:underline cursor-pointer ${
                        isClassicGreen ? 'text-emerald-300' : 'text-cyan-300'
                      }`}
                      title={`Click to recall "${cmdStr}"`}
                    >
                      {cmdStr}
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className={`text-[11px] pt-1 ${isClassicGreen ? 'text-emerald-500/80' : 'text-slate-400'}`}>
              Navigate command history using <span className={isClassicGreen ? 'text-emerald-300 font-bold' : 'text-cyan-300 font-bold'}>↑ (Up)</span> and <span className={isClassicGreen ? 'text-emerald-300 font-bold' : 'text-cyan-300 font-bold'}>↓ (Down)</span> arrow keys at the prompt.
            </p>
          </div>
        );
        break;
      }

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

      case 'neofetch':
      case 'fetch':
      case 'screenfetch':
      case 'sysinfo':
      case 'systeminfo': {
        output = (
          <div className="flex flex-col md:flex-row items-start gap-3 md:gap-5 pt-1">
            {/* ASCII Art Logo of Yeasin Technical Hub */}
            <div className="shrink-0 select-none">
              <pre className={`font-mono text-[11px] leading-[1.18] font-bold ${
                isClassicGreen
                  ? 'text-emerald-400 terminal-glow-green'
                  : 'text-cyan-400 terminal-glow-cyan'
              }`}>
{`       .------------------.
      /  __  ______  _  __ \\
     |  / / / / __/ / |/ /  |
     | / /_/ /\\ \\  /    /   |
     | \\____/___/ /_/|_/    |
     |  [YEASIN TECH HUB]   |
      \\____________________/
          ||          ||     
       ====            ====  `}
              </pre>
              <div className={`text-[10px] text-center mt-1 font-mono font-semibold ${
                isClassicGreen ? 'text-emerald-600' : 'text-slate-500'
              }`}>
                yeasin4745.node
              </div>
            </div>

            {/* Neofetch System Information Fields */}
            <div className="space-y-0.5 text-xs font-mono flex-1">
              <div className="pb-1">
                <span className={isClassicGreen ? 'text-emerald-300 font-bold' : 'text-cyan-300 font-bold'}>yeasin</span>
                <span className={isClassicGreen ? 'text-emerald-500' : 'text-slate-400'}>@</span>
                <span className={isClassicGreen ? 'text-emerald-300 font-bold' : 'text-indigo-400 font-bold'}>sys.local</span>
                <div className={`h-[1px] w-full my-1 ${isClassicGreen ? 'bg-emerald-500/40' : 'bg-slate-700'}`} />
              </div>

              <div><span className={`font-semibold ${isClassicGreen ? 'text-emerald-400' : 'text-cyan-400'}`}>OS:</span> <span className={isClassicGreen ? 'text-emerald-100' : 'text-slate-200'}>Linux (POSIX 6.8.0-netsec-hardened)</span></div>
              <div><span className={`font-semibold ${isClassicGreen ? 'text-emerald-400' : 'text-cyan-400'}`}>Host:</span> <span className={isClassicGreen ? 'text-emerald-100' : 'text-slate-200'}>Yeasin Technical Portfolio v2.4 (x86_64)</span></div>
              <div><span className={`font-semibold ${isClassicGreen ? 'text-emerald-400' : 'text-cyan-400'}`}>Role:</span> <span className={isClassicGreen ? 'text-emerald-100' : 'text-slate-200'}>Backend Dev & Systems Researcher</span></div>
              <div><span className={`font-semibold ${isClassicGreen ? 'text-emerald-400' : 'text-cyan-400'}`}>Kernel:</span> <span className={isClassicGreen ? 'text-emerald-100' : 'text-slate-200'}>6.8.0-sys-async (Linux POSIX)</span></div>
              <div><span className={`font-semibold ${isClassicGreen ? 'text-emerald-400' : 'text-cyan-400'}`}>Uptime:</span> <span className={isClassicGreen ? 'text-emerald-100' : 'text-slate-200'}>Active Continuous Systems Research</span></div>
              <div><span className={`font-semibold ${isClassicGreen ? 'text-emerald-400' : 'text-cyan-400'}`}>Packages:</span> <span className={isClassicGreen ? 'text-emerald-100' : 'text-slate-200'}>Node.js, Express, Python 3, Vite, Tailwind</span></div>
              <div><span className={`font-semibold ${isClassicGreen ? 'text-emerald-400' : 'text-cyan-400'}`}>Shell:</span> <span className={isClassicGreen ? 'text-emerald-100' : 'text-slate-200'}>yeasin-sh v1.2.0 (interactive)</span></div>
              <div><span className={`font-semibold ${isClassicGreen ? 'text-emerald-400' : 'text-cyan-400'}`}>Resolution:</span> <span className={isClassicGreen ? 'text-emerald-100' : 'text-slate-200'}>Responsive Canvas (WebGL Grid)</span></div>
              <div><span className={`font-semibold ${isClassicGreen ? 'text-emerald-400' : 'text-cyan-400'}`}>Terminal:</span> <span className={isClassicGreen ? 'text-emerald-100' : 'text-slate-200'}>React XTerm / CRT Phosphor [{isClassicGreen ? 'Classic Green' : 'Modern Cyber'}]</span></div>
              <div><span className={`font-semibold ${isClassicGreen ? 'text-emerald-400' : 'text-cyan-400'}`}>CPU:</span> <span className={isClassicGreen ? 'text-emerald-100' : 'text-slate-200'}>Asynchronous V8 Event Loop @ 8 Cores</span></div>
              <div><span className={`font-semibold ${isClassicGreen ? 'text-emerald-400' : 'text-cyan-400'}`}>Memory:</span> <span className={isClassicGreen ? 'text-emerald-100' : 'text-slate-200'}>Active / Optimized Static SPA Runtime</span></div>
              <div><span className={`font-semibold ${isClassicGreen ? 'text-emerald-400' : 'text-cyan-400'}`}>Protocols:</span> <span className={isClassicGreen ? 'text-emerald-100' : 'text-slate-200'}>TCP/IP, Sockets, TLS 1.3, HTTP/2, REST</span></div>
              <div><span className={`font-semibold ${isClassicGreen ? 'text-emerald-400' : 'text-cyan-400'}`}>Audio FX:</span> <span className={isClassicGreen ? 'text-emerald-100' : 'text-slate-200'}>{isAudioEnabled ? 'Active [Web Audio API]' : 'Muted (type "audio on")'}</span></div>
              <div><span className={`font-semibold ${isClassicGreen ? 'text-emerald-400' : 'text-cyan-400'}`}>Location:</span> <span className={isClassicGreen ? 'text-emerald-100' : 'text-slate-200'}>{PERSONAL_INFO.location}</span></div>

              {/* Color test strip palette */}
              <div className="flex items-center gap-1.5 pt-2 select-none">
                <span className="w-3.5 h-3 rounded-sm bg-slate-900 border border-slate-700 inline-block" title="Black" />
                <span className="w-3.5 h-3 rounded-sm bg-rose-500 inline-block" title="Red" />
                <span className="w-3.5 h-3 rounded-sm bg-emerald-500 inline-block" title="Green" />
                <span className="w-3.5 h-3 rounded-sm bg-amber-500 inline-block" title="Yellow" />
                <span className="w-3.5 h-3 rounded-sm bg-blue-500 inline-block" title="Blue" />
                <span className="w-3.5 h-3 rounded-sm bg-purple-500 inline-block" title="Magenta" />
                <span className="w-3.5 h-3 rounded-sm bg-cyan-400 inline-block" title="Cyan" />
                <span className="w-3.5 h-3 rounded-sm bg-slate-200 inline-block" title="White" />
              </div>
            </div>
          </div>
        );
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
            <p><strong className={isClassicGreen ? 'text-emerald-400' : 'text-blue-400'}>Verified LinkedIn:</strong> https://linkedin.com/in/yeasin4745</p>
            <p><strong className={isClassicGreen ? 'text-emerald-400' : 'text-cyan-400'}>Primary Hub:</strong> https://yeasin4745-dev.vercel.app</p>
            <p><strong className={isClassicGreen ? 'text-emerald-400' : 'text-emerald-400'}>Secondary Hub (Node.js):</strong> https://yeasin4745-node.vercel.app/</p>
            <p><strong className={isClassicGreen ? 'text-emerald-400' : 'text-cyan-400'}>Security Hub:</strong> https://yeasin-sec.vercel.app</p>
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
        logStatus = 'error';
        output = (
          <div className="text-xs font-mono space-y-1 text-rose-400">
            <div className="flex items-center gap-2">
              <span className="bg-rose-950/80 text-rose-300 border border-rose-800/60 px-1.5 py-0.2 rounded text-[10px] font-bold">[ERROR]</span>
              <span>Command not recognized: <span className="font-mono font-bold text-rose-200">'{cmd}'</span></span>
            </div>
            <p className="text-[11px] text-slate-400 pl-1">
              Type <span className={`${isClassicGreen ? 'text-emerald-300 underline' : 'text-cyan-300 underline'} font-bold cursor-pointer`} onClick={() => setInputVal('help')}>'help'</span> to view the command directory or <span className="text-emerald-300 underline font-bold cursor-pointer" onClick={() => setInputVal('colors')}>'colors'</span> for ANSI support.
            </p>
          </div>
        );
      }
    }

    if (isSuccess) {
      playCommandExecute();
    } else {
      playCommandError();
    }

    if (rawCmd) {
      setCommandHistory((prev) => {
        if (prev.length > 0 && prev[prev.length - 1] === rawCmd) {
          return prev;
        }
        return [...prev, rawCmd];
      });
      setHistoryIndex(-1);
      tempDraftRef.current = '';
    }
    setSelectedSuggestionIndex(0);

    setHistory((prev) => [
      ...prev,
      {
        id: `cmd-${Date.now()}`,
        command: rawCmd,
        timestamp: time,
        output,
        status: logStatus,
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
          {history.map((item) => {
            const status = item.status || 'success';
            return (
              <div key={item.id} className="space-y-1.5 group">
                <div className={`flex items-center gap-2 text-xs ${
                  isClassicGreen ? 'text-emerald-400/70' : 'text-slate-400'
                }`}>
                  {/* Status Indicator Tag */}
                  {status === 'error' && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-950/80 text-rose-300 border border-rose-800/70 shrink-0">
                      ERR
                    </span>
                  )}
                  {status === 'system' && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800/70 shrink-0">
                      SYS
                    </span>
                  )}
                  {status === 'success' && (
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border shrink-0 ${
                      isClassicGreen
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
                        : 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50'
                    }`}>
                      OK
                    </span>
                  )}
                  {status === 'neutral' && (
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border shrink-0 ${
                      isClassicGreen
                        ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/60'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      CLI
                    </span>
                  )}

                  <span className={`font-bold ${
                    isClassicGreen
                      ? 'text-emerald-400 terminal-glow-green'
                      : status === 'error'
                      ? 'text-rose-400'
                      : status === 'system'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}>
                    yeasin@sys:~$
                  </span>
                  <span className={`font-semibold ${
                    status === 'error'
                      ? 'text-rose-200'
                      : isClassicGreen
                      ? 'text-emerald-100'
                      : 'text-slate-100'
                  }`}>
                    {item.command}
                  </span>
                  <span className={`text-[10px] ml-auto tabular-nums ${isClassicGreen ? 'text-emerald-700' : 'text-slate-600'}`}>
                    {item.timestamp}
                  </span>
                </div>
                <div className="pl-5 py-1">{item.output}</div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Command Suggestions Bar (appears subtly when typing matching commands) */}
        {matchingSuggestions.length > 0 && inputVal.trim() !== '' && (
          <div
            id="terminal-suggestions-bar"
            className={`px-3 py-1.5 flex flex-wrap items-center gap-1.5 text-[11px] font-mono border-t transition-all ${
              isClassicGreen
                ? 'bg-[#020d05] border-emerald-900/50 text-emerald-300'
                : 'bg-[#0a0f1d] border-slate-800/90 text-slate-300'
            }`}
          >
            <span className={`text-[10px] uppercase font-bold flex items-center gap-1 shrink-0 ${
              isClassicGreen ? 'text-emerald-500' : 'text-slate-500'
            }`}>
              <Sparkles className="w-3 h-3" />
              Matches:
            </span>
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto py-0.5 max-h-16">
              {matchingSuggestions.slice(0, 5).map((sug, idx) => {
                const isSelected = idx === selectedSuggestionIndex;
                return (
                  <button
                    key={sug.command}
                    type="button"
                    onClick={() => {
                      playKeyPress();
                      setInputVal(sug.command);
                      setSelectedSuggestionIndex(0);
                      inputRef.current?.focus();
                    }}
                    className={`px-2 py-0.5 rounded text-[10.5px] font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? isClassicGreen
                          ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-500/70 font-semibold shadow-sm shadow-emerald-500/20'
                          : 'bg-cyan-500/25 text-cyan-200 border border-cyan-500/70 font-semibold shadow-sm shadow-cyan-500/20'
                        : isClassicGreen
                          ? 'bg-emerald-950/40 text-emerald-400/80 hover:text-emerald-200 hover:bg-emerald-900/50 border border-emerald-800/40'
                          : 'bg-slate-800/60 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 border border-slate-700/50'
                    }`}
                    title={`${sug.command} — ${sug.description}`}
                  >
                    <span className="font-bold">{sug.command}</span>
                    <span className={`text-[9.5px] hidden md:inline ${
                      isSelected
                        ? isClassicGreen ? 'text-emerald-300' : 'text-cyan-300'
                        : isClassicGreen ? 'text-emerald-600' : 'text-slate-500'
                    }`}>
                      • {sug.description}
                    </span>
                    {isSelected && (
                      <span className={`text-[9px] px-1 py-0.2 rounded font-sans font-medium uppercase tracking-tight ${
                        isClassicGreen ? 'bg-emerald-500/30 text-emerald-200' : 'bg-cyan-500/30 text-cyan-200'
                      }`}>
                        Tab ⇥
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="ml-auto text-[10px] text-slate-500 hidden sm:flex items-center gap-1.5 shrink-0">
              <span className="flex items-center gap-1">
                <kbd className={`px-1 py-0.5 rounded text-[9px] border font-mono ${
                  isClassicGreen ? 'bg-emerald-950/80 border-emerald-800 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}>↑</kbd>
                <kbd className={`px-1 py-0.5 rounded text-[9px] border font-mono ${
                  isClassicGreen ? 'bg-emerald-950/80 border-emerald-800 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}>↓</kbd>
                <span>history</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <kbd className={`px-1 py-0.5 rounded text-[9px] border font-mono ${
                  isClassicGreen ? 'bg-emerald-950/80 border-emerald-800 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}>Tab</kbd>
                <span>complete</span>
              </span>
            </div>
          </div>
        )}

        {/* Terminal Input Line with Ghost Auto-completion */}
        <form onSubmit={handleCommand} className={`${
          isClassicGreen
            ? 'bg-[#030f07] border-t border-emerald-900/60'
            : 'bg-[#0e1422] border-t border-slate-800/80'
        } p-3 flex items-center gap-2 relative`}>
          <span className={`font-mono text-xs font-bold whitespace-nowrap select-none ${
            isClassicGreen ? 'text-emerald-400 terminal-glow-green' : 'text-emerald-400'
          }`}>
            yeasin@sys:~$
          </span>
          <div className="relative flex-1 flex items-center min-w-0">
            {/* Ghost suggestion overlay positioned under active input */}
            {ghostSuffix && (
              <div
                className="absolute inset-0 flex items-center pointer-events-none font-mono text-xs overflow-hidden select-none"
                aria-hidden="true"
              >
                <span className="opacity-0 whitespace-pre">{inputVal}</span>
                <span className={`${
                  isClassicGreen
                    ? 'text-emerald-500/50 terminal-glow-green font-medium'
                    : 'text-cyan-400/50 font-medium'
                }`}>
                  {ghostSuffix}
                </span>
              </div>
            )}
            <input
              ref={inputRef}
              type="text"
              id="terminal-command-input"
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
                setSelectedSuggestionIndex(0);
                playKeyPress();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type 'help', 'neofetch', 'whoami', 'date', 'projects'..."
              className={`relative z-10 w-full bg-transparent font-mono text-xs focus:outline-none ${
                isClassicGreen
                  ? 'text-emerald-300 placeholder:text-emerald-800/80'
                  : 'text-cyan-300 placeholder:text-slate-600'
              }`}
              autoComplete="off"
              spellCheck="false"
            />
          </div>
          {ghostSuffix && (
            <button
              type="button"
              id="terminal-tab-complete-btn"
              onClick={() => {
                if (topMatch) {
                  setInputVal(topMatch.command);
                  playKeyPress();
                  inputRef.current?.focus();
                }
              }}
              className={`hidden sm:flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
                isClassicGreen
                  ? 'bg-emerald-950/80 border-emerald-800/80 text-emerald-400 hover:text-emerald-200'
                  : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-cyan-300'
              }`}
              title="Click or press Tab to auto-complete suggestion"
            >
              <span>Tab ⇥</span>
            </button>
          )}
          <button
            type="submit"
            id="terminal-submit-btn"
            className={`transition-colors p-1 cursor-pointer shrink-0 ${
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
