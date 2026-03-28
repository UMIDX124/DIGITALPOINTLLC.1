'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Performance Marketing', href: '/performance-marketing' },
  { name: 'Remote Workforce', href: '/remote-workforce' },
  { name: 'Systems & Reporting', href: '/systems-reporting' },
  { name: 'Case Studies', href: '/case-studies' },
  { name: 'Results', href: '/results' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

const NavLink = memo(function NavLink({ item, active }: { item: { name: string; href: string }; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        'relative px-3 py-1.5 text-[13px] font-medium transition-colors duration-200 rounded-md whitespace-nowrap',
        active
          ? 'text-white'
          : 'text-zinc-500 hover:text-zinc-300'
      )}
    >
      {active && (
        <span
          className="absolute inset-0 rounded-md"
          style={{ background: 'rgba(139, 92, 246, 0.15)' }}
        />
      )}
      <span className="relative z-10">{item.name}</span>
    </Link>
  );
});

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActive = useCallback((href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }, [pathname]);

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-[100]">
      <div
        className={cn(
          'relative w-full transition-all duration-300',
          scrolled ? 'shadow-lg shadow-black/20' : ''
        )}
        style={{
          background: scrolled
            ? 'rgba(13, 8, 21, 0.9)'
            : 'rgba(13, 8, 21, 0.6)',
          backdropFilter: 'blur(20px) saturate(150%)',
          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          borderBottom: '1px solid rgba(139, 92, 246, 0.08)',
        }}
      >
        <nav className="relative px-5 sm:px-6 md:pl-[12%] md:pr-8 lg:pl-[14%]">
          <div className="flex items-center justify-between gap-6 h-14 md:h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group relative z-10 shrink-0"
            >
              <div className="relative" style={{ marginTop: '-24px', marginBottom: '-22px' }}>
                <Image
                  src="/Dp-logo1.png"
                  alt="Digital Point LLC"
                  width={56}
                  height={56}
                  priority
                  className="relative z-10 transition-transform duration-200 group-hover:scale-105"
                  style={{
                    width: '48px',
                    height: 'auto',
                    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5)) drop-shadow(0 1px 6px rgba(139,92,246,0.2))',
                  }}
                />
              </div>
              <div className="hidden sm:block">
                <span className="font-display font-semibold text-base tracking-tight text-white/90">
                  Digital Point
                </span>
                <span className="text-zinc-600 text-xs block -mt-0.5">LLC</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center justify-center flex-1 relative z-10">
              <div
                className="flex items-center p-1 rounded-lg"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                {navigation.map((item) => (
                  <NavLink key={item.name} item={item} active={isActive(item.href)} />
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="hidden xl:block relative z-10 ml-2">
              <Link href="/free-growth-audit">
                <span
                  className="px-5 py-2.5 text-sm font-semibold text-white rounded-lg inline-block transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
                    boxShadow: '0 2px 12px rgba(124, 58, 237, 0.25)',
                  }}
                >
                  Free Growth Audit
                </span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="xl:hidden min-w-[44px] min-h-[44px] p-2.5 rounded-lg text-zinc-500 hover:text-white transition-colors relative z-10 active:scale-95 flex items-center justify-center bg-white/[0.04] border border-white/[0.06]"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <div
            id="mobile-menu"
            className="xl:hidden absolute top-full left-4 right-4 mt-2 mx-auto max-w-7xl rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
            style={{
              background: 'rgba(17, 17, 19, 0.97)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
          >
            <div className="relative p-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'block w-full text-left px-4 py-3 min-h-[44px] rounded-lg text-sm font-medium transition-colors duration-200',
                    isActive(item.href)
                      ? 'text-white bg-white/[0.06]'
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]'
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-3">
                <Link
                  href="/free-growth-audit"
                  className="block w-full py-3 rounded-lg text-sm font-semibold text-white text-center bg-violet-600 hover:brightness-110 transition-all"
                >
                  Free Growth Audit
                </Link>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
