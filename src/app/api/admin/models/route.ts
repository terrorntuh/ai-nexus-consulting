import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

const DEFAULT_SETTINGS = [
    {
        feature_name: 'query_doctor',
        provider: 'google',
        model_id: 'gemini-2.5-flash',
        updated_at: null,
    },
    {
        feature_name: 'consultant_bot',
        provider: 'google',
        model_id: 'gemini-2.5-flash',
        updated_at: null,
    },
];

export async function GET() {
    const supabase = createServerClient();
    if (!supabase) {
        return NextResponse.json({
            settings: DEFAULT_SETTINGS,
            warning: 'Supabase client not initialized',
        });
    }

    try {
        const { data, error } = await supabase.from('ai_settings').select('*');
        if (error) throw error;
        return NextResponse.json({ settings: data });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch model settings';
        return NextResponse.json({
            settings: DEFAULT_SETTINGS,
            warning: message,
        });
    }
}

export async function POST(req: Request) {
    const supabase = createServerClient();
    if (!supabase) return NextResponse.json({ error: 'Supabase client not initialized' }, { status: 500 });

    try {
        const { feature_name, provider, model_id } = await req.json();

        const { error } = await supabase
            .from('ai_settings')
            .upsert({
                feature_name,
                provider,
                model_id,
                updated_at: new Date().toISOString()
            });

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update model settings';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
