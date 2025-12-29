-- ============================
-- TITAN-BIZ RLS Policies
-- ============================

-- Enable RLS
alter table public.orgs enable row level security;
alter table public.org_members enable row level security;
alter table public.profiles enable row level security;

alter table public.workflows enable row level security;
alter table public.templates enable row level security;
alter table public.runs enable row level security;
alter table public.artifacts enable row level security;

alter table public.audit_logs enable row level security;
alter table public.consents enable row level security;
alter table public.risk_flags enable row level security;

alter table public.billing_customers enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;

alter table public.dossiers enable row level security;
alter table public.dossier_items enable row level security;

-- Helper: is member of org
create or replace function public.is_org_member(p_org_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.org_members m
    where m.org_id = p_org_id and m.user_id = auth.uid()
  );
$$;

-- Helper: is admin/owner
create or replace function public.is_org_admin(p_org_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.org_members m
    where m.org_id = p_org_id
      and m.user_id = auth.uid()
      and m.role in ('owner','admin')
  );
$$;

-- orgs: members can read their org; creation handled via create_org()
create policy orgs_select_member on public.orgs
for select using (public.is_org_member(id));

-- org_members: members can read membership for their org
create policy org_members_select_member on public.org_members
for select using (public.is_org_member(org_id));

-- org_members: only admins can insert/update/delete memberships (team mgmt)
create policy org_members_mutate_admin on public.org_members
for insert with check (public.is_org_admin(org_id));

create policy org_members_update_admin on public.org_members
for update using (public.is_org_admin(org_id))
with check (public.is_org_admin(org_id));

create policy org_members_delete_admin on public.org_members
for delete using (public.is_org_admin(org_id));

-- profiles: user can read/update own profile
create policy profiles_select_own on public.profiles
for select using (user_id = auth.uid());

create policy profiles_update_own on public.profiles
for update using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy profiles_insert_own on public.profiles
for insert with check (user_id = auth.uid());

-- Core tables: org scoping
create policy workflows_org_scope on public.workflows
for all using (public.is_org_member(org_id))
with check (public.is_org_member(org_id));

create policy templates_org_scope on public.templates
for all using (public.is_org_member(org_id))
with check (public.is_org_member(org_id));

create policy runs_org_scope on public.runs
for all using (public.is_org_member(org_id))
with check (public.is_org_member(org_id));

create policy artifacts_org_scope on public.artifacts
for all using (public.is_org_member(org_id))
with check (public.is_org_member(org_id));

create policy consents_org_scope on public.consents
for all using (public.is_org_member(org_id))
with check (public.is_org_member(org_id));

create policy risk_flags_org_scope on public.risk_flags
for all using (public.is_org_member(org_id))
with check (public.is_org_member(org_id));

-- audit_logs: members can read; only allow inserts (updates/deletes blocked by trigger anyway)
create policy audit_select_member on public.audit_logs
for select using (public.is_org_member(org_id));

create policy audit_insert_member on public.audit_logs
for insert with check (public.is_org_member(org_id));

-- Billing: members can read their org billing rows
create policy billing_customers_select on public.billing_customers
for select using (public.is_org_member(org_id));

create policy subscriptions_select on public.subscriptions
for select using (public.is_org_member(org_id));

create policy payments_select on public.payments
for select using (public.is_org_member(org_id));

-- IMPORTANT:
-- Write operations for billing should be done by server webhook using service_role key.
-- You can leave inserts/updates blocked under anon/auth roles (default deny).

-- Dossiers: org scoped
create policy dossiers_org_scope on public.dossiers
for all using (public.is_org_member(org_id))
with check (public.is_org_member(org_id));

create policy dossier_items_org_scope on public.dossier_items
for all using (public.is_org_member(org_id))
with check (public.is_org_member(org_id));
