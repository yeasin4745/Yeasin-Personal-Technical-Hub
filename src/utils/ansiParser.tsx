import React from 'react';

export interface AnsiStyleState {
  fgColor: string | null;
  bgColor: string | null;
  bold: boolean;
  dim: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
}

const DEFAULT_STYLE_STATE: AnsiStyleState = {
  fgColor: null,
  bgColor: null,
  bold: false,
  dim: false,
  italic: false,
  underline: false,
  strikethrough: false,
};

// ANSI 8/16 Color mapping to Tailwind/Hex classes
const FG_COLORS: Record<number, { standard: string; classicGreen: string }> = {
  30: { standard: 'text-slate-800', classicGreen: 'text-emerald-950' }, // Black
  31: { standard: 'text-rose-400 font-semibold', classicGreen: 'text-rose-400 font-semibold' }, // Red (Errors)
  32: { standard: 'text-emerald-400 font-semibold', classicGreen: 'text-emerald-300 font-semibold' }, // Green (Success)
  33: { standard: 'text-amber-400 font-semibold', classicGreen: 'text-amber-300 font-semibold' }, // Yellow (System/Warnings)
  34: { standard: 'text-sky-400', classicGreen: 'text-emerald-200' }, // Blue
  35: { standard: 'text-fuchsia-400', classicGreen: 'text-emerald-300' }, // Magenta
  36: { standard: 'text-cyan-400', classicGreen: 'text-emerald-300' }, // Cyan
  37: { standard: 'text-slate-200', classicGreen: 'text-emerald-100' }, // White
  90: { standard: 'text-slate-500', classicGreen: 'text-emerald-700' }, // Bright Black / Gray
  91: { standard: 'text-red-400 font-bold', classicGreen: 'text-red-400 font-bold' }, // Bright Red (Fatal Error)
  92: { standard: 'text-emerald-300 font-bold', classicGreen: 'text-emerald-200 font-bold' }, // Bright Green (Success Highlight)
  93: { standard: 'text-yellow-300 font-bold', classicGreen: 'text-yellow-200 font-bold' }, // Bright Yellow (System Notice)
  94: { standard: 'text-blue-400', classicGreen: 'text-emerald-200' }, // Bright Blue
  95: { standard: 'text-pink-400', classicGreen: 'text-emerald-200' }, // Bright Magenta
  96: { standard: 'text-cyan-300', classicGreen: 'text-emerald-300' }, // Bright Cyan
  97: { standard: 'text-white font-bold', classicGreen: 'text-emerald-50 font-bold' }, // Bright White
};

const BG_COLORS: Record<number, string> = {
  40: 'bg-black/80 px-1 rounded-xs',
  41: 'bg-rose-950/80 text-rose-200 border border-rose-800/60 px-1 rounded-xs', // Red BG (Error badge)
  42: 'bg-emerald-950/80 text-emerald-200 border border-emerald-800/60 px-1 rounded-xs', // Green BG (Success badge)
  43: 'bg-amber-950/80 text-amber-200 border border-amber-800/60 px-1 rounded-xs', // Yellow BG (System badge)
  44: 'bg-sky-950/80 text-sky-200 border border-sky-800/60 px-1 rounded-xs',
  45: 'bg-purple-950/80 text-purple-200 border border-purple-800/60 px-1 rounded-xs',
  46: 'bg-cyan-950/80 text-cyan-200 border border-cyan-800/60 px-1 rounded-xs',
  47: 'bg-slate-200 text-slate-950 px-1 rounded-xs',
  100: 'bg-slate-800 px-1 rounded-xs',
  101: 'bg-red-900/90 text-white px-1 rounded-xs font-bold',
  102: 'bg-emerald-900/90 text-white px-1 rounded-xs font-bold',
  103: 'bg-yellow-900/90 text-white px-1 rounded-xs font-bold',
  104: 'bg-blue-900/90 text-white px-1 rounded-xs',
  105: 'bg-fuchsia-900/90 text-white px-1 rounded-xs',
  106: 'bg-cyan-900/90 text-white px-1 rounded-xs',
  107: 'bg-white text-black px-1 rounded-xs font-bold',
};

// Standard ANSI helper strings
export const ANSI = {
  // Reset
  reset: '\u001b[0m',
  bold: '\u001b[1m',
  dim: '\u001b[2m',
  italic: '\u001b[3m',
  underline: '\u001b[4m',

  // Foreground Colors
  red: (txt: string) => `\u001b[31m${txt}\u001b[0m`,
  green: (txt: string) => `\u001b[32m${txt}\u001b[0m`,
  yellow: (txt: string) => `\u001b[33m${txt}\u001b[0m`,
  blue: (txt: string) => `\u001b[34m${txt}\u001b[0m`,
  magenta: (txt: string) => `\u001b[35m${txt}\u001b[0m`,
  cyan: (txt: string) => `\u001b[36m${txt}\u001b[0m`,
  white: (txt: string) => `\u001b[37m${txt}\u001b[0m`,
  gray: (txt: string) => `\u001b[90m${txt}\u001b[0m`,

  // Bright Foreground
  brightRed: (txt: string) => `\u001b[91m${txt}\u001b[0m`,
  brightGreen: (txt: string) => `\u001b[92m${txt}\u001b[0m`,
  brightYellow: (txt: string) => `\u001b[93m${txt}\u001b[0m`,
  brightCyan: (txt: string) => `\u001b[96m${txt}\u001b[0m`,

  // Common Semantic Badges
  SUCCESS: (msg: string) => `\u001b[1;32m[SUCCESS]\u001b[0m \u001b[32m${msg}\u001b[0m`,
  OK: (msg: string) => `\u001b[1;32m✓\u001b[0m \u001b[32m${msg}\u001b[0m`,
  ERROR: (msg: string) => `\u001b[1;31m[ERROR]\u001b[0m \u001b[31m${msg}\u001b[0m`,
  ERR: (msg: string) => `\u001b[1;31m✗\u001b[0m \u001b[31m${msg}\u001b[0m`,
  SYS: (msg: string) => `\u001b[1;33m[SYS]\u001b[0m \u001b[33m${msg}\u001b[0m`,
  WARN: (msg: string) => `\u001b[1;33m[WARN]\u001b[0m \u001b[33m${msg}\u001b[0m`,
  INFO: (msg: string) => `\u001b[1;36m[INFO]\u001b[0m \u001b[36m${msg}\u001b[0m`,
};

/**
 * Normalizes literal escape sequences (e.g. users typing '\x1b[32m' or '\033[31m' in shell strings)
 * into real ANSI escape characters (\u001b).
 */
export function normalizeAnsiEscapes(text: string): string {
  if (!text) return '';
  return text
    .replace(/\\x1b\[/gi, '\u001b[')
    .replace(/\\033\[/g, '\u001b[')
    .replace(/\\e\[/gi, '\u001b[')
    .replace(/\\u001b\[/gi, '\u001b[');
}

/**
 * Parses raw text containing ANSI escape sequences into an array of React spans with Tailwind classes.
 */
export function parseAnsiToReact(
  rawText: string,
  options?: { isClassicGreen?: boolean; className?: string }
): React.ReactNode {
  if (!rawText) return null;

  const isClassicGreen = options?.isClassicGreen ?? false;
  const text = normalizeAnsiEscapes(rawText);

  // Regex matching ANSI escape sequences e.g. \u001b[31;1m or \u001b[0m
  const ansiRegex = /\u001b\[([0-9;]*)m/g;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let currentStyle: AnsiStyleState = { ...DEFAULT_STYLE_STATE };
  let match: RegExpExecArray | null;

  while ((match = ansiRegex.exec(text)) !== null) {
    const textChunk = text.slice(lastIndex, match.index);
    if (textChunk) {
      elements.push(
        renderStyledSpan(
          textChunk,
          currentStyle,
          isClassicGreen,
          `ansi-${elements.length}-${match.index}`
        )
      );
    }

    // Process SGR codes in match[1] (e.g. "31;1" or "" or "0")
    const codeString = match[1] || '0';
    const codes = codeString.split(';').map((c) => parseInt(c, 10) || 0);

    for (const code of codes) {
      if (code === 0) {
        currentStyle = { ...DEFAULT_STYLE_STATE };
      } else if (code === 1) {
        currentStyle.bold = true;
      } else if (code === 2) {
        currentStyle.dim = true;
      } else if (code === 3) {
        currentStyle.italic = true;
      } else if (code === 4) {
        currentStyle.underline = true;
      } else if (code === 9) {
        currentStyle.strikethrough = true;
      } else if (code === 22) {
        currentStyle.bold = false;
        currentStyle.dim = false;
      } else if (code === 23) {
        currentStyle.italic = false;
      } else if (code === 24) {
        currentStyle.underline = false;
      } else if (code === 29) {
        currentStyle.strikethrough = false;
      } else if (code === 39) {
        currentStyle.fgColor = null;
      } else if (code === 49) {
        currentStyle.bgColor = null;
      } else if (FG_COLORS[code]) {
        currentStyle.fgColor = isClassicGreen
          ? FG_COLORS[code].classicGreen
          : FG_COLORS[code].standard;
      } else if (BG_COLORS[code]) {
        currentStyle.bgColor = BG_COLORS[code];
      }
    }

    lastIndex = ansiRegex.lastIndex;
  }

  // Trailing text after last ANSI code
  if (lastIndex < text.length) {
    const trailing = text.slice(lastIndex);
    elements.push(
      renderStyledSpan(
        trailing,
        currentStyle,
        isClassicGreen,
        `ansi-${elements.length}-end`
      )
    );
  }

  return (
    <span className={`inline-block font-mono leading-relaxed whitespace-pre-wrap ${options?.className || ''}`}>
      {elements}
    </span>
  );
}

function renderStyledSpan(
  text: string,
  style: AnsiStyleState,
  isClassicGreen: boolean,
  key: string
): React.ReactNode {
  const classes: string[] = [];

  if (style.fgColor) {
    classes.push(style.fgColor);
  } else {
    classes.push(isClassicGreen ? 'text-emerald-200' : 'text-slate-200');
  }

  if (style.bgColor) classes.push(style.bgColor);
  if (style.bold) classes.push('font-bold');
  if (style.dim) classes.push('opacity-60');
  if (style.italic) classes.push('italic');
  if (style.underline) classes.push('underline underline-offset-2');
  if (style.strikethrough) classes.push('line-through');

  return (
    <span key={key} className={classes.join(' ')}>
      {text}
    </span>
  );
}

/**
 * React Component to render any ANSI formatted string directly.
 */
export const AnsiText: React.FC<{
  text: string;
  isClassicGreen?: boolean;
  className?: string;
}> = ({ text, isClassicGreen = false, className = '' }) => {
  return <>{parseAnsiToReact(text, { isClassicGreen, className })}</>;
};

export default parseAnsiToReact;
