'use client';

import Link from 'next/link';
import { useLogin } from '@/hooks/useLogin';

export default function LoginPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    handleSubmit,
  } = useLogin();

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="font-chat text-2xl font-bold text-[var(--text-primary)]">Masuk ke Akun</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Kembali kelola asisten AI pribadi Anda</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            disabled={isLoading}
            className={`w-full rounded-lg border-[0.5px] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text-primary)] transition-colors focus:border-[var(--accent)] focus:outline-none ${
              error && !email ? 'border-red-500' : 'border-[var(--border)]'
            }`}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Kata Sandi
            </label>
            <Link href="/login" className="text-xs font-medium text-[var(--accent)] hover:underline">
              Lupa password?
            </Link>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={isLoading}
            className={`w-full rounded-lg border-[0.5px] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text-primary)] transition-colors focus:border-[var(--accent)] focus:outline-none ${
              error && !password ? 'border-red-500' : 'border-[var(--border)]'
            }`}
          />
        </div>

        {error && (
          <p className="text-xs font-medium text-red-500 mt-1">{error}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full justify-center py-3 mt-2"
        >
          {isLoading ? 'Masuk...' : 'Masuk'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
        Belum punya akun?{' '}
        <Link href="/register" className="font-semibold text-[var(--accent)] hover:underline">
          Daftar Gratis
        </Link>
      </p>
    </div>
  );
}
