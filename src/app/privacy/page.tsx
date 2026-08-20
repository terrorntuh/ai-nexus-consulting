import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Privacy notice | AI Nexus Consulting',
  description:
    'How AI Nexus Consulting collects and handles enquiries, usage data, and personal information under POPIA.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy notice | AI Nexus Consulting',
    url: 'https://www.ainexusconsulting.co.za/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-32">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">Legal</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl">Privacy notice</h1>
        <p className="mt-6 text-lg leading-8 text-ink/64">
          AI Nexus Consulting is a Johannesburg-based studio. This page explains what we collect
          when you use www.ainexusconsulting.co.za, and how a human reviews it.
        </p>

        <section className="mt-12 space-y-8 text-base leading-8 text-ink/72">
          <div>
            <h2 className="text-2xl font-semibold text-ink">Who we are</h2>
            <p className="mt-3">
              AI Nexus Consulting operates this site. Enquiries go to{' '}
              <a className="font-semibold text-blueprint underline-offset-4 hover:underline" href="mailto:sales@ainexusconsulting.co.za">
                sales@ainexusconsulting.co.za
              </a>
              . We are based in Johannesburg, South Africa.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-ink">What we collect</h2>
            <p className="mt-3">
              If you send the contact form, we collect your name, email, optional phone number,
              optional company name, the package you selected if any, and the message you wrote.
              We also keep basic site usage logs (pages, timestamps, technical diagnostics) so the
              site stays reliable.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-ink">Why we collect it</h2>
            <p className="mt-3">
              We use enquiry details to reply to you, qualify the request, and keep a record of
              the conversation. We do not sell personal information. A human reviews every enquiry
              before any client-facing reply is sent.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-ink">How long we keep it</h2>
            <p className="mt-3">
              We keep enquiry records for as long as they are needed to handle the request and
              run the business, then delete or archive them when they are no longer required.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-ink">Your rights</h2>
            <p className="mt-3">
              You can ask what we hold about you, ask us to correct it, or ask us to delete it,
              by emailing sales@ainexusconsulting.co.za.
            </p>
          </div>
        </section>

        <Link href="/" className="mt-16 inline-block text-sm font-bold text-coral">
          Back to home
        </Link>
      </main>
      <Footer />
    </div>
  );
}
