-- Phase 1 & 2 Schema (Existing)
-- ==========================================

-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create leads table if it doesn't exist
create table if not exists public.leads (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    email text not null,
    company text,
    message text not null,
    status text default 'new' check (status in ('new', 'contacted', 'qualified', 'closed')),
    score integer check (score between 0 and 100),
    analysis text,
    draft_reply text,
    sentiment text,
    source text default 'website_contact_form'
);

-- RLS stays enabled for public-facing tables. Anonymous users may submit leads,
-- but lead listing and management should happen only through service-role admin workflows.
alter table public.leads enable row level security;

drop policy if exists "Anyone can submit leads" on public.leads;
create policy "Anyone can submit leads"
on public.leads for insert
to anon, authenticated
with check (true);

-- Create knowledge_base table for RAG
create table if not exists public.knowledge_base (
    id uuid default gen_random_uuid() primary key,
    content text not null,
    metadata jsonb,
    embedding vector(768)
);

alter table public.knowledge_base enable row level security;

-- Create a function to search for matching knowledge (Cosine Similarity)
create or replace function match_knowledge (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    knowledge_base.id,
    knowledge_base.content,
    knowledge_base.metadata,
    1 - (knowledge_base.embedding <=> query_embedding) as similarity
  from knowledge_base
  where 1 - (knowledge_base.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;

create or replace function search_knowledge (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select *
  from match_knowledge(query_embedding, match_threshold, match_count);
$$;

-- Create ai_settings table for Admin dynamic model switching
create table if not exists public.ai_settings (
    feature_name text primary key,
    provider text not null,    -- e.g., 'google', 'openai', 'anthropic'
    model_id text not null,    -- e.g., 'gemini-1.5-flash', 'gpt-4o'
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Seed default settings if they don't exist
insert into public.ai_settings (feature_name, provider, model_id)
values 
    ('query_doctor', 'google', 'gemini-1.5-flash'),
    ('consultant_bot', 'google', 'gemini-1.5-pro')
on conflict (feature_name) do nothing;

alter table public.ai_settings enable row level security;

create table if not exists public.usage_logs (
    id uuid default gen_random_uuid() primary key,
    endpoint text not null,
    tokens_used integer default 0 not null,
    latency_ms integer default 0 not null,
    ip_hash text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.usage_logs enable row level security;

create table if not exists public.conversations (
    id uuid default gen_random_uuid() primary key,
    session_id uuid not null,
    role text not null check (role in ('user', 'assistant')),
    content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.conversations enable row level security;


-- Phase 3 Schema (Secure Client Portal)
-- ==========================================

-- 1. Clients Table (Extends auth.users)
create table if not exists public.clients (
    id uuid references auth.users on delete cascade primary key,
    email text unique,
    company_name text not null,
    industry text,
    setup_status text default 'pending', -- pending, active, archived
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Client Documents Table
create table if not exists public.client_documents (
    id uuid default gen_random_uuid() primary key,
    client_id uuid references public.clients(id) on delete cascade not null,
    title text not null,
    description text,
    file_path text not null, -- Path inside the Supabase Storage bucket
    file_type text default 'application/pdf',
    uploaded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Phase 3 tables
alter table public.clients enable row level security;
alter table public.client_documents enable row level security;

-- RLS Policies for Clients
-- Clients can only read their own profile
create policy "Clients can view own profile" 
on public.clients for select 
using (auth.uid() = id);

-- RLS Policies for Client Documents
-- Clients can only see documents assigned to their client_id
create policy "Clients can view own documents" 
on public.client_documents for select 
using (auth.uid() = client_id);

-- Admins can do everything (we'll define admin by checking a custom role or just disable RLS on API routes using Service Role)
-- For the frontend, clients only need SELECT access.
