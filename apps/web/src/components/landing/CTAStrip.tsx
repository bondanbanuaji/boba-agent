'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CTAStrip() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="cta-strip">
        <div>
          <h2 className="mb-2 font-chat text-2xl md:text-3xl font-bold leading-snug text-[var(--bg)]">
            Siap ganti cara kerja kamu?
          </h2>
          <p className="text-sm text-[#8A8070] leading-relaxed">
            Setup 5 menit. Tidak perlu kartu kredit.
          </p>
        </div>
        <Link href="/register" className="btn-primary">
          Mulai Gratis <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}
