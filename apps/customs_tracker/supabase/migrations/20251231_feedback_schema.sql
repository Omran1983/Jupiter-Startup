-- Create Feedback Table
create table if not exists feedback (
  id uuid default gen_random_uuid() primary key,
  rating int not null, -- 1 to 5
  comment text,
  email text, -- Optional (for incentive delivery)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS: Allow anyone to insert (anon)
alter table feedback enable row level security;

create policy "Enable insert for everyone" on feedback
  for insert with check (true);

create policy "Enable read for service role only" on feedback
  for select using (auth.role() = 'service_role');
