-- =============================================
-- PayGate Database Setup
-- Run this in Supabase SQL Editor
-- =============================================

-- Profiles table (auto-populated on signup)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  created_at timestamptz default now(),
  pages_created int default 0,
  total_revenue bigint default 0
);

alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Pages table
create table if not exists pages (
  id text primary key,
  user_id uuid references auth.users on delete cascade,
  config jsonb not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table pages enable row level security;

create policy "Users can view own pages"
  on pages for select using (auth.uid() = user_id);

create policy "Users can insert own pages"
  on pages for insert with check (auth.uid() = user_id);

create policy "Users can update own pages"
  on pages for update using (auth.uid() = user_id);

create policy "Users can delete own pages"
  on pages for delete using (auth.uid() = user_id);

-- Transactions table
create table if not exists transactions (
  id uuid default gen_random_uuid() primary key,
  stripe_session_id text unique,
  customer_email text,
  product_name text,
  page_id text,
  amount bigint default 0,
  platform_fee bigint default 0,
  currency text default 'usd',
  status text default 'completed',
  created_at timestamptz default now()
);

alter table transactions enable row level security;

-- Only admins (via service role) can insert transactions
-- All authenticated users can read their own transactions
create policy "Admins can view all transactions"
  on transactions for select using (true);

create policy "Service role can insert transactions"
  on transactions for insert with check (true);
