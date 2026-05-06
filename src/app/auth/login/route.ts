import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
    const requestUrl = new URL(request.url);
    const formData = await request.formData();
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return NextResponse.redirect(`${requestUrl.origin}/portal/login?error=${error.message}`, {
            status: 301,
        });
    }

    return NextResponse.redirect(`${requestUrl.origin}/portal`, {
        status: 301,
    });
}
