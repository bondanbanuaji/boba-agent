'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, PlayCircle, CheckCircle, AlertCircle } from 'lucide-react';

interface ToolCallCardProps {
  name: string;
  args: Record<string, any>;
  status: 'running' | 'success' | 'failed';
  result?: string;
}

export function ToolCallCard({ name, args, status, result }: ToolCallCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusDetails = () => {
    switch (status) {
      case 'running':
        return { label: 'Menjalankan...', color: 'text-amber-600 bg-amber-500/10 border-amber-500/30', Icon: PlayCircle };
      case 'success':
        return { label: 'Selesai', color: 'text-green-600 bg-green-500/10 border-green-500/30', Icon: CheckCircle };
      default:
        return { label: 'Gagal', color: 'text-red-600 bg-red-500/10 border-red-500/30', Icon: AlertCircle };
    }
  };

  const { label, color, Icon } = getStatusDetails();

  return (
    <div className="my-2 rounded-xl border-[0.5px] border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-4 py-3 hover:bg-[var(--hover-surface)] transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon size={16} className={status === 'running' ? 'animate-pulse' : ''} />
          <span className="text-xs font-semibold font-mono text-[var(--text-primary)]">
            {name}()
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full border-[0.5px] px-2 py-0.5 text-[10px] font-bold ${color}`}>
            {label}
          </span>
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t-[0.5px] border-[var(--border)] p-3 bg-[var(--sidebar)]/30 space-y-2">
          <div>
            <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Argumen</div>
            <pre className="text-xs font-mono text-[var(--text-primary)] overflow-x-auto bg-[var(--surface)] p-2 rounded-lg border-[0.5px] border-[var(--border)]">
              {JSON.stringify(args, null, 2)}
            </pre>
          </div>
          {result && (
            <div>
              <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Hasil</div>
              <pre className="text-xs font-mono text-[var(--text-muted)] overflow-x-auto bg-[var(--surface)] p-2 rounded-lg border-[0.5px] border-[var(--border)]">
                {result}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
