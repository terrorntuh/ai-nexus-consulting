'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

const navLinks = [
  { label: 'Services', href: '/#services' },
  { label: 'Approach', href: '/#approach' },
  { label: 'Process', href: '/#process' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Insights', href: '/insights' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<unknown>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll);

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return () => window.removeEventListener('scroll', handleScroll);
    }

    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'border-b border-ink/10 bg-paper/88 py-3 shadow-sm backdrop-blur-xl'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3 text-ink" aria-label="AI Nexus Consulting home">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-ink text-sm font-black text-white">
              NX
            </div>
            <div className="leading-none">
              <span className="block text-base font-black tracking-normal">AI Nexus</span>
              <span className="mt-1 block text-[0.68rem] font-bold uppercase tracking-[0.24em] text-ink/48">
                Consulting
              </span>
            </div>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-semibold text-ink/64 transition-colors hover:bg-ink/5 hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href={user ? '/portal' : '/portal/login'}
              className="text-sm font-bold text-ink/62 transition-colors hover:text-ink"
            >
              {user ? 'Portal' : 'Client login'}
            </Link>
            <Link
              href="/#contact"
              className="rounded-md bg-ink px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blueprint"
            >
              Start project
            </Link>
          </div>

          <button
            type="button"
            className="rounded-md p-2 text-ink md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 bg-paper/96 px-6 pt-24 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-ink/10 py-4 text-2xl font-semibold text-ink"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href={user ? '/portal' : '/portal/login'}
                onClick={() => setMobileOpen(false)}
                className="border-b border-ink/10 py-4 text-2xl font-semibold text-ink"
              >
                {user ? 'Portal' : 'Client login'}
              </Link>
              <Link
                href="/#contact"
                onClick={() => setMobileOpen(false)}
                className="mt-6 rounded-md bg-ink px-5 py-4 text-center text-base font-bold text-white"
              >
                Start a project
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
