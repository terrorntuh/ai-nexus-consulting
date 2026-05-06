import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { getActiveAIModel } from '@/lib/ai-config';
import crypto from 'crypto';

export const maxDuration = 30;

export async function POST(req: Request) {
    const startTime = Date.now();
    const { prompt } = await req.json();

    try {
        const activeModel = await getActiveAIModel('query_doctor', 'gemini-2.5-flash');

        const result = await generateText({
            model: activeModel,
            system: `You are the 'Query Doctor', an expert SQL performance tuner. 
        Your task is to take raw SQL, optimize it for performance and clarity, 
        and provide a one-sentence simple explanation of the fix.
        
        CRITICAL: Return ONLY a raw JSON object. Do NOT wrap it in markdown code blocks or backticks.
        
        The JSON object must have exactly these fields:
        - optimized_sql: The corrected SQL.
        - explanation: A single sentence jargon-free explanation.
        - speed_improvement: An estimated percentage (number between 10 and 95) for visualization purposes.
        
        Stay professional but culturally resonant with the Afro-futurist theme - helpful, wise, and futuristic.`,
            prompt: `Optimize this SQL: ${prompt}`,
        });

        // Log usage (fire-and-forget)
        const supabase = createServerClient();
        if (supabase) {
            const latencyMs = Date.now() - startTime;
            const ipRaw = req.headers.get('x-forwarded-for') || 'unknown';
            const ipHash = crypto.createHash('sha256').update(ipRaw).digest('hex').slice(0, 12);

            void (async () => {
                try {
                    await supabase.from('usage_logs').insert({
                        endpoint: 'query-doctor',
                        tokens_used: (result.usage?.totalTokens) || 0,
                        latency_ms: latencyMs,
                        ip_hash: ipHash,
                    });
                } catch { /* fire-and-forget */ }
            })();
        }

        // Return the raw text — frontend will parse the JSON
        return new NextResponse(result.text, {
            headers: { 'Content-Type': 'text/plain' },
        });
    } catch (error) {
        console.error('[QUERY-DOCTOR ERROR]', error);
        return NextResponse.json({ error: 'AI analysis failed.' }, { status: 500 });
    }
}
