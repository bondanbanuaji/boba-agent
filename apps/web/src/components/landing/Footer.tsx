import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t-[0.5px] border-[var(--border)] bg-[var(--bg)] py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="font-chat flex h-6 w-6 items-center justify-center rounded bg-[var(--accent)] text-xs font-bold text-[var(--accent-text)]">
            B
          </div>
          <span className="font-chat text-sm font-bold text-[var(--text-primary)]">BobaAgent</span>
        </div>
        
        <p className="text-sm text-[var(--text-muted)]">
          &copy; {new Date().getFullYear()} BobaAgent. Hak cipta dilindungi.
        </p>
        
        <div className="flex gap-4">
          <Link href="/terms" className="nav-link text-xs">Ketentuan</Link>
          <Link href="/privacy" className="nav-link text-xs">Privasi</Link>
        </div>
      </div>
    </footer>
  );
}
