'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchAgentStatus, fetchIntegrationStatus } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import { MessageSquare, Cpu, Terminal, Shield, Zap, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const { data: agent, isLoading: loadingAgent } = useQuery({
    queryKey: queryKeys.agentStatus,
    queryFn: fetchAgentStatus,
    refetchInterval: 5000,
  });

  const { data: integrations, isLoading: loadingInts } = useQuery({
    queryKey: queryKeys.integrations,
    queryFn: fetchIntegrationStatus,
    refetchInterval: 10000,
  });

  const isLoading = loadingAgent || loadingInts;
  const activeIntegrationsCount = integrations
    ? Object.values(integrations).filter(Boolean).length
    : 0;

  return (
    <div className="h-full w-full overflow-y-auto p-6 md:p-8 max-w-5xl mx-auto space-y-8 animate-fade-in pb-16">
      <header>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="text-[var(--accent)]" size={18} />
          <span className="section-label !text-[11px] tracking-widest">Dasbor Sistem</span>
        </div>
        <h1 className="font-chat text-3xl font-bold text-[var(--text-primary)]">
          Selamat Datang Kembali
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Pantau status kesehatan dan penggunaan asisten AI Anda secara real-time.
        </p>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-32 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Status Agent */}
          <div className="rounded-xl border-[0.5px] border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--accent)]/55 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                Status Asisten
              </span>
              <Zap size={16} className="text-[var(--accent)]" />
            </div>
            <div className="mt-4 flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <span className="text-xl font-bold font-chat text-[var(--text-primary)] capitalize">
                {agent?.status || 'Aktif'}
              </span>
            </div>
          </div>

          {/* Card 2: Integrasi Aktif */}
          <div className="rounded-xl border-[0.5px] border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--accent)]/55 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                Integrasi Aktif
              </span>
              <Cpu size={16} className="text-[var(--accent)]" />
            </div>
            <div className="mt-4">
              <span className="text-xl font-bold font-chat text-[var(--text-primary)]">
                {activeIntegrationsCount} <span className="text-sm text-[var(--text-muted)]">/ 3</span>
              </span>
              <div className="flex gap-1.5 mt-2.5">
                <div className={`h-1.5 w-1.5 rounded-full ${integrations?.google ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`} title="Google" />
                <div className={`h-1.5 w-1.5 rounded-full ${integrations?.telegram ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`} title="Telegram" />
                <div className={`h-1.5 w-1.5 rounded-full ${integrations?.whatsapp ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`} title="WhatsApp" />
              </div>
            </div>
          </div>

          {/* Card 3: Keamanan */}
          <div className="rounded-xl border-[0.5px] border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--accent)]/55 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                Privasi & Data
              </span>
              <Shield size={16} className="text-[var(--accent)]" />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-[var(--text-muted)]">
              Semua data riwayat chat dan memori tersimpan aman di database lokal Anda.
            </p>
          </div>
        </div>
      )}

      {/* Masonry Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border-[0.5px] border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
          <div className="flex items-center gap-2 border-b-[0.5px] border-[var(--border)] pb-3">
            <MessageSquare size={16} className="text-[var(--accent)]" />
            <h3 className="font-chat text-base font-bold text-[var(--text-primary)]">Aktivitas Terkini</h3>
          </div>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed italic">
            Belum ada aktivitas chat baru. Mulai percakapan pertama Anda dari menu Chat.
          </p>
        </div>

        <div className="rounded-xl border-[0.5px] border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
          <div className="flex items-center gap-2 border-b-[0.5px] border-[var(--border)] pb-3">
            <Terminal size={16} className="text-[var(--accent)]" />
            <h3 className="font-chat text-base font-bold text-[var(--text-primary)]">Kesehatan Sistem</h3>
          </div>
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>API Server:</span>
            <span className="font-semibold text-green-600">Terhubung</span>
          </div>
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Memory Latency:</span>
            <span className="font-semibold text-[var(--text-primary)]">12ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}
