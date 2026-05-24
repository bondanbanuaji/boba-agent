'use client';

import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { Copy, Check, RotateCcw, Edit, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState } from 'react';

interface MessageActionsProps {
  content: string;
  onRegenerate?: () => void;
  onEdit?: () => void;
}

export function MessageActions({ content, onRegenerate, onEdit }: MessageActionsProps) {
  const { copied, copy } = useCopyToClipboard();
  const [liked, setLiked] = useState<boolean | null>(null);

  return (
    <div className="flex items-center gap-1.5 rounded-lg border-[0.5px] border-[var(--border)] bg-[var(--surface)] p-1 shadow-sm">
      <button
        onClick={() => copy(content)}
        className="rounded p-1 text-[var(--text-muted)] hover:bg-[var(--hover-surface)] hover:text-[var(--text-primary)] transition-colors"
        title="Salin Pesan"
      >
        {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
      </button>

      {onEdit && (
        <button
          onClick={onEdit}
          className="rounded p-1 text-[var(--text-muted)] hover:bg-[var(--hover-surface)] hover:text-[var(--text-primary)] transition-colors"
          title="Ubah"
        >
          <Edit size={14} />
        </button>
      )}

      {onRegenerate && (
        <button
          onClick={onRegenerate}
          className="rounded p-1 text-[var(--text-muted)] hover:bg-[var(--hover-surface)] hover:text-[var(--text-primary)] transition-colors"
          title="Regenerasi Respons"
        >
          <RotateCcw size={14} />
        </button>
      )}

      <div className="h-3 w-[0.5px] bg-[var(--border)] mx-0.5" />

      <button
        onClick={() => setLiked(liked === true ? null : true)}
        className={`rounded p-1 transition-colors ${
          liked === true ? 'text-green-600 bg-green-500/10' : 'text-[var(--text-muted)] hover:bg-[var(--hover-surface)]'
        }`}
        title="Bagus"
      >
        <ThumbsUp size={14} />
      </button>

      <button
        onClick={() => setLiked(liked === false ? null : false)}
        className={`rounded p-1 transition-colors ${
          liked === false ? 'text-red-500 bg-red-500/10' : 'text-[var(--text-muted)] hover:bg-[var(--hover-surface)]'
        }`}
        title="Kurang Bagus"
      >
        <ThumbsDown size={14} />
      </button>
    </div>
  );
}
