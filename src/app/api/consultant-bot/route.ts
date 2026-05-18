import { google } from '@ai-sdk/google';
import { streamText, embed, type UIMessage, convertToModelMessages, isTextUIPart } from 'ai';
import { createServerClient } from '@/lib/supabase';
import { getActiveAIModel } from '@/lib/ai-config';
import crypto from 'crypto';

export const maxDuration = 30;

export async function POST(req: Request) {
    const startTime = Date.now();
    const { messages }: { messages: UIMessage[] } = await req.json();

    const modelMessages = await convertToModelMessages(messages);
    const lastUserMessage = messages
        .filter((m) => m.role === 'user')
        .pop()
        ?.parts
        .filter(isTextUIPart)
        .map((p) => p.text)
        .join('') || '';
    const supabase = createServerClient();

    let contextStr = '';

    // RAG Retrieval Phase
    if (supabase && lastUserMessage) {
        try {
            // 1. Vectorize the user's query
            const { embedding } = await embed({
                model: google.textEmbeddingModel('gemini-embedding-001'),
                value: lastUserMessage,
            });

            // 2. Search Supabase for relevant chunks
            const { data } = await supabase.rpc('search_knowledge', {
                query_embedding: embedding,
                match_threshold: 0.5,
                match_count: 3
            });

            if (data && data.length > 0) {
                contextStr = (data as Array<{ content: string }>)
                    .map((d) => d.content)
                    .join('\n\n');
            }
        } catch (e) {
            console.error('[RAG ERROR]', e);
        }
    }

    const systemPrompt = `You are the AI Consultant Bot for AI Nexus Consulting, trained on the profile of Ntuh, the lead consultant.
    
    Ntuh Profile Highlights:
    - Expert in Enterprise AI Strategy and Cloud Architecture (GCP).
    - Passionate about Afro-futurism and empowering emerging markets.
    - Focuses on "Human-Centric AI" and clear communication (Plain English).
    - Always professional, slightly futuristic, and very helpful.
    
    Your goal is to guide users towards consulting services.
    - If a user asks a technical question, provide a brief, insightful answer and suggest a deep-dive consultation.
    - If a user asks a non-consulting query (e.g., jokes, general trivia), politely redirect them back to AI Nexus services.
    - If you are unsure or the conversation reaches a high-value lead point, trigger the 'Human Eject' option.
    
    Tone: Sophisticated, Afro-futurist, efficient.
    
    ${contextStr ? `\n--- INTERNAL KNOWLEDGE BASE ---\nUse the following verified company information to answer the user's question accurately:\n${contextStr}\n---------------------------------\n` : ''}`;

    const activeModel = await getActiveAIModel('consultant_bot', 'gemini-2.5-flash');

    const result = await streamText({
        model: activeModel,
        system: systemPrompt,
        messages: modelMessages,
        onFinish: async ({ usage }) => {
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
            }
        },
    });

    return result.toUIMessageStreamResponse();
}
