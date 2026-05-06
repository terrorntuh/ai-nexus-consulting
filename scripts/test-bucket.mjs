import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    'https://uwtjvqwpzpbwvuvjkneo.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3dGp2cXdwenBid3Z1dmprbmVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTUzMjAzMSwiZXhwIjoyMDg3MTA4MDMxfQ.1UTI49x4eKdYhHzPEyAoHdkfbQ1QZaZiKK2tC0nsJ60'
);

async function run() {
    const { data, error } = await supabaseAdmin.storage.getBucket('client-documents');
    console.log("Get Bucket:", data, error);

    if (error) {
        console.log("Attempting to create bucket...");
        const { data: createData, error: createError } = await supabaseAdmin.storage.createBucket('client-documents', { public: false });
        console.log("Create Bucket:", createData, createError);
    }
}
run();
