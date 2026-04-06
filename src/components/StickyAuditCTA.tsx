'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const HIDDEN_ROUTES = ['/free-audit', '/free-growth-audit', '/admin'];

export function StickyAuditCTA() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const hidden =
    dismissed ||
    HIDDEN_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));

  useEffect(() => {
    if (hidden) return;
    const onScroll = () => {
      setVisible(window.scrollY > 500);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [hidden]);

  if (hidden) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 right-5 z-40 hidden sm:block"
        >
          <div className="relative group">
            {/* Glow */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-300 blur-xl opacity-40 group-hover:opacity-70 transition-opacity" />

            <Link
              href="/free-audit"
              className="relative flex items-center gap-3 pl-4 pr-5 py-3.5 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold shadow-[0_10px_40px_-10px_rgba(251,191,36,0.5)] transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <div className="text-left leading-tight">
                <div className="text-[9px] uppercase tracking-wider font-mono opacity-70">
                  Free · 48h
                </div>
                <div className="text-sm font-bold">Get Free Audit</div>
              </div>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setDismissed(true);
              }}
              aria-label="Dismiss"
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-zinc-900 border border-white/20 text-zinc-500 hover:text-white text-[10px] flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}

      {/* Mobile — bottom bar */}
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-4 right-4 z-40 sm:hidden"
        >
          <Link
            href="/free-audit"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-bold shadow-[0_10px_40px_-10px_rgba(251,191,36,0.6)]"
          >
            <Sparkles className="w-4 h-4" />
            Get Free Audit
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
