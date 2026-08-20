import React, { useState } from 'react';
import { Copy, Check, Terminal, Code2 } from 'lucide-react';
import { useSystemAudio } from '../context/AudioContext';

interface CopyButtonProps {
  textToCopy: string;
  className?: string;
  id?: string;
  size?: 'sm' | 'md';
  variant?: 'button' | 'icon-only';
  label?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  className = '',
  id,
  size = 'sm',
  variant = 'button',
  label = 'Copy',
}) => {
  const [copied, setCopied] = useState(false);
  const { playCommandExecute } = useSystemAudio();

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      playCommandExecute();
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for sandboxed iframes or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback attempt
      try {
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed: ', fallbackErr);
      }
    }
  };

  const buttonId = id || `copy-btn-${Math.random().toString(36).substring(2, 9)}`;

  if (variant === 'icon-only') {
    return (
      <button
        onClick={handleCopy}
        id={buttonId}
        type="button"
        title={copied ? 'Copied to clipboard!' : 'Copy to clipboard'}
        aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
        className={`p-1.5 rounded-md transition-all duration-150 cursor-pointer flex items-center justify-center ${
          copied
            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
            : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/30'
        } ${className}`}
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleCopy}
      id={buttonId}
      type="button"
      title={copied ? 'Copied to clipboard!' : 'Copy to clipboard'}
      aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
      className={`inline-flex items-center gap-1.5 font-mono text-xs font-semibold rounded-md transition-all duration-150 cursor-pointer ${
        size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'
      } ${
        copied
          ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.35)]'
          : 'bg-[#121929] hover:bg-[#1a233a] text-slate-300 hover:text-cyan-300 border border-slate-700/80 hover:border-cyan-500/40'
      } ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-300">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-300" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};

interface CodeSnippetBoxProps {
  code: string;
  language?: string;
  title?: string;
  description?: string;
  className?: string;
  id?: string;
  prefix?: string;
  compact?: boolean;
}

export const CodeSnippetBox: React.FC<CodeSnippetBoxProps> = ({
  code,
  language = 'bash',
  title,
  description,
  className = '',
  id,
  prefix = '$',
  compact = false,
}) => {
  const boxId = id || `code-snippet-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div
      id={boxId}
      className={`rounded-xl border border-slate-800 bg-[#060911] shadow-xl overflow-hidden font-mono text-xs group hover:border-cyan-500/30 transition-all ${className}`}
    >
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#0a0f1c] border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
          </div>
          {title ? (
            <span className="text-[11px] font-semibold text-slate-300 ml-1 truncate">
              {title}
            </span>
          ) : (
            <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-bold uppercase tracking-wider ml-1">
              <Terminal className="w-3 h-3" />
              <span>{language}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {title && (
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 uppercase">
              {language}
            </span>
          )}
          <CopyButton
            textToCopy={code}
            id={`${boxId}-copy-btn`}
            label="Copy Code"
            size="sm"
          />
        </div>
      </div>

      {/* Optional Description */}
      {description && (
        <div className="px-3.5 py-1.5 bg-[#090d18] border-b border-slate-800/60 text-[11px] text-slate-400 font-sans">
          {description}
        </div>
      )}

      {/* Code Body */}
      <div className={`overflow-x-auto text-slate-200 ${compact ? 'p-3' : 'p-4'}`}>
        <pre className="flex leading-relaxed font-mono select-text whitespace-pre text-xs">
          {prefix && (
            <span className="select-none text-cyan-400 mr-2.5 font-bold shrink-0">
              {prefix}
            </span>
          )}
          <code className="text-slate-200 block w-full">{code}</code>
        </pre>
      </div>
    </div>
  );
};
