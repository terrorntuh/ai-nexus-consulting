import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${requestUrl.origin}/auth/callback`,
        },
    });

    if (error) {
        return NextResponse.redirect(`${requestUrl.origin}/portal/login?error=Could not authenticate with Google`);
    }

    if (data.url) {
        return NextResponse.redirect(data.url);
    }

    return NextResponse.redirect(`${requestUrl.origin}/portal/login?error=Unexpected Auth Error`);
}
