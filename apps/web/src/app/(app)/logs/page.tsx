'use client';

import { useState } from 'react';
import { Terminal, Calendar, SlidersHorizontal, ChevronRight, ChevronDown } from 'lucide-react';

interface LogItem {
  id: string;
  time: string;
  service: string;
  action: string;
  status: 'sukses' | 'gagal';
  payload: string;
}

const SAMPLE_LOGS: LogItem[] = [
  { id: '1', time: '10 menit yang lalu', service: 'Gmail', action: 'send_email', status: 'sukses', payload: '{\n  "recipient": "klien@email.com",\n  "subject": "Revisi Desain v2",\n  "body": "Berikut lampiran berkas terbaru..."\n}' },
  { id: '2', time: '1 jam yang lalu', service: 'Google Drive', action: 'search_files', status: 'sukses', payload: '{\n  "query": "Laporan Keuangan Q1",\n  "maxResults": 10\n}' },
  { id: '3', time: '3 jam yang lalu', service: 'Telegram', action: 'send_message', status: 'sukses', payload: '{\n  "chatId": "987654321",\n  "text": "Selamat siang, revisi sudah saya kirim ke email."\n}' },
  { id: '4', time: '5 jam yang lalu', service: 'WhatsApp', action: 'sync_contacts', status: 'gagal', payload: '{\n  "error": "Connection timeout",\n  "code": 504\n}' }
];

export default function LogsPage() {
  const [selectedService, setSelectedService] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState('Semua');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredLogs = SAMPLE_LOGS.filter((log) => {
    const serviceMatch = selectedService === 'Semua' || log.service === selectedService;
    const statusMatch = selectedStatus === 'Semua' || log.status === selectedStatus;
    return serviceMatch && statusMatch;
  });

  return (
    <div className="h-full w-full overflow-y-auto p-6 md:p-8 max-w-5xl mx-auto space-y-8 animate-fade-in pb-16">
      <header>
        <div className="flex items-center gap-2 mb-2">
          <Terminal className="text-[var(--accent)]" size={18} />
          <span className="section-label !text-[11px] tracking-widest">Audit Trail</span>
        </div>
        <h1 className="font-chat text-3xl font-bold text-[var(--text-primary)]">Log Aktivitas</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Pantau seluruh eksekusi dan tindakan otomatis yang dijalankan asisten AI.
        </p>
      </header>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border-[0.5px] border-[var(--border)] bg-[var(--surface)] p-3">
        <SlidersHorizontal size={14} className="text-[var(--text-muted)] ml-1" />
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="rounded border-[0.5px] border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-xs text-[var(--text-primary)] focus:outline-none"
        >
          <option value="Semua">Semua Layanan</option>
          <option value="Gmail">Gmail</option>
          <option value="Google Drive">Google Drive</option>
          <option value="Telegram">Telegram</option>
          <option value="WhatsApp">WhatsApp</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="rounded border-[0.5px] border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-xs text-[var(--text-primary)] focus:outline-none"
        >
          <option value="Semua">Semua Status</option>
          <option value="sukses">Sukses</option>
          <option value="gagal">Gagal</option>
        </select>
      </div>

      {/* Logs List */}
      <div className="rounded-xl border-[0.5px] border-[var(--border)] bg-[var(--surface)] overflow-hidden divide-y-[0.5px] divide-[var(--border)]">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-[var(--text-muted)] italic">
            Tidak ada log yang cocok dengan filter Anda.
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isExpanded = expandedId === log.id;
            return (
              <div key={log.id} className="transition-colors hover:bg-[var(--hover-surface)]/20">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : log.id)}
                  className="flex w-full items-center justify-between p-4 text-left"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <Calendar size={14} className="text-[var(--text-muted)] shrink-0" />
                    <span className="text-xs text-[var(--text-muted)] w-28 shrink-0">{log.time}</span>
                    <span className="rounded bg-[var(--sidebar)] border-[0.5px] border-[var(--border)] px-2 py-0.5 text-[10px] font-bold text-[var(--text-primary)]">
                      {log.service}
                    </span>
                    <span className="text-xs font-mono text-[var(--text-primary)] truncate font-semibold">
                      {log.action}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        log.status === 'sukses' ? 'text-green-600' : 'text-red-500'
                      }`}
                    >
                      {log.status}
                    </span>
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t-[0.5px] border-[var(--border)] p-4 bg-[var(--sidebar)]/30">
                    <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Detail Parameter</div>
                    <pre className="text-xs font-mono leading-relaxed text-[var(--text-primary)] overflow-x-auto bg-[var(--surface)] p-3 rounded-lg border-[0.5px] border-[var(--border)] max-h-48">
                      {log.payload}
                    </pre>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <button className="btn-ghost !px-3 !py-1.5 !text-xs" disabled>
          Sebelumnya
        </button>
        <span className="text-xs text-[var(--text-muted)]">Halaman 1 dari 1</span>
        <button className="btn-ghost !px-3 !py-1.5 !text-xs" disabled>
          Selanjutnya
        </button>
      </div>
    </div>
  );
}
