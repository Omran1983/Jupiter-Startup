
-- ==========================================
-- TITAN UNIFIED SETUP (CLEAN RESET)
-- WARNING: This deletes existing data in these tables.
-- ==========================================

-- 0. CLEANUP (Fixes the "column does not exist" errors)
drop table if exists public.credit_transactions cascade;
drop table if exists public.audit_logs cascade;
drop table if exists public.runs cascade;
drop table if exists public.profiles cascade;
drop table if exists public.org_members cascade;
drop table if exists public.orgs cascade;

-- 1. Extensions
create extension if not exists pgcrypto;

-- 2. Core Tables (Orgs & Members)
create table public.orgs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table public.org_members (
  org_id uuid not null references public.orgs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member',
  primary key (org_id, user_id)
);

-- 3. Profiles (The Identity Table)
-- We handle both "user_id" (Core style) and ensure linking.
create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  credit_balance int default 0, -- Added for Customs Tracker
  created_at timestamptz not null default now()
);

-- 4. Tracking Tables (Runs & Artifacts)
create table public.runs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.orgs(id) on delete cascade, -- Optional for B2C
  user_id uuid references auth.users(id),
  status text not null default 'created',
  input_payload jsonb default '{}'::jsonb,
  output_summary jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- 5. Credit Ledger (The Money Trail)
create table public.credit_transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(user_id),
  amount int not null,
  description text,
  created_at timestamptz default now()
);

-- 6. Functions & Triggers (Auto-Profile Creation)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, email, credit_balance)
  values (new.id, new.email, 0);
  return new;
end;
$$;

-- Trigger on Auth.Users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 7. RLS Policies (Security)
alter table public.profiles enable row level security;
alter table public.runs enable row level security;
alter table public.orgs enable row level security;

-- Users can read their own profile
create policy "Read Own Profile" on public.profiles
  for select using (auth.uid() = user_id);

-- Users can read their own runs
create policy "Read Own Runs" on public.runs
  for select using (auth.uid() = user_id);

-- Service Role (Key) has full access by default.

-- ==========================================
-- SETUP COMPLETE
-- ==========================================
