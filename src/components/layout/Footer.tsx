import { Linkedin, Mail, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const footerLinks = {
  services: [
    { name: 'Performance Marketing', href: '/performance-marketing' },
    { name: 'Remote Workforce', href: '/remote-workforce' },
    { name: 'Systems & Reporting', href: '/systems-reporting' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Results', href: '/results' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
    { name: 'Free Growth Audit', href: '/free-growth-audit' },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative mt-auto bg-background"
      style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <div className="container-wide relative z-10">
        {/* Main Footer Content */}
        <div className="py-16 md:py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <Image
                  src="/Dp-logo1.png"
                  alt="Digital Point LLC"
                  width={40}
                  height={40}
                  style={{
                    width: '40px',
                    height: 'auto',
                    filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))',
                  }}
                />
              </div>
              <div>
                <span className="font-display font-semibold text-lg text-white">
                  Digital Point
                </span>
                <span className="text-zinc-600 text-xs block -mt-1">LLC</span>
              </div>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
              Built by two guys who got tired of watching good businesses waste money on bad data. We treat every client&apos;s budget like it&apos;s our own — because we remember when it was.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <span className="inline-flex items-center px-3 py-1 rounded-md text-xs bg-white/[0.04] border border-white/[0.06] text-zinc-400">
                8+ Years in Market
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-md text-xs bg-white/[0.04] border border-white/[0.06] text-zinc-400">
                Global Delivery
              </span>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all text-zinc-500" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all text-zinc-500" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">
              Connect
            </h4>
            <div className="space-y-4">
              <a
                href="mailto:info@digitalpointllc.com"
                className="flex items-center gap-3 text-zinc-500 hover:text-zinc-300 text-sm transition-colors group"
              >
                <Mail className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                info@digitalpointllc.com
              </a>
              <a
                href="https://linkedin.com/company/digitalpointllc"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-zinc-500 hover:text-zinc-300 text-sm transition-colors group"
              >
                <Linkedin className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Personal mission */}
        <div
          className="py-6 text-center"
          style={{ borderTop: '1px solid rgba(255, 255, 255, 0.04)' }}
        >
          <p className="text-zinc-600 text-sm italic max-w-xl mx-auto">
            &ldquo;Every dollar you spend on marketing should be accountable. If we can&apos;t prove it&apos;s working, we&apos;ll be the first to tell you.&rdquo;
            <span className="not-italic text-zinc-500 ml-1">&mdash; Faizan &amp; Anwaar</span>
          </p>
        </div>

        {/* Bottom Bar */}
        <div
          className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255, 255, 255, 0.04)' }}
        >
          <div className="flex items-center gap-4">
            <p className="text-zinc-700 text-xs">
              &copy; {currentYear} Digital Point LLC. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-6 gap-y-2">
            <Link href="/" className="text-zinc-700 text-xs hover:text-zinc-500 transition-colors">
              Home
            </Link>
            <Link href="/privacy-policy" className="text-zinc-700 text-xs hover:text-zinc-500 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-zinc-700 text-xs hover:text-zinc-500 transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-zinc-700 text-xs hover:text-zinc-500 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
