-- Fix linter warning: set stable search_path for trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO public
AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;