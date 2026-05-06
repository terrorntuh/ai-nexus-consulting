'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// Use the service role key to bypass RLS for Admin operations
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function fetchClients() {
    const { data: clients, error } = await supabaseAdmin
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return clients;
}

export async function createPortalClient(email: string, company_name: string, tempPassword?: string) {
    const initialPassword = tempPassword || process.env.DEFAULT_PORTAL_TEMP_PASSWORD;
    if (!initialPassword) {
        throw new Error('Missing DEFAULT_PORTAL_TEMP_PASSWORD. Set it in the private deployment environment.');
    }

    // 1. Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        email_confirm: true,
        password: initialPassword,
        user_metadata: { company_name }
    });

    if (authError) throw new Error(`Auth Error: ${authError.message}`);

    const userId = authData.user.id;

    // 2. Insert into our public.clients table
    const { error: dbError } = await supabaseAdmin
        .from('clients')
        .insert({
            id: userId,
            email: email,
            company_name: company_name,
            setup_status: 'active'
        });

    if (dbError) {
        // Rollback auth user if DB insert fails
        await supabaseAdmin.auth.admin.deleteUser(userId);
        throw new Error(`DB Error: ${dbError.message}`);
    }

    revalidatePath('/admin');
    return { success: true, userId };
}

export async function uploadClientDocument(formData: FormData) {
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const clientId = formData.get('clientId') as string;

    if (!file || !title || !clientId) {
        throw new Error('Missing required fields');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${clientId}/${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

    // 1. Upload to Storage bucket
    const { error: uploadError } = await supabaseAdmin
        .storage
        .from('client-documents')
        .upload(fileName, file, { contentType: file.type });

    if (uploadError) {
        // If bucket doesn't exist, try to create it first (for setup convenience)
        if (uploadError.message.toLowerCase().includes('bucket not found')) {
            await supabaseAdmin.storage.createBucket('client-documents', { public: false });
            // Retry upload
            const { error: retryError } = await supabaseAdmin.storage.from('client-documents').upload(fileName, file, { contentType: file.type });
            if (retryError) throw new Error(`Upload Retry Error: ${retryError.message}`);
        } else {
            throw new Error(`Upload Error: ${uploadError.message}`);
        }
    }

    // 2. Generate signed URL (valid for 10 years, or we can just store the path and sign on-the-fly)
    // Actually, best practice is storing the path and signing on the client dashboard. We'll just store the path!

    // 3. Insert into DB
    const { error: dbError } = await supabaseAdmin
        .from('client_documents')
        .insert({
            client_id: clientId,
            title,
            description,
            file_path: fileName,
            file_type: file.type
        });

    if (dbError) throw new Error(`DB Error: ${dbError.message}`);

    revalidatePath('/admin');
    return { success: true };
}
