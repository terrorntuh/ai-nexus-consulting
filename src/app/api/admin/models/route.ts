import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET(req: Request) {
    const supabase = createServerClient();
    if (!supabase) return NextResponse.json({ error: 'Supabase client not initialized' }, { status: 500 });

    try {
        const { data, error } = await supabase.from('ai_settings').select('*');
        if (error) throw error;
        return NextResponse.json({ settings: data });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
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
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
