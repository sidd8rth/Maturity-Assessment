-- ===================================================================
--  Airtel Secure Readiness Check — Supabase schema
--  Run this once in Supabase SQL Editor (Dashboard → SQL → New query).
-- ===================================================================

-- ── Profiles (extends auth.users with our own fields) ─────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  company     text,
  job_title   text,
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles select own" on public.profiles;
create policy "profiles select own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles upsert own" on public.profiles;
create policy "profiles upsert own"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Assessments (one row per completed readiness check) ──────────────
create table if not exists public.assessments (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  industry     text not null,
  environment  text not null,
  org_size     text not null,
  answers      jsonb not null,           -- array of selected option indices or null
  score        int  not null,
  tier         text not null,            -- 'Basic' | 'Developing' | 'Established' | 'Advanced'
  payload      jsonb not null,           -- full computed snapshot (domain scores, picks, etc.)
  created_at   timestamptz not null default now()
);

create index if not exists assessments_user_created_idx
  on public.assessments (user_id, created_at desc);

alter table public.assessments enable row level security;

drop policy if exists "assessments select own" on public.assessments;
create policy "assessments select own"
  on public.assessments for select
  using (auth.uid() = user_id);

drop policy if exists "assessments insert own" on public.assessments;
create policy "assessments insert own"
  on public.assessments for insert
  with check (auth.uid() = user_id);

drop policy if exists "assessments delete own" on public.assessments;
create policy "assessments delete own"
  on public.assessments for delete
  using (auth.uid() = user_id);
