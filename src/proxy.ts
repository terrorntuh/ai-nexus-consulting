import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware'

// Simplified rate limiting (mocking Redis for now)
const rateLimit = new Map<string, { count: number; lastReset: number }>();
const LIMIT = 30;
const WINDOW = 24 * 60 * 60 * 1000; // 24 hours

// Routes excluded from rate limiting (internal/admin endpoints)
const RATE_LIMIT_EXCLUDE = ['/api/admin/', '/api/leads'];

export default async function proxy(request: NextRequest) {
    // 1. Supabase Session Management & Route Protection
    let response = await updateSession(request);

    // 2. Rate Limiting for Public API Routes
    const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const now = Date.now();
    const path = request.nextUrl.pathname;

    const isExcluded = RATE_LIMIT_EXCLUDE.some(prefix => path.startsWith(prefix));
    if (!isExcluded && path.startsWith('/api/')) {
        const data = rateLimit.get(ip) ?? { count: 0, lastReset: now };

        if (now - data.lastReset > WINDOW) {
            data.count = 0;
            data.lastReset = now;
        }

        if (data.count >= LIMIT) {
            return new NextResponse(
                JSON.stringify({ error: 'Rate limit exceeded. Please try again tomorrow or book a call.' }),
                { status: 429, headers: { 'Content-Type': 'application/json' } }
            );
        }

        data.count++;
        rateLimit.set(ip, data);
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
