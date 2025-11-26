-- Supabase schema for Nutrition Solutions AI Sales Coach

-- Extension
create extension if not exists vector;

-- user_profiles table
create table if not exists public.user_profiles (
  id uuid primary key,
  name text,
  age integer,
  gender text check (gender in ('male','female','nonbinary','prefer_not')),
  primary_goal text check (primary_goal in ('fat_loss','muscle_gain','recomp')),
  cooking_preference boolean,
  eating_habits text,
  emotional_why text,
  support_level integer,
  objection text,
  recommended_plan text,
  returning_user boolean default false,
  last_seen timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- session_history table
create table if not exists public.session_history (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  messages jsonb default '[]'::jsonb,
  started_at timestamptz default now() not null,
  last_message_at timestamptz
);

-- rag_documents table
create table if not exists public.rag_documents (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  content_type varchar(50) not null,
  title varchar(255),
  metadata jsonb default '{}'::jsonb,
  embedding vector,
  category varchar(100),
  priority integer default 5,
  last_updated timestamptz default now(),
  created_at timestamptz default now() not null
);

-- Triggers
create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_user_profiles_updated_at on public.user_profiles;
create trigger trg_user_profiles_updated_at
before update on public.user_profiles
for each row execute function public.set_updated_at();

-- Indexes
create index if not exists idx_rag_content_type on public.rag_documents using btree (content_type);
create index if not exists idx_rag_category on public.rag_documents using btree (category);
create index if not exists idx_rag_priority on public.rag_documents using btree (priority desc);
create index if not exists idx_rag_embedding on public.rag_documents using ivfflat (embedding vector_cosine_ops) with (lists = 100);
create index if not exists idx_session_history_user on public.session_history(user_id);
create index if not exists idx_user_profiles_last_seen on public.user_profiles(last_seen);

-- RLS (enable and allow service role)
alter table public.user_profiles enable row level security;
alter table public.session_history enable row level security;
alter table public.rag_documents enable row level security;

create policy if not exists "user_profiles_service_role" on public.user_profiles
  for all using (auth.role() = 'service_role') with check (true);

create policy if not exists "session_history_service_role" on public.session_history
  for all using (auth.role() = 'service_role') with check (true);

create policy if not exists "rag_documents_service_role" on public.rag_documents
  for all using (auth.role() = 'service_role') with check (true);

-- RPC: match_rag_documents (requires pgvector)
create or replace function public.match_rag_documents(
  query_text text,
  query_embedding vector default null,
  category text default null,
  filters jsonb default null,
  match_count int default 4,
  min_score float default 0.78
) returns table (
  id uuid,
  content text,
  category text,
  title text,
  metadata jsonb,
  score float
) language plpgsql as $$
declare
  embed vector;
begin
  -- Use provided embedding if present; otherwise, fall back to a zero vector placeholder.
  embed := coalesce(query_embedding, (select array[0.0]::vector));

  return query
  select d.id, d.content, d.category, d.title, d.metadata,
         1 - (d.embedding <=> embed) as score
  from public.rag_documents d
  where d.embedding is not null
    and (category is null or d.category = category)
    and (filters is null or d.metadata @> filters)
    and 1 - (d.embedding <=> embed) >= min_score
  order by score desc
  limit match_count;
end;
$$;
