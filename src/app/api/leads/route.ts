import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const { name, email, company, message } = await req.json();

        // Validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required.' },
                { status: 400 }
            );
        }

        const supabase = createServerClient();

        if (!supabase) {
            // DB not configured — still accept the lead but log it
            console.log('[LEAD]', { name, email, company, message });
            return NextResponse.json({ success: true, id: 'local-fallback' });
        }

        const { data, error } = await supabase
            .from('leads')
            .insert({ name, email, company, message, source: 'contact_form' })
            .select('id')
            .single();

        if (error) {
            console.error('[LEADS ERROR]', error);
            return NextResponse.json({ error: 'Failed to save lead.' }, { status: 500 });
        }

        return NextResponse.json({ success: true, id: data.id });
    } catch {
        return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }
}

export async function GET() {
    return NextResponse.json({ error: 'Lead listing is restricted to admin workflows.' }, { status: 405 });
}
