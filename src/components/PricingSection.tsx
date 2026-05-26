'use client';

import { motion } from 'framer-motion';
import { AppWindow, Check, Globe2, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

const tiers = [
  {
    name: 'Basic Website',
    price: 'From R3,500',
    period: 'once-off',
    description:
      'A clean starter website for businesses that need a credible online presence before adding heavier systems.',
    icon: Globe2,
    features: [
      'One-page or lean starter layout',
      'Mobile-friendly service and contact sections',
      'Basic SEO titles and search preview copy',
      'Domain, email, and launch guidance',
    ],
    cta: 'Start website',
  },
  {
    name: 'Website + Lead System',
    price: 'From R8,500',
    period: 'once-off',
    description:
      'A sharper business website with enquiry capture, routing, follow-up structure, and analytics from day one.',
    icon: Rocket,
    features: [
      'Up to 5 core pages',
      'Contact, quote, or booking enquiry flow',
      'Lead routing to email, sheet, or CRM-style tracker',
      'Follow-up templates and analytics setup',
    ],
    cta: 'Build lead system',
    highlighted: true,
  },
  {
    name: 'Custom App / Workflow Pilot',
    price: 'From R18,000',
    period: 'per pilot',
    description:
      'A working portal, dashboard, internal tool, or human-reviewed workflow for teams ready to reduce admin, not just look better online.',
    icon: AppWindow,
    features: [
      'One practical app or workflow build',
      'Approval and escalation states',
      'Data cleanup, reporting, and handover notes',
      'Team training and 14-day tuning window',
    ],
    cta: 'Scope app or workflow',
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="section-shell bg-stone">
      <div className="section-heading">
        <p>Commercial offer</p>
        <h2>Start at R3,500. Add apps and consulting when the business is ready.</h2>
      </div>

      <div className="grid max-w-7xl gap-5 lg:grid-cols-3">
        {tiers.map((tier, index) => (
          <motion.article
            key={tier.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            viewport={{ once: true }}
            className={`flex min-h-[520px] flex-col rounded-md border p-7 ${
              tier.highlighted
                ? 'border-ink bg-ink text-white shadow-2xl shadow-ink/15'
                : 'border-ink/12 bg-paper text-ink'
            }`}
          >
            <div className="flex items-center justify-between">
              <tier.icon className={tier.highlighted ? 'h-7 w-7 text-coral' : 'h-7 w-7 text-blueprint'} />
              {tier.highlighted && (
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-white/72">
                  Best first move
                </span>
              )}
            </div>

            <h3 className="mt-9 text-2xl font-semibold">{tier.name}</h3>
            <p className={`mt-4 min-h-[88px] leading-7 ${tier.highlighted ? 'text-white/68' : 'text-ink/64'}`}>
              {tier.description}
            </p>

            <div className="mt-8 flex items-end gap-2">
              <strong className="text-4xl font-semibold tracking-normal">{tier.price}</strong>
              <span className={`pb-1 text-sm font-bold uppercase ${tier.highlighted ? 'text-white/42' : 'text-ink/42'}`}>
                {tier.period}
              </span>
            </div>

            <div className="mt-8 space-y-4">
              {tier.features.map((feature) => (
                <div key={feature} className="flex gap-3">
                  <Check className={tier.highlighted ? 'mt-1 h-4 w-4 flex-none text-coral' : 'mt-1 h-4 w-4 flex-none text-mint'} />
                  <span className={tier.highlighted ? 'text-sm leading-6 text-white/74' : 'text-sm leading-6 text-ink/72'}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <Button
              asChild
              className={`mt-auto h-12 rounded-md font-bold ${
                tier.highlighted
                  ? 'bg-white text-ink hover:bg-coral hover:text-ink'
                  : 'bg-ink text-white hover:bg-blueprint'
              }`}
            >
              <a href="#contact">{tier.cta}</a>
            </Button>
          </motion.article>
        ))}
      </div>

      <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-7 text-ink/54">
        Consulting sprints, monthly support, and AI ops retainers are available after launch, once
        there is a real website, app, lead flow, or workflow to improve.
      </p>
    </section>
  );
}
