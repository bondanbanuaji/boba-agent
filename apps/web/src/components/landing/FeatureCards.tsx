import { FEATURES } from '@/lib/landing-data';

export function FeatureCards() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-12 text-center">
        <h2 className="section-label mb-4">Fitur Utama</h2>
        <p className="font-chat text-3xl font-bold text-[var(--text-primary)]">Didesain buat produktivitas.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {FEATURES.map((feature, i) => {
          const Icon = feature.Icon;
          return (
            <div key={i} className="feature-card">
              <div className="icon-wrap mb-6">
                <Icon size={20} color="var(--accent)" />
              </div>
              <h3 className="font-chat mb-3 text-xl font-bold text-[var(--text-primary)]">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
