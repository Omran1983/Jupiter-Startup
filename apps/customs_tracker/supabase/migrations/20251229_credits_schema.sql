
-- 1. Create Profiles Table (Linked to Auth)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  credit_balance int default 0,
  created_at timestamptz default now()
);

-- 2. Create Credit Transactions Log (Audit Trail)
create table public.credit_transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id),
  amount int not null, -- Positive for purchase, Negative for usage
  description text, -- "Pack Purchase", "Report Generation"
  created_at timestamptz default now()
);

-- 3. RLS Policies
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using ( auth.uid() = id );

-- Only Service Role can update balance (via Webhook or Server Action)
-- Users cannot update their own balance directly.
