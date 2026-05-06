import { createClient } from '@supabase/supabase-js';
import { embedMany } from 'ai';
import { google } from '@ai-sdk/google';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
    console.error("Missing SUPABASE credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(url, key);
const KNOWLEDGE_DIR = path.join(__dirname, 'knowledge');

// Simple chunking function (splits by headers or double newlines)
function chunkText(text) {
    // Split by Markdown headers (## ) or major paragraph breaks
    const chunks = text.split(/\n## |\n\n(?=# )/).filter(c => c.trim().length > 0);
    return chunks.map(chunk => {
        // Re-add the header syntax if we stripped it during split
        if (!chunk.startsWith('#') && chunk.includes('\n')) {
            return '## ' + chunk.trim();
        }
        return chunk.trim();
    });
}

async function seed() {
    console.log("🌱 Starting Knowledge Base Seeding...");

    try {
        const files = await fs.readdir(KNOWLEDGE_DIR);

        for (const file of files) {
            if (!file.endsWith('.md')) continue;

            console.log(`\n📄 Processing ${file}...`);
            const content = await fs.readFile(path.join(KNOWLEDGE_DIR, file), 'utf-8');

            // 1. Chunk the document
            const chunks = chunkText(content);
            console.log(`   Created ${chunks.length} chunks.`);

            // 2. Generate Embeddings using Google gemini-embedding-001 (768 dims)
            console.log(`   Generating embeddings...`);
            const { embeddings } = await embedMany({
                model: google.textEmbeddingModel('gemini-embedding-001'),
                values: chunks,
            });

            // 3. Upload to Supabase pgvector
            for (let i = 0; i < chunks.length; i++) {
                const chunk = chunks[i];
                const embedding = embeddings[i];

                const { error } = await supabase.from('knowledge_vectors').insert({
                    content: chunk,
                    metadata: { source: file, chunk_index: i },
                    embedding: embedding
                });

                if (error) {
                    console.error(`   ❌ Failed to insert chunk ${i}:`, error.message);
                }
            }
            console.log(`   ✅ Successfully ingested ${file}`);
        }

        console.log("\n✨ Seeding Complete!");

    } catch (error) {
        console.error("Fatal Error:", error);
    }
}

seed();
