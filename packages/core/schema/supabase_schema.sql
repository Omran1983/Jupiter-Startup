-- ============================
-- TITAN-BIZ Core Schema (Prod)
-- ============================

-- Extensions
create extension if not exists pgcrypto;

-- ----------------------------
-- Orgs & Membership
-- ----------------------------
create table if not exists public.orgs (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  created_at timestamptz not null default now()
);

-- Note: auth.users lives in auth schema. Referencing is allowed:
-- references auth.users(id)
create table if not exists public.org_members (
  org_id uuid not null references public.orgs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','admin','member')),
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);

create index if not exists idx_org_members_user on public.org_members(user_id);
create index if not exists idx_org_members_org on public.org_members(org_id);

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  created_at timestamptz not null default now()
);

-- ----------------------------
-- Plans / Entitlements
-- ----------------------------
create table if not exists public.plans (
  id text primary key, -- e.g. starter/pro/business
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.plans(id, name)
values ('starter','Starter'), ('pro','Pro'), ('business','Business')
on conflict (id) do nothing;

create table if not exists public.org_entitlements (
  org_id uuid not null references public.orgs(id) on delete cascade,
  feature text not null, -- e.g. customs_tracker, research_vault, exports_pdf, team
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (org_id, feature)
);

-- ----------------------------
-- Workflows / Templates / Runs / Artifacts
-- ----------------------------
create table if not exists public.workflows (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  name text not null,
  description text,
  category text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_workflows_org on public.workflows(org_id);

create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  name text not null,
  version int not null default 1 check (version >= 1),
  input_schema jsonb not null default '{}'::jsonb,
  render_schema jsonb not null default '{}'::jsonb,
  template_body text not null default '',
  created_at timestamptz not null default now(),
  unique (org_id, workflow_id, name, version)
);

create index if not exists idx_templates_org on public.templates(org_id);
create index if not exists idx_templates_workflow on public.templates(workflow_id);

create table if not exists public.runs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  workflow_id uuid not null references public.workflows(id),
  template_id uuid references public.templates(id),
  user_id uuid references auth.users(id),
  status text not null default 'created'
    check (status in ('created','running','succeeded','failed')),
  input_payload jsonb not null default '{}'::jsonb,
  output_summary jsonb not null default '{}'::jsonb,
  error text,
  created_at timestamptz not null default now()
);

create index if not exists idx_runs_org on public.runs(org_id);
create index if not exists idx_runs_workflow on public.runs(workflow_id);
create index if not exists idx_runs_user on public.runs(user_id);

create table if not exists public.artifacts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  run_id uuid not null references public.runs(id) on delete cascade,
  type text not null check (type in ('pdf','csv','docx','json')),
  storage_path text not null,
  public_url text,
  created_at timestamptz not null default now()
);

create index if not exists idx_artifacts_org on public.artifacts(org_id);
create index if not exists idx_artifacts_run on public.artifacts(run_id);

-- ----------------------------
-- Audit / Consents / Risk Flags
-- ----------------------------
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  user_id uuid references auth.users(id),
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_org on public.audit_logs(org_id);
create index if not exists idx_audit_user on public.audit_logs(user_id);

create table if not exists public.consents (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  user_id uuid references auth.users(id),
  type text not null check (type in ('terms','disclaimer','privacy')),
  version text not null,
  accepted_at timestamptz not null default now(),
  unique (org_id, user_id, type, version)
);

create table if not exists public.risk_flags (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  run_id uuid references public.runs(id) on delete cascade,
  flag text not null,
  notes text,
  created_at timestamptz not null default now()
);

-- Enforce immutability of audit_logs (no updates/deletes)
create or replace function public.titan_block_audit_mutations()
returns trigger
language plpgsql
as $$
begin
  raise exception 'audit_logs is immutable';
end;
$$;

drop trigger if exists trg_block_audit_update on public.audit_logs;
create trigger trg_block_audit_update
before update on public.audit_logs
for each row execute function public.titan_block_audit_mutations();

drop trigger if exists trg_block_audit_delete on public.audit_logs;
create trigger trg_block_audit_delete
before delete on public.audit_logs
for each row execute function public.titan_block_audit_mutations();

-- ----------------------------
-- Billing (Stripe mapping)
-- ----------------------------
create table if not exists public.billing_customers (
  org_id uuid primary key references public.orgs(id) on delete cascade,
  stripe_customer_id text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  plan_id text not null references public.plans(id),
  stripe_subscription_id text not null unique,
  status text not null,
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_subscriptions_org on public.subscriptions(org_id);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  stripe_payment_intent_id text not null unique,
  amount int not null check (amount >= 0),
  currency text not null default 'usd',
  status text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_payments_org on public.payments(org_id);

-- ----------------------------
-- Research Vault (ToS-safe)
-- ----------------------------
create table if not exists public.dossiers (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  created_by uuid references auth.users(id),
  title text not null,
  tags text[] not null default '{}'::text[],
  created_at timestamptz not null default now()
);

create index if not exists idx_dossiers_org on public.dossiers(org_id);

create table if not exists public.dossier_items (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  dossier_id uuid not null references public.dossiers(id) on delete cascade,
  type text not null check (type in ('link','note','file','snippet')),
  url text,
  note text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_dossier_items_org on public.dossier_items(org_id);
create index if not exists idx_dossier_items_dossier on public.dossier_items(dossier_id);

-- ----------------------------
-- Atomic org creation function
-- ----------------------------
create or replace function public.create_org(p_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
begin
  if p_name is null or char_length(trim(p_name)) < 2 then
    raise exception 'org name too short';
  end if;

  insert into public.orgs(name) values (trim(p_name)) returning id into v_org_id;

  -- caller becomes owner
  insert into public.org_members(org_id, user_id, role)
  values (v_org_id, auth.uid(), 'owner');

  return v_org_id;
end;
$$;
