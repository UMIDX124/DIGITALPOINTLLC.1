'use client';

import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export function ExitIntentModal() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isAuditPage = pathname === '/free-growth-audit';

  useEffect(() => {
    if (isAuditPage) return;

    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        const shown = sessionStorage.getItem('exit-intent-shown');
        if (!shown) {
          sessionStorage.setItem('exit-intent-shown', '1');
          setOpen(true);
        }
      }
    };

    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    return () => document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
  }, [isAuditPage]);

  if (isAuditPage) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-md"
        style={{
          background: '#161618',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-white text-center">
            Before you go&hellip;
          </DialogTitle>
          <DialogDescription className="text-zinc-400 text-center text-base mt-2">
            Get a free growth audit — we&apos;ll review your setup and show you exactly what&apos;s blocking growth. No pitch, just clarity.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          <Link
            href="/free-growth-audit"
            onClick={() => setOpen(false)}
            className="w-full py-3 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 bg-violet-600 hover:brightness-110 transition-all"
          >
            Get Free Audit
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={() => setOpen(false)}
            className="w-full py-2.5 text-sm text-zinc-500 hover:text-white transition-colors text-center"
          >
            Maybe later
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
