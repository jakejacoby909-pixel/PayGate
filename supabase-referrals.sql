-- =============================================
-- PayGate Referral System Migration
-- Run this in Supabase SQL Editor
-- =============================================

-- Add referral columns to profiles
alter table profiles add column if not exists referral_code text unique;
alter table profiles add column if not exists referred_by text;

-- Auto-generate referral codes for existing users who don't have one
update profiles
set referral_code = substr(md5(id::text || now()::text), 1, 8)
where referral_code is null;

-- Update the handle_new_user trigger to auto-generate referral codes
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, referral_code)
  values (new.id, new.email, substr(md5(new.id::text || now()::text), 1, 8));
  return new;
end;
$$ language plpgsql security definer;

-- Referral commissions table
create table if not exists referral_commissions (
  id uuid default gen_random_uuid() primary key,
  referrer_id uuid references profiles(id) on delete cascade,
  referred_id uuid references profiles(id) on delete cascade,
  transaction_id uuid references transactions(id) on delete cascade,
  amount bigint default 0,
  commission bigint default 0,
  commission_rate numeric default 0.10,
  status text default 'pending',
  created_at timestamptz default now()
);

alter table referral_commissions enable row level security;

-- Referrers can see their own commissions
create policy "Referrers can view own commissions"
  on referral_commissions for select using (referrer_id = auth.uid());

-- Service role can insert commissions (webhooks)
create policy "Service role can insert commissions"
  on referral_commissions for insert with check (true);

-- Index for fast lookups
create index if not exists idx_profiles_referral_code on profiles(referral_code);
create index if not exists idx_profiles_referred_by on profiles(referred_by);
create index if not exists idx_referral_commissions_referrer on referral_commissions(referrer_id);
