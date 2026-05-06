import { google } from '@ai-sdk/google';
import { streamText, type UIMessage, convertToModelMessages } from 'ai';
import { createServerClient } from '@/lib/supabase';
import crypto from 'crypto';

export const maxDuration = 30;

export async function POST(req: Request) {
    const startTime = Date.now();
    const { messages }: { messages: UIMessage[] } = await req.json();

    const modelMessages = await convertToModelMessages(messages);

    const result = await streamText({
        model: google('gemini-2.5-flash'),
        system: `You are the AI Consultant Bot for AI Nexus Consulting, trained on the profile of Ntuh, the lead consultant.
    
    Ntuh Profile Highlights:
    - Expert in Enterprise AI Strategy and Cloud Architecture (GCP).
    - Passionate about Afro-futurism and empowering emerging markets.
    - Focuses on "Human-Centric AI" and clear communication (Plain English).
    - Always professional, slightly futuristic, and very helpful.
    
    Your goal is to guide users towards consulting services.
    - If a user asks a technical question, provide a brief, insightful answer and suggest a deep-dive consultation.
    - If a user asks a non-consulting query (e.g., jokes, general trivia), politely redirect them back to AI Nexus services.
    - If you are unsure or the conversation reaches a high-value lead point, trigger the 'Human Eject' option.
    
    Tone: Sophisticated, Afro-futurist, efficient.`,
        messages: modelMessages,
        onFinish: async ({ usage }) => {
            // Log usage to Supabase
            const supabase = createServerClient();
            if (supabase) {
                const latencyMs = Date.now() - startTime;
                const ipRaw = req.headers.get('x-forwarded-for') || 'unknown';
                const ipHash = crypto.createHash('sha256').update(ipRaw).digest('hex').slice(0, 12);

                try {
                    await supabase.from('usage_logs').insert({
                        endpoint: 'consultant-bot',
                        tokens_used: (usage?.totalTokens) || 0,
                        latency_ms: latencyMs,
                        ip_hash: ipHash,
                    });
                } catch (error) {
                    console.error('Failed to log usage:', error);
                }

                // Log conversation messages
                const sessionId = crypto.randomUUID();
                const lastUserMsg = messages.filter(m => m.role === 'user').pop();
                if (lastUserMsg) {
                    const textContent = lastUserMsg.parts
                        ?.filter((p: any) => p.type === 'text')
                        .map((p: any) => p.text)
                        .join('') || '';

                    if (textContent) {
                        try {
                            await supabase.from('conversations').insert({
                                session_id: sessionId,
                                role: 'user',
                                content: textContent,
                            });
                        } catch (error) {
                            console.error('Failed to log conversation:', error);
                        }
                    }
                }
            }
        },
    });

    return result.toUIMessageStreamResponse();
}
