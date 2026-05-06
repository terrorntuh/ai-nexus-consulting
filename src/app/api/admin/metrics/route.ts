import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET() {
    const supabase = createServerClient();

    if (!supabase) {
        // Return mock data when DB isn't configured
        return NextResponse.json({
            totalTokens: 0,
            apiSpend: 0,
            leadCount: 0,
            rateLimitHits: 0,
            hourlyTokens: Array(24).fill(0),
            recentLeads: [],
        });
    }

    try {
        // ─── Token Usage (fault-tolerant) ─── //
        let totalTokens = 0;
        let rateLimitHits = 0;
        let hourlyTokens = Array(24).fill(0);

        try {
            const { data: tokenData } = await supabase
                .from('usage_logs')
                .select('tokens_used');
            totalTokens = tokenData?.reduce((sum, r) => sum + (r.tokens_used || 0), 0) || 0;

            const { count } = await supabase
                .from('usage_logs')
                .select('*', { count: 'exact', head: true });
            rateLimitHits = count || 0;

            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
            const { data: hourlyData } = await supabase
                .from('usage_logs')
                .select('tokens_used, created_at')
                .gte('created_at', oneDayAgo)
                .order('created_at', { ascending: true });

            hourlyData?.forEach((row) => {
                const hour = new Date(row.created_at).getHours();
                hourlyTokens[hour] += row.tokens_used || 0;
            });
        } catch (e) {
            console.warn('[METRICS] usage_logs unavailable, using defaults');
        }

        // ─── Leads (fault-tolerant) ─── //
        let leadCount = 0;
        let recentLeads: Array<Record<string, unknown>> = [];

        try {
            const { count } = await supabase
                .from('leads')
                .select('*', { count: 'exact', head: true });
            leadCount = count || 0;

            const { data } = await supabase
                .from('leads')
                .select('id, name, email, company, status, score, analysis, draft_reply, created_at')
                .order('created_at', { ascending: false })
                .limit(5);
            recentLeads = data || [];
        } catch (e) {
            console.warn('[METRICS] leads unavailable, using defaults');
        }

        const apiSpend = (totalTokens / 1_000_000) * 0.075;

        return NextResponse.json({
            totalTokens,
            apiSpend: Math.round(apiSpend * 100) / 100,
            leadCount,
            rateLimitHits,
            hourlyTokens,
            recentLeads,
        });
    } catch (error) {
        console.error('[METRICS ERROR]', error);
        // Even on total failure, return safe defaults so the frontend never crashes
        return NextResponse.json({
            totalTokens: 0,
            apiSpend: 0,
            leadCount: 0,
            rateLimitHits: 0,
            hourlyTokens: Array(24).fill(0),
            recentLeads: [],
        });
    }
}
