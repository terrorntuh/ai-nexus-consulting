// Verification script for Supabase Connection (Direct)
// Usage: node scripts/verify-db-direct.mjs

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// 1. Load env vars manually
const envPath = path.resolve(process.cwd(), '.env.local');
let env = {};
try {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            env[key.trim()] = value.trim();
        }
    });
} catch {
    console.error('❌ Could not read .env.local');
    process.exit(1);
}

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing Supabase credentials in .env.local');
    console.log('Found URL:', !!SUPABASE_URL);
    console.log('Found KEY:', !!SUPABASE_KEY);
    process.exit(1);
}

// 2. Initialize Clients
const anonClient = createClient(SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
const serviceClient = serviceKey ? createClient(SUPABASE_URL, serviceKey) : null;

async function checkDB() {
    console.log('🚀 Checking Supabase Connection...');
    console.log(`URL: ${SUPABASE_URL}`);

    // Log key prefixes safely
    const anonPrefix = env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 5) : 'MISSING';
    const servicePrefix = serviceKey ? serviceKey.substring(0, 5) : 'MISSING';
    console.log(`Anon Key: ${anonPrefix}...`);
    console.log(`Service Key: ${servicePrefix}...`);

    let success = false;

    // TEST 1: Public Insert (Anon Key)
    try {
        console.log('\n🧪 TEST 1: Attempting Public Insert (Anon Key)...');
        const { data: anonData, error: anonError } = await anonClient
            .from('leads')
            .insert({
                name: 'Anon Test',
                email: 'anon@test.com',
                message: 'Anon insert check',
                source: 'contact_form'
            })
            .select()
            .single();

        if (anonError) {
            console.error('❌ Anon Insert Failed:', anonError.code, anonError.message);
        } else {
            console.log('✅ Anon Insert Successful! ID:', anonData.id);
            success = true;
            // Try to clean up with service client (anon can't delete usually)
            if (serviceClient) await serviceClient.from('leads').delete().eq('id', anonData.id);
        }
    } catch (e) { console.error('Anon Test Error:', e.message); }

    // TEST 2: Admin Insert (Service Role)
    if (serviceClient) {
        try {
            console.log('\n🧪 TEST 2: Attempting Admin Insert (Service Role Key)...');
            const { data: adminData, error: adminError } = await serviceClient
                .from('leads')
                .insert({
                    name: 'Admin Test',
                    email: 'admin@test.com',
                    message: 'Admin insert check',
                    source: 'contact_form'
                })
                .select()
                .single();

            if (adminError) {
                console.error('❌ Service Role Insert Failed:', adminError.code, adminError.message);
                console.error('💡 TIP: Check if SUPABASE_SERVICE_ROLE_KEY in .env.local matches your Supabase dashboard.');
            } else {
                console.log('✅ Service Role Insert Successful! ID:', adminData.id);
                success = true;
                await serviceClient.from('leads').delete().eq('id', adminData.id);
            }
        } catch (e) { console.error('Admin Test Error:', e.message); }
    } else {
        console.log('\n⚠️ Skipping Service Role test (Key missing from .env.local)');
    }

    // TEST 3: Check usage_logs table
    try {
        console.log('\n🧪 TEST 3: Checking usage_logs table...');
        const { error: logError } = await anonClient
            .from('usage_logs')
            .insert({
                endpoint: 'test-endpoint',
                tokens_used: 10,
                latency_ms: 100
            })
            .select()
            .single();

        if (logError) {
            console.error('❌ Usage Logs Check Failed:', logError.code, logError.message);
            if (logError.code === '42P01') console.error('💡 HINT: Table "usage_logs" is MISSING.');
        } else {
            console.log('✅ usage_logs table exists and is writable!');
        }
    } catch (e) { console.error('Usage Logs Error:', e.message); }

    if (!success) {
        console.error('\n❌ All DB checks failed. Please verify your .env.local keys and SQL policies.');
        process.exit(1);
    }
}

checkDB();
