import Link from 'next/link';

export function NavBar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b-[0.5px] border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-medium text-[var(--text-primary)]" aria-label="Beranda">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-[var(--accent)] text-[var(--accent-text)] font-chat font-bold">
            B
          </div>
          <span className="text-lg font-chat font-bold">BobaAgent</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/login" className="nav-link">
            Masuk
          </Link>
          <Link href="/register" className="btn-primary">
            Mulai Gratis
          </Link>
        </div>
      </div>
    </nav>
  );
}
