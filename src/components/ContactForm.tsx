'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowUpRight, Calendar, CheckCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setStatus('sending');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const { id } = await res.json();
        setStatus('success');
        setForm({ name: '', email: '', company: '', message: '' });

        if (id && id !== 'local-fallback') {
          fetch('/api/leads/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
          }).catch(console.error);
        }

        setTimeout(() => setStatus('idle'), 4200);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3200);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3200);
    }
  };

  return (
    <div id="contact" className="bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">Start here</p>
          <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-none md:text-6xl">
            Bring one painful workflow. We will tell you what is worth building.
          </h2>
          <p className="mt-6 max-w-lg text-base leading-8 text-white/62">
            Send the process, the tools you use, and what is currently wasting time.
            The first conversation should feel useful even before there is a proposal.
          </p>
          <a
            href="https://calendly.com/ntuh"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-coral transition-colors hover:text-white"
          >
            <Calendar className="h-4 w-4" />
            Book directly on Calendly
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <form onSubmit={handleSubmit} className="rounded-md border border-white/12 bg-white/[0.055] p-5 md:p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              placeholder="Name *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="h-12 rounded-md border-white/12 bg-white/8 text-white placeholder:text-white/36"
              required
            />
            <Input
              type="email"
              placeholder="Email *"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="h-12 rounded-md border-white/12 bg-white/8 text-white placeholder:text-white/36"
              required
            />
          </div>
          <Input
            placeholder="Company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="mt-4 h-12 rounded-md border-white/12 bg-white/8 text-white placeholder:text-white/36"
          />
          <textarea
            placeholder="What workflow should AI help with? *"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={6}
            required
            className="mt-4 w-full resize-none rounded-md border border-white/12 bg-white/8 px-3 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/36 focus:border-coral"
          />

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              type="submit"
              disabled={status === 'sending'}
              className="h-12 rounded-md bg-coral px-6 font-bold text-ink hover:bg-white"
            >
              {status === 'sending' ? (
                'Sending...'
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send workflow
                </>
              )}
            </Button>

            <AnimatePresence>
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-sm font-semibold text-mint"
                >
                  <CheckCircle className="h-4 w-4" />
                  Message sent.
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-sm font-semibold text-red-300"
                >
                  <AlertCircle className="h-4 w-4" />
                  Something went wrong.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </div>
    </div>
  );
}
