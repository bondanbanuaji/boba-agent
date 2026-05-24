'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { STATS } from '@/lib/landing-data';

export function HeroSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-24 pb-20">
      <div className="mb-6">
        <span className="badge">
          <span className="accent-dot" />
          AI pribadi lo, bukan chatbot generik
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 items-end">
        <h1 className="hero-text max-w-[680px]">
          Asisten AI yang<br />
          <span className="hero-italic">ngerti konteks,</span><br />
          bukan cuma jawab.
        </h1>
        <div className="flex flex-col gap-3 min-w-[220px] pb-2">
          <Link href="/chat" className="btn-primary justify-center">
            Coba Sekarang <ArrowRight size={15} />
          </Link>
          <a href="#fitur" className="btn-ghost justify-center">
            Lihat Fitur
          </a>
        </div>
      </div>

      <div className="divider my-10 md:my-[56px]" />

      {/* Stats row */}
      <div className="flex flex-wrap gap-12">
        {STATS.map((s, i) => (
          <div key={i}>
            <div className="stat-number">{s.value}</div>
            <div className="mt-1 text-[13px] font-medium text-[var(--text-muted)]">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
