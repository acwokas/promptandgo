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
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
create policy "Profiles are viewable by everyone"
  on public.profiles
  for select
  using (true);

-- Allow users to insert their own profile (id must match auth uid)
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
create policy "Users can insert their own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

-- Allow users to update their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
create policy "Users can update their own profile"
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
create trigger update_profiles_updated_at
before update on public.profiles
for each row execute function public.update_updated_at_column();

-- Explicit Data API privileges (Supabase new-table defaults, 30 October 2026).
-- Per-table rights accompany existing RLS and policies; no default privileges change.
ALTER TABLE public."profiles" ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON TABLE public."profiles" TO anon;
GRANT SELECT, INSERT, UPDATE ON TABLE public."profiles" TO authenticated;
DO $grants_sequence$ DECLARE seq text; BEGIN
  FOR seq IN SELECT pg_get_serial_sequence('public."profiles"', a.attname)
    FROM pg_attribute a WHERE a.attrelid='public."profiles"'::regclass AND a.attnum>0 AND NOT a.attisdropped
  LOOP IF seq IS NOT NULL THEN
    EXECUTE format('GRANT USAGE ON SEQUENCE %s TO authenticated',seq);
  END IF; END LOOP;
END $grants_sequence$;
