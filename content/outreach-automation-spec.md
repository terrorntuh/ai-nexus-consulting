# Outreach Automation Spec

## Recommendation

Set up the domain and mailbox first, then automate the pipeline around a human approval step.

Do not auto-send cold email from a brand-new domain. Start with slow, manually approved sending so the domain builds reputation and the copy improves from real replies.

## Domain And Mailbox

Selected setup:

- Domain: `ainexusconsulting.co.za`
- Primary mailbox: `ntuh@ainexusconsulting.co.za`
- General mailbox: `hello@ainexusconsulting.co.za`
- Optional alias: `audit@ainexusconsulting.co.za`

Email provider options:

- Google Workspace: most polished and trusted, costs more, easiest for business credibility
- Zoho Mail: cheaper, good enough for early stage, can still look professional
- Microsoft 365: solid if you prefer Outlook/Office
- Local cPanel email: cheapest, but deliverability and UX can be more uneven

My pick: Google Workspace if budget allows. Zoho if we want lean and still professional.

## DNS Checklist

Before sending:

- SPF configured
- DKIM configured
- DMARC configured with a gentle policy first
- Domain redirects to the Vercel site
- Website contact form sends to the business mailbox

## Safe Sending Cadence

Week 1:

- 5 to 10 emails per day
- No automation sending
- Personalize every email manually
- Track replies in CSV

Week 2:

- 10 to 20 emails per day
- Semi-automated drafts
- Human approval before each send
- One follow-up after 3 to 5 business days

Week 3+:

- Expand to 25 to 40 per day if replies and deliverability are healthy
- Add LinkedIn touches
- Start testing subject lines by niche

## Pipeline Fields

Use the lead CSV as the first CRM.

Recommended columns:

- company
- city
- province
- website
- email
- phone
- public_signal
- ai_workflow_angle
- source_url
- status
- owner
- first_email_date
- follow_up_1_date
- follow_up_2_date
- reply_status
- meeting_date
- offer_stage
- notes

## Automation Flow

1. Lead research

Input: niche and province  
Output: rows added to `content/outreach-accounting-leads.csv`

2. Draft generation

Input: lead row  
Output: personalized first email, LinkedIn DM, follow-up 1, follow-up 2

3. Human review

Input: generated draft  
Action: Ntuh edits and approves

4. Send

Manual at first through Google Workspace or Zoho Mail.

5. Track

Update CSV status:

- new
- drafted
- sent
- replied
- booked
- not_fit
- follow_up_due

6. Follow-up

Only follow up if no reply and no opt-out.

## First Automation To Build

Build a draft generator, not a sender.

It should:

- read the lead CSV
- select leads with status `new`
- generate a personalized email and LinkedIn DM
- save drafts into a markdown file
- mark rows as `drafted`

That gives speed without risking domain reputation.

## Later Automation

Once the domain is warmed and the offer is proven:

- connect Gmail/Google Workspace
- create drafts automatically
- require human approval before send
- log sent date and follow-up due date
- never send to invalid, missing, or unsubscribed addresses

## Reply Handling

Positive reply:

Send:

Thanks, appreciate it. The easiest next step is for you to send one workflow that wastes time every week or month: a client follow-up process, report, spreadsheet, document checklist, or recurring admin task.

I will map what AI can safely draft, what still needs human approval, and what a first pilot would cost.

Neutral reply:

Send:

Makes sense. To keep it practical, I can send a 1-page example using a generic accounting workflow like monthly document collection or management report drafting. If it looks useful, we can adapt it to your process.

Not interested:

Send:

No problem at all. I will close the loop here. Thanks for replying.
