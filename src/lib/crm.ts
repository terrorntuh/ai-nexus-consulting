export async function sendLeadNotification(lead: {
    name: string;
    email: string;
    company?: string | null;
    analysis?: string | null;
    score?: number | null;
    draft_reply?: string | null;
}) {
    const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL;

    if (!webhookUrl) {
        console.warn('[CRM] No Webhook URL configured. Skipping lead notification.');
        return;
    }

    try {
        const payload = {
            text: `🎯 *New Consulting Lead Captured!*\n\n*Name:* ${lead.name}\n*Email:* ${lead.email}\n*Company:* ${lead.company || 'Not provided'}\n*Lead Score:* ${lead.score || 'N/A'}/100\n\n*AI Analysis:*\n${lead.analysis || 'No analysis available.'}`,
            // Standard JSON payload format that works with Slack, Make.com, Zapier, Discord
            blocks: [
                {
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: "🎯 New Consulting Lead Captured!",
                        emoji: true
                    }
                },
                {
                    type: "section",
                    fields: [
                        { type: "mrkdwn", text: `*Name:*\n${lead.name}` },
                        { type: "mrkdwn", text: `*Email:*\n${lead.email}` }
                    ]
                },
                {
                    type: "section",
                    fields: [
                        { type: "mrkdwn", text: `*Company:*\n${lead.company || 'N/A'}` },
                        { type: "mrkdwn", text: `*Score:*\n${lead.score ? `${lead.score}/100` : 'Filtering...'}` }
                    ]
                },
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `*AI Analysis:*\n${lead.analysis || 'Pending background analysis...'}`
                    }
                },
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `*Drafted Reply:*\n${lead.draft_reply || 'N/A'}`
                    }
                }
            ]
        };

        const res = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            console.error('[CRM] Webhook failed with status:', res.status);
        } else {
            console.log('[CRM] Lead notification dispatched successfully.');
        }
    } catch (error) {
        console.error('[CRM] Failed to dispatch webhook:', error);
    }
}
