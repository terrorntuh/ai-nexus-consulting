import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { createClient as createUserClient } from '@/utils/supabase/server';

interface ClientDocument {
    id: string;
    client_id: string;
    file_path: string;
}

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const userClient = await createUserClient();

    const {
        data: { user },
        error: authError,
    } = await userClient.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: document, error: documentError } = await userClient
        .from('client_documents')
        .select('id, client_id, file_path')
        .eq('id', id)
        .single<ClientDocument>();

    if (documentError || !document || document.client_id !== user.id) {
        return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const adminClient = createServerClient();
    if (!adminClient) {
        return NextResponse.json({ error: 'Storage is not configured' }, { status: 503 });
    }

    const { data, error } = await adminClient
        .storage
        .from('client-documents')
        .createSignedUrl(document.file_path, 5 * 60);

    if (error || !data?.signedUrl) {
        return NextResponse.json({ error: 'Could not create download link' }, { status: 500 });
    }

    return NextResponse.redirect(data.signedUrl);
}
