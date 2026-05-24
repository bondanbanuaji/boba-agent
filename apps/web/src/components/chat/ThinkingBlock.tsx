'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface ThinkingBlockProps {
  children: ReactNode;
}

export function ThinkingBlock({ children }: ThinkingBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="my-2 border-l-2 border-[var(--accent)] bg-[var(--sidebar)]/40 rounded-r-lg">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
      >
        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        Proses Berpikir AI
      </button>

      {isExpanded && (
        <div className="px-3 pb-3 pt-1 text-[13px] font-mono leading-relaxed text-[var(--text-muted)] border-t-[0.5px] border-[var(--border)]/30">
          {children}
        </div>
      )}
    </div>
  );
}
