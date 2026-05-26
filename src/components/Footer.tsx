import { Mail, MapPin, ShieldCheck } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { ContactForm } from '@/components/ContactForm';

const links = [
  { label: 'Services', href: '/#services' },
  { label: 'Approach', href: '/#approach' },
  { label: 'Process', href: '/#process' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Insights', href: '/insights' },
];

export function Footer() {
  return (
    <footer>
      <ContactForm />

      <div className="bg-paper">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <BrandLogo className="brand-logo-footer" />
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.22em] text-ink/42">
              Websites, apps & human-loop AI
            </p>
            <p className="mt-5 max-w-md text-sm leading-7 text-ink/58">
              Practical websites, custom apps, lead systems, consulting, and AI workflows for South
              African teams that want speed without losing judgement, compliance, or operational control.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.18em] text-ink/42">Navigation</h3>
            <div className="mt-4 grid gap-2">
              {links.map((link) => (
                <a key={link.href} href={link.href} className="text-sm font-semibold text-ink/62 hover:text-ink">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.18em] text-ink/42">Contact</h3>
            <div className="mt-4 grid gap-3 text-sm font-semibold text-ink/62">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-coral" />
                Johannesburg, South Africa
              </span>
              <a href="mailto:sales@ainexusconsulting.co.za" className="flex items-center gap-2 hover:text-ink">
                <Mail className="h-4 w-4 text-coral" />
                sales@ainexusconsulting.co.za
              </a>
              <span className="flex items-center gap-2 text-mint">
                <ShieldCheck className="h-4 w-4" />
                POPIA-aware by design
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-ink/10">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-xs font-semibold text-ink/42 md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} AI Nexus Consulting. All rights reserved.</p>
            <p>Built for useful work, not empty AI theatre.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
