'use client';

import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { PricingSection } from '@/components/PricingSection';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  DatabaseZap,
  FileText,
  Handshake,
  LockKeyhole,
  MessageSquareText,
  Play,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
} from 'lucide-react';

const proof = [
  { value: 'R3,500', label: 'Starter websites for businesses that need a credible online base' },
  { value: 'Lead-ready', label: 'Forms, routing, email, and follow-up structure from day one' },
  { value: 'AI-ready', label: 'Build the website first, then automate the admin behind it' },
];

const operatingPrinciples = [
  'No black-box automation in live operations',
  'Secure access to only the data a workflow needs',
  'Plain-English handover for the team that will own it',
  'Audit logs, rollback paths, and approval states by default',
];

const useCases = [
  {
    icon: SearchCheck,
    title: 'AI-Ready Website',
    description:
      'A clean business website with clear services, contact routing, analytics, and a structure ready for future workflows.',
    result: 'A credible front door before trying to sell advanced automation.',
  },
  {
    icon: MessageSquareText,
    title: 'Lead Capture System',
    description:
      'Turns website enquiries into organized leads, email alerts, quote requests, and follow-up prompts your team can act on.',
    result: 'Fewer missed enquiries and a cleaner sales follow-up rhythm.',
  },
  {
    icon: FileText,
    title: 'Ops Workflow Pilot',
    description:
      'Adds one practical workflow behind the site: intake, document collection, client reminders, or reporting drafts.',
    result: 'A small working system before committing to bigger AI spend.',
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
    title: 'Launch the credible front door',
    copy: 'We clarify the offer, build the website, connect the domain, and make it easy for prospects to contact you.',
  },
  {
    step: '02',
    title: 'Capture leads properly',
    copy: 'We route enquiries into email, sheets, CRM, or a simple dashboard so follow-up becomes visible and repeatable.',
  },
  {
    step: '03',
    title: 'Add the first workflow',
    copy: 'Once the intake is clear, we add one useful workflow: reminders, document collection, reporting, or response drafts.',
  },
  {
    step: '04',
    title: 'Measure, tune, then automate',
    copy: 'We track leads, response time, admin hours, and adoption before adding heavier AI automation.',
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
            <h1 className="max-w-4xl text-[2.6rem] font-semibold leading-[1.02] tracking-normal text-ink md:text-6xl lg:text-[4.8rem] xl:text-[5.35rem]">
              Websites and AI systems your team can actually use.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-ink/68 md:text-xl">
              AI Nexus builds credible websites and human-in-the-loop automation for South African
              businesses: start with a useful online presence, then add the workflows that save
              admin time without losing human approval.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-13 rounded-md bg-ink px-6 text-white hover:bg-ink/90">
                <a href="#contact">
                  Get a website quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-13 rounded-md border-ink/15 bg-white/60 px-6 text-ink hover:bg-white"
              >
                <a href="#approach">
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
                      <FileText className="h-5 w-5" />
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
          <h2>Start with the website. Grow into the workflow.</h2>
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

      <section id="approach" className="section-shell bg-stone">
        <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="section-heading mx-0 max-w-xl text-left">
            <p>The pitch, sharper</p>
            <h2>Sell the business a better front door, then build the engine behind it.</h2>
            <span>
              Many teams first need a credible website, clear offers, and working lead capture.
              Once enquiries are structured, AI Nexus can add the practical workflows behind the
              scenes: intake, reporting, reminders, and human-approved follow-up.
            </span>
          </div>

          <div className="operating-desk">
            <div className="desk-row">
              <Handshake className="h-5 w-5" />
              <div>
                <h3>Website first</h3>
                <p>Give the business a clear place to send prospects, explain services, and collect enquiries.</p>
              </div>
            </div>
            <div className="desk-row">
              <LockKeyhole className="h-5 w-5" />
              <div>
                <h3>Lead capture next</h3>
                <p>Route forms, quote requests, and email alerts so no enquiry disappears into a messy inbox.</p>
              </div>
            </div>
            <div className="desk-row">
              <BadgeCheck className="h-5 w-5" />
              <div>
                <h3>Automation when ready</h3>
                <p>Add AI only where the workflow is clear, reviewed, and worth the extra spend.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="process" className="section-shell bg-ink text-white">
        <div className="section-heading text-white">
          <p>How we build</p>
          <h2>From website launch to workflow system.</h2>
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
            <h2>Best fit: owner-led teams that need a better website, cleaner leads, and less admin drag.</h2>
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
