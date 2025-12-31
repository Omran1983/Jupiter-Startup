-- ===================================================
-- TITAN SECURITY PATCH: 2025-12-31
-- Objective: Harden 'credit_transactions' & 'feedback'
-- ===================================================

-- 1. Secure Money Trail (Credits)
alter table public.credit_transactions enable row level security;

create policy "Users can read own credits" on public.credit_transactions
for select using (auth.uid() = user_id);

-- Only Service Role can insert credits (No user manipulation)
-- No insert/update policy for public/authenticated users = Implicit Deny.

-- 2. Secure Feedback
alter table public.feedback enable row level security;

-- Users can insert feedback
create policy "Anyone can submit feedback" on public.feedback
for insert with check (true);

-- Users CANNOT read feedback (Admin only via Dashboards)
-- (We removed the 'Read' policy because feedback is anonymous/email-based)

-- 3. Verify Profiles (Double Check)
alter table public.profiles enable row level security;

-- Ensure policy exists if not already
drop policy if exists "Read Own Profile" on public.profiles;
create policy "Read Own Profile" on public.profiles
for select using (auth.uid() = user_id);

-- ===================================================
-- PATCH COMPLETE: Data is now Isolated.
-- ===================================================
