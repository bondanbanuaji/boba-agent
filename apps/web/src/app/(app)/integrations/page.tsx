'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchIntegrationStatus, api } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import { Cpu, Send, MessageSquare, Globe, ChevronDown, ChevronUp, Check, AlertTriangle } from 'lucide-react';

interface IntegrationCardProps {
  id: 'google' | 'telegram' | 'whatsapp';
  name: string;
  desc: string;
  Icon: any;
  isConnected: boolean;
}

export default function IntegrationsPage() {
  const queryClient = useQueryClient();
  const { data: status, isLoading } = useQuery({
    queryKey: queryKeys.integrations,
    queryFn: fetchIntegrationStatus,
  });

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [inputs, setInputs] = useState<Record<string, string>>({ telegramToken: '' });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, connected }: { id: string; connected: boolean }) => {
      // Mock toggle API call
      return { id, connected: !connected };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.integrations });
    },
  });

  const integrations: IntegrationCardProps[] = [
    {
      id: 'telegram',
      name: 'Telegram Bot',
      desc: 'Kendalikan asisten AI pribadi Anda langsung lewat chat obrolan Telegram.',
      Icon: Send,
      isConnected: status?.telegram || false,
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      desc: 'Gunakan WhatsApp sebagai antarmuka chat dengan agen memori Anda.',
      Icon: MessageSquare,
      isConnected: status?.whatsapp || false,
    },
    {
      id: 'google',
      name: 'Google Workspace',
      desc: 'Beri asisten izin untuk merangkum email Gmail dan mengelola berkas Drive.',
      Icon: Globe,
      isConnected: status?.google || false,
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
        <div className="skeleton h-24 w-3/4 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-60 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto p-6 md:p-8 max-w-5xl mx-auto space-y-8 animate-fade-in pb-16">
      <header>
        <div className="flex items-center gap-2 mb-2">
          <Cpu className="text-[var(--accent)]" size={18} />
          <span className="section-label !text-[11px] tracking-widest">Konektivitas</span>
        </div>
        <h1 className="font-chat text-3xl font-bold text-[var(--text-primary)]">Integrasi Layanan</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Hubungkan asisten AI Anda ke platform eksternal untuk memperluas kemampuannya.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {integrations.map((item) => {
          const Icon = item.Icon;
          const isExpanded = expandedId === item.id;

          return (
            <div
              key={item.id}
              className="feature-card flex flex-col justify-between hover:border-[var(--accent)]/55"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="icon-wrap">
                    <Icon size={20} className="text-[var(--accent)]" />
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold border-[0.5px] ${
                      item.isConnected
                        ? 'text-green-600 bg-green-500/10 border-green-500/30'
                        : 'text-[var(--text-muted)] bg-[var(--sidebar)] border-[var(--border)]'
                    }`}
                  >
                    {item.isConnected ? 'Terhubung' : 'Terputus'}
                  </span>
                </div>

                <h2 className="font-chat text-lg font-bold text-[var(--text-primary)] mb-2">
                  {item.name}
                </h2>
                <p className="text-xs leading-relaxed text-[var(--text-muted)] mb-5">
                  {item.desc}
                </p>
              </div>

              <div className="space-y-3">
                {isExpanded && item.id === 'telegram' && (
                  <div className="rounded-lg border-[0.5px] border-[var(--border)] bg-[var(--bg)] p-3">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                      Bot Token Telegram
                    </label>
                    <input
                      type="password"
                      placeholder="Masukkan token bot Anda"
                      value={inputs.telegramToken}
                      onChange={(e) => setInputs({ ...inputs, telegramToken: e.target.value })}
                      className="w-full rounded border-[0.5px] border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-xs text-[var(--text-primary)] focus:outline-none"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      toggleMutation.mutate({ id: item.id, connected: item.isConnected })
                    }
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all border-[0.5px] ${
                      item.isConnected
                        ? 'bg-[var(--sidebar)] text-[var(--text-primary)] border-[var(--border)] hover:bg-[var(--hover-surface)]'
                        : 'bg-[var(--accent)] text-[var(--accent-text)] border-transparent hover:opacity-90'
                    }`}
                  >
                    {item.isConnected ? 'Putuskan' : 'Hubungkan'}
                  </button>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="p-2 border-[0.5px] border-[var(--border)] rounded-lg text-[var(--text-muted)] hover:bg-[var(--hover-surface)]"
                  >
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
