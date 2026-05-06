import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client (uses service role key for full access)
export function createServerClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        // Return null if not configured — allows the app to run without DB
        return null;
    }

    return createClient(url, key, {
        auth: { persistSession: false },
    });
}

// Client-side Supabase client (uses anon key with RLS)
export function createBrowserClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    return createClient(url, key);
}

// Type definitions for our tables
export interface Lead {
    id: string;
    name: string;
    email: string;
    company: string | null;
    message: string;
    source: 'contact_form' | 'consultant_bot' | 'calendly';
    status: 'new' | 'contacted' | 'qualified' | 'closed';
    created_at: string;
}

export interface Conversation {
    id: string;
    session_id: string;
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
}

export interface UsageLog {
    id: string;
    endpoint: 'query-doctor' | 'consultant-bot';
    tokens_used: number;
    latency_ms: number;
    ip_hash: string | null;
    created_at: string;
}
