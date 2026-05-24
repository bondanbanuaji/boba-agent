import { MARQUEE_ITEMS } from '@/lib/landing-data';

export function MarqueeTicker() {
  // Duplicate array to ensure seamless infinite scroll
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="w-full overflow-hidden border-y-[0.5px] border-[var(--border)] bg-[var(--surface)] py-4">
      <div className="marquee-track">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="accent-dot"></span>
            <span className="text-sm font-medium text-[var(--text-muted)]">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
