# Zoho Rollout Checklist

Date: 2026-05-11

## Current External DNS Read

Observed from local DNS lookup:

- Zoho verification TXT is live.
- Root domain still appears to point at GoDaddy parking IPs, not Vercel.
- `www` currently points back to the root domain.
- MX/SPF/DKIM/DMARC did not show yet from the resolver I checked.

This may be propagation delay or incomplete DNS setup.

## Before Sending Cold Email

Confirm these in Zoho and DNS:

- MX records are verified in Zoho.
- SPF is verified.
- DKIM is verified.
- DMARC exists.
- `ntuh@ainexusconsulting.co.za` can send and receive.
- `hello@ainexusconsulting.co.za` can receive.

## Minimal DMARC

Use this starter policy while warming the domain:

```txt
v=DMARC1; p=none; rua=mailto:hello@ainexusconsulting.co.za
```

## Email Signature

Use this for the first campaign:

```txt
Regards,
Ntuh
AI Nexus Consulting
Human-loop AI systems for South African businesses
https://ainexusconsulting.co.za
ntuh@ainexusconsulting.co.za
```

## First Sending Rule

Do not send all 10 at once.

First wave:

1. Ledger Ease
2. JBMN Chartered Accountants
3. Page Accounting
4. Ishmut Accounting
5. Freon Accounting Services

If nothing bounces after 24 hours, send the next 5.

## Manual Zoho Send Flow

1. Open `content/email-drafts-accounting-batch-001.md`.
2. Copy the matching draft.
3. Paste into Zoho Mail.
4. Add the matching recipient and subject from `content/outreach-send-queue-2026-05-11.csv`.
5. Read it once and make one small personal edit.
6. Send.
7. Update the queue CSV:
   - `status`: `sent`
   - `send_date`: current date
   - `follow_up_date`: 3 to 5 business days later

## If I Operate Zoho In Browser

Do not paste credentials into chat.

Safer flow:

1. You open/login to Zoho in the in-app browser or your normal browser.
2. Once logged in, tell me.
3. I can help compose drafts one by one if browser access is available.
4. You approve each send.

No unattended bulk sending.

