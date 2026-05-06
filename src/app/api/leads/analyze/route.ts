import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { createServerClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { sendLeadNotification } from '@/lib/crm';

// Schema for the AI analysis result
const AnalysisSchema = z.object({
    score: z.number().min(0).max(100).describe("Lead score from 0-100 based on quality and intent"),
    analysis: z.string().describe("Brief analysis of why this score was given (max 2 sentences)"),
    draft_reply: z.string().describe("A professional, personalized email reply drafted for this lead from 'Ntuh'"),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { id } = body; // Optional: analyze specific lead

        const supabase = createServerClient();
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
        }

        // 1. Fetch the lead(s) to analyze
        // If ID provided, fetch that one. If not, fetch 1 pending lead (to avoid timeouts).
        let query = supabase.from('leads').select('*');
        if (id) {
            query = query.eq('id', id);
        } else {
            query = query.is('score', null).limit(1);
        }

        const { data: leads, error } = await query;

        if (error || !leads || leads.length === 0) {
            return NextResponse.json({ message: 'No leads to analyze' });
        }

        const lead = leads[0];

        // 2. Perform AI Analysis
        const prompt = `
        Analyze this incoming lead for AI Nexus Consulting.
        
        Lead Details:
        Name: ${lead.name}
        Email: ${lead.email}
        Company: ${lead.company || 'Not specified'}
        Message: "${lead.message}"
        
        My Services:
        - Enterprise AI Strategy
        - Data Engineering & Architecture
        - Custom AI Agent Development
        - Employee AI Training
        
        Scoring Criteria:
        - 90-100: Ready to buy, budget implied, urgent need, enterprise company.
        - 70-89: Clear interest, relevant problem, decision maker.
        - 40-69: Curiosity, early stage, or vague requirement.
        - 0-39: Spam, student, sales pitch, or completely irrelevant.
        
        Task:
        1. Assign a Score (0-100).
        2. Write a brief Analysis (Why this score?).
        3. Draft a Reply from "Ntuh" (Founder). 
           - If spam: Polite decline or ignore.
           - If qualified: Suggest a 15-min call with a calendly link (https://calendly.com/ntuh).
           - Tone: Professional, helpful, concise.
        `;

        const { object: result } = await generateObject({
            model: google('gemini-2.5-flash'),
            schema: AnalysisSchema,
            prompt: prompt,
        });

        // 3. Update Database
        const { error: updateError } = await supabase
            .from('leads')
            .update({
                score: result.score,
                analysis: result.analysis,
                draft_reply: result.draft_reply,
            })
            .eq('id', lead.id);

        if (updateError) {
            console.error('Failed to update lead:', updateError);
            return NextResponse.json({ error: 'Failed to save analysis' }, { status: 500 });
        }

        // 4. Trigger CRM / Webhook Alert
        await sendLeadNotification({
            name: lead.name,
            email: lead.email,
            company: lead.company,
            analysis: result.analysis,
            score: result.score,
            draft_reply: result.draft_reply
        });

        return NextResponse.json({ success: true, leadId: lead.id, ...result });

    } catch (error) {
        console.error('[LEAD ANALYSIS ERROR]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
