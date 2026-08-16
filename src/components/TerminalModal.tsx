import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, CornerDownLeft, Shield, Server, Network } from 'lucide-react';
import { PERSONAL_INFO, VERIFIED_PROJECTS, SECURITY_LABS } from '../data/portfolioData';

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
              <div><span className="text-emerald-400 font-mono">whoami</span> : Identity & core technical philosophy</div>
              <div><span className="text-emerald-400 font-mono">status</span> : Telemetry & system health state</div>
              <div><span className="text-emerald-400 font-mono">projects</span> : Verified backend & logic repositories</div>
              <div><span className="text-emerald-400 font-mono">labs</span> : Active network & security lab logs</div>
              <div><span className="text-emerald-400 font-mono">netstat</span> : Protocol stack & active ports</div>
              <div><span className="text-emerald-400 font-mono">contact</span> : Verified communication channels</div>
              <div><span className="text-emerald-400 font-mono">clear</span> : Flush terminal output logs</div>
              <div><span className="text-emerald-400 font-mono">exit</span> : Close terminal interactive view</div>
            </div>
          </div>
        );
        break;

      case 'whoami':
        output = (
          <div className="text-xs space-y-1 text-slate-300">
            <p><strong className="text-cyan-400">Name:</strong> {PERSONAL_INFO.name} ({PERSONAL_INFO.legalFullName})</p>
            <p><strong className="text-cyan-400">Handle:</strong> {PERSONAL_INFO.handle}</p>
            <p><strong className="text-cyan-400">Role:</strong> {PERSONAL_INFO.roleSummary}</p>
            <p><strong className="text-cyan-400">Location:</strong> {PERSONAL_INFO.location}</p>
            <p><strong className="text-cyan-400">Status:</strong> {PERSONAL_INFO.status}</p>
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

      case 'contact':
        output = (
          <div className="text-xs space-y-1 text-slate-300">
            <p><strong className="text-cyan-400">Direct Email:</strong> {PERSONAL_INFO.email}</p>
            <p><strong className="text-cyan-400">Verified GitHub:</strong> {PERSONAL_INFO.githubUrl}</p>
            <p className="text-slate-400 text-[11px]">No third-party trackers or unauthorized social accounts active.</p>
          </div>
        );
        break;

      case 'clear':
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
