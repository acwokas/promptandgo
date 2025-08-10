-- Create profiles table without FK to auth.users (to avoid reserved schema dependencies)
create table if not exists public.profiles (
  id uuid primary key,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Allow anyone to read profiles (public profiles)
create policy if not exists "Profiles are viewable by everyone"
  on public.profiles
  for select
  using (true);

-- Allow users to insert their own profile (id must match auth uid)
create policy if not exists "Users can insert their own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

-- Allow users to update their own profile
create policy if not exists "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

-- Timestamp trigger function (idempotent)
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Attach trigger to profiles
create trigger if not exists update_profiles_updated_at
before update on public.profiles
for each row execute function public.update_updated_at_column();