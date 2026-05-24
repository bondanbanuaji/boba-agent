'use client';

import { useContextPanel } from './ContextPanelProvider';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

export function ContextPanel() {
  const { content, isOpen, setIsOpen } = useContextPanel();

  if (!content) return null;

  return (
    <aside
      className={`fixed bottom-0 right-0 top-0 z-40 hidden border-l-[0.5px] border-[var(--border)] bg-[var(--sidebar)] transition-all duration-300 md:flex flex-col ${
        isOpen ? 'w-[280px]' : 'w-0 border-l-0 overflow-hidden'
      }`}
    >
      <div className="flex h-14 items-center justify-between px-4 border-b-[0.5px] border-[var(--border)]">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Konteks
        </span>
        <button
          onClick={() => setIsOpen(false)}
          className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          title="Tutup Panel"
        >
          <X size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 text-sm text-[var(--text-primary)]">
        {content}
      </div>
    </aside>
  );
}
