# Domain Launch Checklist

Domain: `ainexusconsulting.co.za`

## Website

Recommended hosting path: keep the Next.js app on Vercel.

Why:

- The app is already Next.js and already deployed on Vercel.
- Vercel handles App Router, API routes, previews, analytics, and custom domains cleanly.
- Moving to Firebase does not create a client acquisition advantage right now.

## Vercel DNS Setup

In Vercel:

1. Open the AI Nexus project.
2. Go to Settings -> Domains.
3. Add `ainexusconsulting.co.za`.
4. Add `www.ainexusconsulting.co.za`.
5. Follow Vercel's DNS instructions from the registrar.

Typical records:

- Apex/root domain: `A` record pointing to Vercel's IP, or registrar-supported ALIAS/ANAME.
- `www`: `CNAME` pointing to Vercel.

Use Vercel's exact values when adding the domain because they may change per project/account.

## Mailbox Setup

Preferred mailbox:

- `ntuh@ainexusconsulting.co.za` for founder-led outbound
- `hello@ainexusconsulting.co.za` for website/contact/general replies

Provider order:

1. Google Workspace: best trust and UX if payment verification clears.
2. Zoho Mail: good fallback if Google blocks signup again.
3. Microsoft 365: good Outlook-based option.
4. Registrar/cPanel email: only if budget is the main concern.

## Email DNS Records

Before any outreach, configure:

- MX records from the email provider
- SPF
- DKIM
- DMARC

Starter DMARC:

```txt
v=DMARC1; p=none; rua=mailto:hello@ainexusconsulting.co.za
```

Once sending is stable, move toward a stricter DMARC policy.

## Outbound Warmup

First 7 days:

- Send 5 to 10 manually reviewed emails per day.
- Use `ntuh@ainexusconsulting.co.za`, not Gmail.
- Do not add tracking pixels yet.
- Do not send bulk campaigns.
- Personalize the first two lines of every email.
- Reply naturally from the same inbox.

Week 2:

- Move to 10 to 20 per day if deliverability is clean.
- Add one follow-up after 3 to 5 business days.
- Keep using human-approved drafts.

## Website Updates Already Made

- Footer contact updated to `hello@ainexusconsulting.co.za`.
- Metadata canonical domain set to `https://ainexusconsulting.co.za`.
- Outreach docs updated to use the new domain.

## After Domain Resolves

- Test `https://ainexusconsulting.co.za`.
- Test `https://www.ainexusconsulting.co.za`.
- Confirm one redirects cleanly to the other.
- Submit a contact form and confirm it reaches the business mailbox.
- Update the live Vercel environment variables if the contact form/email routing needs the new address.

