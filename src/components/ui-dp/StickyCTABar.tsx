'use client';

import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function StickyCTABar() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  const isAuditPage = pathname === '/free-growth-audit';

  useEffect(() => {
    if (isAuditPage) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          setVisible(window.scrollY > 300);
          ticking = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAuditPage]);

  if (isAuditPage) return null;

  return (
    <>
      {visible && (
        <div
          className="fixed bottom-0 left-0 right-0 z-[55] md:hidden animate-in slide-in-from-bottom duration-200"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div
            className="px-4 py-3"
            style={{
              background: 'rgba(10, 10, 12, 0.95)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <Link href="/free-growth-audit" className="block">
              <div className="w-full py-3 rounded-lg text-center text-sm font-semibold text-white flex items-center justify-center gap-2 bg-violet-600">
                Get Free Audit
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
