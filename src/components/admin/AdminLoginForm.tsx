'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Loader2 } from 'lucide-react';

export function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || 'Login failed');
        return;
      }
      router.refresh();
    } catch {
      setError('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-sm rounded-2xl border border-white/10 bg-[rgba(10,6,16,0.85)] backdrop-blur-xl p-8"
    >
      <div className="flex justify-center mb-6">
        <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
          <Lock className="w-5 h-5 text-amber-400" />
        </div>
      </div>

      <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-amber-400 text-center mb-2">
        · DPL · Admin ·
      </div>
      <h1 className="font-display text-2xl font-bold text-white text-center mb-6">
        Sign in to dashboard
      </h1>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            className="w-full px-4 py-3 rounded-lg bg-white/[0.02] border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
            placeholder="admin"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full px-4 py-3 rounded-lg bg-white/[0.02] border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="px-3 py-2 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full px-4 py-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </div>
    </form>
  );
}
