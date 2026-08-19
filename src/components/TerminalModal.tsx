import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, CornerDownLeft, Shield, Server, Network, Contrast } from 'lucide-react';
import { PERSONAL_INFO, VERIFIED_PROJECTS, SECURITY_LABS } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandLog {
  id: string;
  command: string;
  output: React.ReactNode;
  timestamp: string;
}

export const TerminalModal: React.FC<TerminalModalProps> = ({ isOpen, onClose }) => {
  const { theme, isHighContrast, toggleTheme, setTheme } = useTheme();
  const [inputVal, setInputVal] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [history, setHistory] = useState<CommandLog[]>([
    {
      id: 'init-1',
      command: 'sys.init --verbose',
      timestamp: '00:00:01',
      output: (
        <div className="text-slate-300 space-y-1">
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
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      const handleTerminalShortcuts = (e: KeyboardEvent) => {
        // Ctrl+L or Cmd+L to clear terminal
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
          e.preventDefault();
          setHistory([]);
          setInputVal('');
        }
      };

      window.addEventListener('keydown', handleTerminalShortcuts);
      return () => window.removeEventListener('keydown', handleTerminalShortcuts);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim().toLowerCase();
    if (!cmd) return;

    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    let output: React.ReactNode;

    switch (cmd) {
      case 'help':
        output = (
          <div className="space-y-1.5 text-xs">
            <p className="text-cyan-300 font-semibold">AVAILABLE COMMANDS:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-slate-300">
              <div><button type="button" onClick={() => setInputVal('whoami')} className="text-emerald-400 font-mono hover:underline text-left">whoami</button> : Identity & formatted bio of Yeasin</div>
              <div><button type="button" onClick={() => setInputVal('status')} className="text-emerald-400 font-mono hover:underline text-left">status</button> : Telemetry & system health state</div>
              <div><button type="button" onClick={() => setInputVal('projects')} className="text-emerald-400 font-mono hover:underline text-left">projects</button> : Verified backend & logic repositories</div>
              <div><button type="button" onClick={() => setInputVal('labs')} className="text-emerald-400 font-mono hover:underline text-left">labs</button> : Active network & security lab logs</div>
              <div><button type="button" onClick={() => setInputVal('netstat')} className="text-emerald-400 font-mono hover:underline text-left">netstat</button> : Protocol stack & active ports</div>
              <div><button type="button" onClick={() => setInputVal('rss')} className="text-emerald-400 font-mono hover:underline text-left">rss</button> : Live RSS & JSON Feed endpoints</div>
              <div><button type="button" onClick={() => setInputVal('theme')} className="text-emerald-400 font-mono hover:underline text-left">theme</button> : Switch between Cyber Dark & High Contrast</div>
              <div><button type="button" onClick={() => setInputVal('contact')} className="text-emerald-400 font-mono hover:underline text-left">contact</button> : Verified communication channels</div>
              <div><button type="button" onClick={() => { setHistory([]); setInputVal(''); }} className="text-emerald-400 font-mono hover:underline text-left">clear</button> : Reset terminal history (or Ctrl+L)</div>
              <div><button type="button" onClick={onClose} className="text-emerald-400 font-mono hover:underline text-left">exit</button> : Close terminal interactive view</div>
            </div>
          </div>
        );
        break;

      case 'whoami':
      case 'who am i':
      case 'bio':
      case 'about':
      case 'id':
        output = (
          <div className="text-xs space-y-2.5 font-mono text-slate-200 border-l-2 border-cyan-400 pl-3 py-1.5 bg-cyan-950/20 rounded-r-md">
            {/* Header Identity Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/20 pb-2">
              <div>
                <span className="text-cyan-300 font-bold text-sm">{PERSONAL_INFO.name}</span>
                <span className="text-slate-400 text-xs ml-2">(@{PERSONAL_INFO.handle})</span>
                <span className="text-[10px] text-slate-500 block">Legal Full Name: {PERSONAL_INFO.legalFullName}</span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                ● {PERSONAL_INFO.status}
              </span>
            </div>

            {/* Tagline */}
            <div className="text-slate-300 italic text-[11px] leading-relaxed text-cyan-200/90">
              "{PERSONAL_INFO.tagline}"
            </div>

            {/* Role Summary & Bio */}
            <div className="text-xs text-slate-300 leading-relaxed space-y-0.5">
              <p className="font-semibold text-cyan-400">TECHNICAL PROFILE & BIO:</p>
              <p className="text-slate-300">{PERSONAL_INFO.roleSummary}</p>
            </div>

            {/* Engineering Pillars & Protocol Stack */}
            <div className="space-y-1 text-xs">
              <p className="font-semibold text-cyan-400">CORE SPECIALIZATIONS:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-300">
                <div className="flex items-start gap-1.5">
                  <span className="text-cyan-400 font-bold">▸</span>
                  <span><strong>Backend Systems:</strong> Node.js, Python, REST APIs, Async I/O, SQL</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">▸</span>
                  <span><strong>Computer Networking:</strong> TCP/IP, Sockets, Wireshark, DNS, TLS 1.3</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-indigo-400 font-bold">▸</span>
                  <span><strong>Cybersecurity:</strong> Threat Modeling, OWASP, Defense, Hardening</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">▸</span>
                  <span><strong>Linux Systems:</strong> POSIX CLI, Shell Scripts, Kernel /proc internals</span>
                </div>
              </div>
            </div>

            {/* Coordinates & Verified Links */}
            <div className="border-t border-cyan-500/20 pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
              <div>
                <span className="text-slate-500">Location:</span> <span className="text-slate-200">{PERSONAL_INFO.location}</span>
                <span className="mx-2 text-slate-700">•</span>
                <span className="text-slate-500">GitHub:</span>{' '}
                <a href={PERSONAL_INFO.githubUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">
                  @{PERSONAL_INFO.handle}
                </a>
              </div>
              <div>
                <span className="text-slate-500">Email:</span>{' '}
                <a href={`mailto:${PERSONAL_INFO.email}`} className="text-emerald-400 hover:underline">
                  {PERSONAL_INFO.email}
                </a>
              </div>
            </div>
          </div>
        );
        break;

      case 'status':
        output = (
          <div className="text-xs space-y-1 text-slate-300 font-mono">
            <p className="text-emerald-400">✓ UPTIME: 99.98% [NOMINAL]</p>
            <p className="text-cyan-400">✓ CORE STACK: Node.js (v20+), Python (v3.11+), Linux (POSIX CLI)</p>
            <p className="text-indigo-400">✓ PROTOCOL LAYER: TCP/IP Stack, Wire-level Inspection, Socket I/O</p>
            <p className="text-emerald-400">✓ DEFENSE STATUS: Hardened Headers, TLS Enforced, Zero Fake Claims</p>
          </div>
        );
        break;

      case 'projects':
        output = (
          <div className="text-xs space-y-2">
            <p className="text-cyan-300 font-semibold">VERIFIED PUBLIC REPOSITORIES (GitHub @{PERSONAL_INFO.handle}):</p>
            {VERIFIED_PROJECTS.map((p) => (
              <div key={p.id} className="border-l-2 border-cyan-500/40 pl-2">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-mono font-bold">{p.title}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {p.category}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">{p.description}</p>
                {p.githubUrl && (
                  <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline text-[10px] font-mono">
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
                <span className="text-cyan-400 font-mono font-semibold">[{l.code}] {l.title}</span>
                <p className="text-slate-400 text-[11px]">{l.summary}</p>
                <p className="text-slate-500 text-[10px]">Tools: {l.toolsUsed.join(', ')}</p>
              </div>
            ))}
          </div>
        );
        break;

      case 'netstat':
        output = (
          <div className="text-xs font-mono text-slate-300 space-y-1">
            <p className="text-cyan-400 font-bold">ACTIVE PROTOCOL LISTENERS:</p>
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
            <p className="text-orange-400 font-bold">SYNDICATION & RSS FEED ENDPOINTS:</p>
            <div className="space-y-1 text-slate-300">
              <p>• <strong className="text-orange-300">RSS 2.0 XML:</strong> <a href="/rss.xml" target="_blank" rel="noreferrer" className="text-cyan-400 underline">/rss.xml</a></p>
              <p>• <strong className="text-orange-300">JSON Feed 1.1:</strong> <a href="/feed.json" target="_blank" rel="noreferrer" className="text-cyan-400 underline">/feed.json</a></p>
              <p>• <strong className="text-orange-300">REST Feed API:</strong> <a href="/api/feed/items" target="_blank" rel="noreferrer" className="text-cyan-400 underline">/api/feed/items</a></p>
            </div>
            <p className="text-slate-400 text-[11px]">
              Covers all verified labs, RFC studies, and systems posts with full XML payload enclosures.
            </p>
          </div>
        );
        break;

      case 'contact':
        output = (
          <div className="text-xs space-y-1 text-slate-300">
            <p><strong className="text-cyan-400">Direct Email:</strong> {PERSONAL_INFO.email}</p>
            <p><strong className="text-cyan-400">Verified GitHub:</strong> {PERSONAL_INFO.githubUrl}</p>
            <p className="text-slate-400 text-[11px]">No third-party trackers or unauthorized social accounts active.</p>
          </div>
        );
        break;

      case 'theme':
      case 'theme contrast':
      case 'theme high-contrast':
      case 'theme dark':
      case 'theme cyber':
      case 'theme cyber-dark': {
        if (cmd === 'theme contrast' || cmd === 'theme high-contrast') {
          setTheme('high-contrast');
          output = (
            <div className="text-xs space-y-1 text-yellow-300 font-mono">
              <p className="text-yellow-400 font-bold">✓ DISPLAY THEME UPDATED: High Contrast Accessibility Mode</p>
              <p className="text-white text-[11px]">Solid high-contrast borders and WCAG AAA readability enabled.</p>
            </div>
          );
        } else if (cmd === 'theme dark' || cmd === 'theme cyber' || cmd === 'theme cyber-dark') {
          setTheme('cyber-dark');
          output = (
            <div className="text-xs space-y-1 text-cyan-300 font-mono">
              <p className="text-cyan-400 font-bold">✓ DISPLAY THEME UPDATED: Cyber Dark Theme</p>
              <p className="text-slate-300 text-[11px]">Subtle neon gradients and terminal glow enabled.</p>
            </div>
          );
        } else {
          toggleTheme();
          const targetTheme = !isHighContrast ? 'High Contrast Accessibility Mode' : 'Cyber Dark Theme';
          output = (
            <div className="text-xs space-y-1 text-slate-300 font-mono">
              <p className="text-emerald-400 font-bold">✓ TOGGLED THEME: {targetTheme}</p>
              <p className="text-slate-400 text-[11px]">Type 'theme contrast' or 'theme dark' to switch explicitly.</p>
            </div>
          );
        }
        break;
      }

      case 'clear':
      case 'cls':
      case 'reset':
        setHistory([]);
        setInputVal('');
        return;

      case 'exit':
        onClose();
        setInputVal('');
        return;

      default:
        output = (
          <div className="text-xs text-rose-400">
            Command not recognized: <span className="font-mono">'{cmd}'</span>. Type <span className="text-cyan-300 font-bold underline cursor-pointer" onClick={() => setInputVal('help')}>'help'</span> to view the command directory.
          </div>
        );
    }

    setHistory((prev) => [
      ...prev,
      {
        id: `cmd-${Date.now()}`,
        command: inputVal,
        timestamp: time,
        output,
      },
    ]);
    setInputVal('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="cyber-terminal-modal"
        className={`w-full ${
          isExpanded ? 'max-w-6xl h-[85vh]' : 'max-w-3xl h-[560px]'
        } bg-[#0b0f19] border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-950/50 flex flex-col overflow-hidden transition-all duration-200 font-mono`}
      >
        {/* Terminal Titlebar */}
        <div className="bg-[#111726] border-b border-slate-800 px-4 py-2.5 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <button
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-400 transition-colors"
                title="Close"
              />
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-400 transition-colors"
                title="Resize"
              />
              <button
                className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-400 transition-colors"
                title="Active"
              />
            </div>
            <span className="text-xs font-semibold text-slate-300 ml-2 flex items-center gap-1.5">
              <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
              yeasin@terminal: ~ [sys.telemetry]
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:text-cyan-400 rounded transition-colors"
              title="Toggle Size"
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:text-rose-400 rounded transition-colors"
              title="Close Terminal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm font-mono scanline">
          {history.map((item) => (
            <div key={item.id} className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="text-emerald-400">yeasin@sys:~$</span>
                <span className="text-slate-100 font-semibold">{item.command}</span>
                <span className="text-[10px] text-slate-600 ml-auto">{item.timestamp}</span>
              </div>
              <div className="pl-4 py-1 text-slate-200">{item.output}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Terminal Input Line */}
        <form onSubmit={handleCommand} className="bg-[#0e1422] border-t border-slate-800/80 p-3 flex items-center gap-2">
          <span className="text-emerald-400 font-mono text-xs font-bold whitespace-nowrap">
            yeasin@sys:~$
          </span>
          <input
            ref={inputRef}
            type="text"
            id="terminal-command-input"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type 'help', 'projects', 'status', 'whoami'..."
            className="flex-1 bg-transparent text-cyan-300 font-mono text-xs focus:outline-none placeholder:text-slate-600"
            autoComplete="off"
            spellCheck="false"
          />
          <button
            type="submit"
            id="terminal-submit-btn"
            className="text-slate-500 hover:text-cyan-400 transition-colors p-1"
            title="Execute Command"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
