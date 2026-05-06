'use client';

import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { PricingSection } from '@/components/PricingSection';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  CheckCircle2,
  ClipboardCheck,
  DatabaseZap,
  FileText,
  Handshake,
  LockKeyhole,
  MessageSquareText,
  Play,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
} from 'lucide-react';

const proof = [
  { value: 'SA-first', label: 'Built around local adoption, budgets, and POPIA expectations' },
  { value: 'Human loop', label: 'Every risky action gets review, approval, and an owner' },
  { value: '30 days', label: 'Enough time to ship one useful workflow, not a slide deck' },
];

const operatingPrinciples = [
  'No black-box automation in live operations',
  'Secure access to only the data a workflow needs',
  'Plain-English handover for the team that will own it',
  'Audit logs, rollback paths, and approval states by default',
];

const useCases = [
  {
    icon: MessageSquareText,
    title: 'Support Copilot',
    description:
      'Drafts WhatsApp, email, and portal replies from your policies and previous cases. Your team approves before anything is sent.',
    result: 'Faster replies without surrendering the customer relationship.',
  },
  {
    icon: FileText,
    title: 'Ops Report Builder',
    description:
      'Turns spreadsheets, CRM notes, and weekly updates into board-ready reports with citations and review checkpoints.',
    result: 'Less admin theatre, more decision-making.',
  },
  {
    icon: DatabaseZap,
    title: 'Data Cleanup Desk',
    description:
      'Finds duplicates, broken fields, risky personal information, and missing records before migration or automation work.',
    result: 'Clean inputs before expensive AI decisions.',
  },
  {
    icon: ClipboardCheck,
    title: 'Compliance Sentinel',
    description:
      'Flags POPIA risk, consent gaps, retention issues, and unapproved data movement before new workflows go live.',
    result: 'Confidence for founders, managers, and boards.',
  },
];

const buildPath = [
  {
    step: '01',
    title: 'Find the workflow with money behind it',
    copy: 'We map the admin, sales, reporting, or support process where AI can save real hours within one month.',
  },
  {
    step: '02',
    title: 'Prototype with your actual messy inputs',
    copy: 'We use your documents, spreadsheets, forms, and examples so the demo reflects the real operating environment.',
  },
  {
    step: '03',
    title: 'Add approval, policy, and handover',
    copy: 'We wrap the AI in human review, access controls, simple SOPs, and team training before it touches customers.',
  },
  {
    step: '04',
    title: 'Measure, tune, then expand',
    copy: 'We track hours saved, error reduction, response time, and adoption before adding the next workflow.',
  },
];

const industries = [
  'Professional services',
  'Clinics and practices',
  'Real estate teams',
  'Insurance brokers',
  'Training providers',
  'Logistics operators',
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <Navbar />

      <section className="relative min-h-[92vh] overflow-hidden pt-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(42,92,255,0.16),transparent_24%),radial-gradient(circle_at_86%_10%,rgba(255,106,61,0.16),transparent_22%),linear-gradient(180deg,#f7f5ef_0%,#ffffff_72%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-ink/10" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-10 lg:grid-cols-[1.02fr_0.98fr] lg:pb-24">
          <div className="hero-mobile-bound min-w-0 max-w-3xl">
            <h1 className="max-w-4xl text-[2.75rem] font-semibold leading-[0.98] tracking-normal text-ink md:text-7xl lg:text-8xl">
              AI systems your team can trust, approve, and actually use.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-ink/68 md:text-xl">
              AI Nexus builds human-in-the-loop automation for South African businesses:
              practical copilots, cleaner data, faster reporting, and secure workflows that
              keep people accountable.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-13 rounded-md bg-ink px-6 text-white hover:bg-ink/90">
                <a href="#contact">
                  Scope a workflow
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-13 rounded-md border-ink/15 bg-white/60 px-6 text-ink hover:bg-white"
              >
                <a href="#demo">
                  <Play className="mr-2 h-4 w-4" />
                  See the approach
                </a>
              </Button>
            </div>

            <div className="mt-12 grid gap-4 border-y border-ink/10 py-6 sm:grid-cols-3">
              {proof.map((item) => (
                <div key={item.value}>
                  <div className="text-2xl font-semibold text-ink">{item.value}</div>
                  <p className="mt-2 text-sm leading-5 text-ink/58">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="ai-console-wrap relative min-w-0 max-w-full">
            <div className="ai-console">
              <div className="console-topbar">
                <span />
                <span />
                <span />
                <p>Workflow Control Room</p>
              </div>

              <div className="console-grid">
                <div className="console-main">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="console-label">Live workflow</p>
                      <h2>Client intake triage</h2>
                    </div>
                    <div className="status-pill">
                      <span />
                      Human review
                    </div>
                  </div>

                  <div className="decision-flow" aria-hidden="true">
                    <div>
                      <Bot className="h-5 w-5" />
                      Draft
                    </div>
                    <div>
                      <ShieldCheck className="h-5 w-5" />
                      Check
                    </div>
                    <div>
                      <Users className="h-5 w-5" />
                      Approve
                    </div>
                    <div>
                      <Workflow className="h-5 w-5" />
                      Send
                    </div>
                  </div>

                  <div className="review-panel">
                    <p className="console-label">Recommended action</p>
                    <p>
                      Route the lead to a discovery call. Ask for current CRM, weekly
                      report format, and POPIA consent process before proposing automation.
                    </p>
                  </div>
                </div>

                <div className="console-side">
                  <div>
                    <p className="console-label">Risk score</p>
                    <strong>Low</strong>
                    <span>2 policy checks need owner approval</span>
                  </div>
                  <div>
                    <p className="console-label">Hours saved</p>
                    <strong>8.5</strong>
                    <span>Estimated weekly admin reduction</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="principles-panel">
              {operatingPrinciples.map((item) => (
                <div key={item}>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="section-shell bg-white">
        <div className="section-heading">
          <p>Where this is viable right now</p>
          <h2>Not full autopilot. Useful AI with a responsible human in the loop.</h2>
        </div>

        <div className="case-grid">
          {useCases.map((item) => (
            <article key={item.title} className="case-card">
              <item.icon className="h-6 w-6 text-blueprint" />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <strong>{item.result}</strong>
            </article>
          ))}
        </div>
      </section>

      <section id="demo" className="section-shell bg-stone">
        <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="section-heading mx-0 max-w-xl text-left">
            <p>The pitch, sharper</p>
            <h2>Sell a supervised AI operations desk, not a sci-fi agent army.</h2>
            <span>
              The market is ready for better admin, reporting, support, and data workflows.
              It is less ready to trust invisible agents making decisions alone. So the product
              story should make oversight feel like a feature, not a compromise.
            </span>
          </div>

          <div className="operating-desk">
            <div className="desk-row">
              <Handshake className="h-5 w-5" />
              <div>
                <h3>Human ownership</h3>
                <p>Every workflow has a named approver and escalation path.</p>
              </div>
            </div>
            <div className="desk-row">
              <LockKeyhole className="h-5 w-5" />
              <div>
                <h3>Data boundaries</h3>
                <p>AI sees only the files, fields, and permissions required for the job.</p>
              </div>
            </div>
            <div className="desk-row">
              <BadgeCheck className="h-5 w-5" />
              <div>
                <h3>Proof before scale</h3>
                <p>One workflow ships first. Expansion happens when the numbers justify it.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="process" className="section-shell bg-ink text-white">
        <div className="section-heading text-white">
          <p>How we build</p>
          <h2>Four weeks to one working AI workflow.</h2>
        </div>

        <div className="path-grid">
          {buildPath.map((item) => (
            <article key={item.step} className="path-card">
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="fit" className="section-shell bg-white">
        <div className="fit-band">
          <div>
            <Sparkles className="h-7 w-7 text-coral" />
            <h2>Best fit: owner-led and mid-market teams with expensive admin pain.</h2>
          </div>
          <div className="industry-list">
            {industries.map((industry) => (
              <span key={industry}>{industry}</span>
            ))}
          </div>
        </div>
      </section>

      <PricingSection />
      <Footer />
    </main>
  );
}
