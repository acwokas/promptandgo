-- Packs and e-commerce schema for PRO prompts and packs, plus subscriptions

-- 1) Packs table
CREATE TABLE IF NOT EXISTS public.packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price_cents INTEGER NOT NULL DEFAULT 999, -- base price e.g. 9.99 USD
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.packs ENABLE ROW LEVEL SECURITY;

-- Public can read packs
DROP POLICY IF EXISTS "Public can view packs" ON public.packs;
DROP POLICY IF EXISTS "Public can view packs" ON public.packs;
create policy "Public can view packs"
ON public.packs FOR SELECT
USING (true);

-- Admins can manage packs
DROP POLICY IF EXISTS "Admins can insert packs" ON public.packs;
DROP POLICY IF EXISTS "Admins can insert packs" ON public.packs;
create policy "Admins can insert packs"
ON public.packs FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update packs" ON public.packs;
DROP POLICY IF EXISTS "Admins can update packs" ON public.packs;
create policy "Admins can update packs"
ON public.packs FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can delete packs" ON public.packs;
DROP POLICY IF EXISTS "Admins can delete packs" ON public.packs;
create policy "Admins can delete packs"
ON public.packs FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Trigger to update updated_at on packs
DROP TRIGGER IF EXISTS update_packs_updated_at ON public.packs;
CREATE TRIGGER update_packs_updated_at
BEFORE UPDATE ON public.packs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();


-- 2) Mapping prompts to packs
CREATE TABLE IF NOT EXISTS public.pack_prompts (
  pack_id UUID NOT NULL REFERENCES public.packs(id) ON DELETE CASCADE,
  prompt_id UUID NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (pack_id, prompt_id)
);

ALTER TABLE public.pack_prompts ENABLE ROW LEVEL SECURITY;

-- Public can read mappings
DROP POLICY IF EXISTS "Public can view pack_prompts" ON public.pack_prompts;
DROP POLICY IF EXISTS "Public can view pack_prompts" ON public.pack_prompts;
create policy "Public can view pack_prompts"
ON public.pack_prompts FOR SELECT
USING (true);

-- Admins can manage mappings
DROP POLICY IF EXISTS "Admins can modify pack_prompts" ON public.pack_prompts;
DROP POLICY IF EXISTS "Admins can modify pack_prompts" ON public.pack_prompts;
create policy "Admins can modify pack_prompts"
ON public.pack_prompts FOR ALL
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


-- 3) Orders for payments (one-off and subscriptions)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE,
  amount INTEGER,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'pending', -- pending | paid | failed | canceled
  mode TEXT NOT NULL CHECK (mode IN ('payment','subscription')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
DROP POLICY IF EXISTS "select_own_orders" ON public.orders;
DROP POLICY IF EXISTS "select_own_orders" ON public.orders;
create policy "select_own_orders"
ON public.orders FOR SELECT
USING (user_id = auth.uid());

-- Note: Inserts/updates will be done by Edge Functions using service role (bypass RLS)

-- Trigger for updated_at on orders
DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);


-- 4) Order items
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('prompt','pack','subscription')),
  item_id UUID, -- references prompts.id or packs.id depending on item_type (nullable for subscription)
  title TEXT,
  unit_amount INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Users can view items of their own orders
DROP POLICY IF EXISTS "select_items_for_own_orders" ON public.order_items;
DROP POLICY IF EXISTS "select_items_for_own_orders" ON public.order_items;
create policy "select_items_for_own_orders"
ON public.order_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_id AND o.user_id = auth.uid()
  )
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);


-- 5) Granting access after purchase (per-prompt and per-pack)
CREATE TABLE IF NOT EXISTS public.prompt_access (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_id UUID NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, prompt_id)
);

ALTER TABLE public.prompt_access ENABLE ROW LEVEL SECURITY;

-- Users can view their own prompt access
DROP POLICY IF EXISTS "select_own_prompt_access" ON public.prompt_access;
DROP POLICY IF EXISTS "select_own_prompt_access" ON public.prompt_access;
create policy "select_own_prompt_access"
ON public.prompt_access FOR SELECT
USING (user_id = auth.uid());

-- Edge functions (service role) will insert rows; allow generic insert/update/delete (service role bypasses RLS)

CREATE TABLE IF NOT EXISTS public.pack_access (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pack_id UUID NOT NULL REFERENCES public.packs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, pack_id)
);

ALTER TABLE public.pack_access ENABLE ROW LEVEL SECURITY;

-- Users can view their own pack access
DROP POLICY IF EXISTS "select_own_pack_access" ON public.pack_access;
DROP POLICY IF EXISTS "select_own_pack_access" ON public.pack_access;
create policy "select_own_pack_access"
ON public.pack_access FOR SELECT
USING (user_id = auth.uid());


-- 6) Subscribers table (for recurring access)
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT,
  subscription_end TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "select_own_subscription" ON public.subscribers;
create policy "select_own_subscription"
ON public.subscribers FOR SELECT
USING (user_id = auth.uid() OR email = auth.email());

DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;
create policy "update_own_subscription"
ON public.subscribers FOR UPDATE
USING (true);

DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;
create policy "insert_subscription"
ON public.subscribers FOR INSERT
WITH CHECK (true);

-- Trigger to update updated_at on subscribers
DROP TRIGGER IF EXISTS update_subscribers_updated_at ON public.subscribers;
CREATE TRIGGER update_subscribers_updated_at
BEFORE UPDATE ON public.subscribers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();


-- Explicit Data API privileges (Supabase new-table defaults, 30 October 2026).
-- Per-table rights accompany existing RLS and policies; no default privileges change.
ALTER TABLE public."order_items" ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON TABLE public."order_items" TO authenticated;
GRANT SELECT, INSERT ON TABLE public."order_items" TO service_role;
DO $grants_sequence$ DECLARE seq text; BEGIN
  FOR seq IN SELECT pg_get_serial_sequence('public."order_items"', a.attname)
    FROM pg_attribute a WHERE a.attrelid='public."order_items"'::regclass AND a.attnum>0 AND NOT a.attisdropped
  LOOP IF seq IS NOT NULL THEN
    EXECUTE format('GRANT USAGE ON SEQUENCE %s TO service_role',seq);
  END IF; END LOOP;
END $grants_sequence$;

ALTER TABLE public."orders" ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON TABLE public."orders" TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public."orders" TO service_role;
DO $grants_sequence$ DECLARE seq text; BEGIN
  FOR seq IN SELECT pg_get_serial_sequence('public."orders"', a.attname)
    FROM pg_attribute a WHERE a.attrelid='public."orders"'::regclass AND a.attnum>0 AND NOT a.attisdropped
  LOOP IF seq IS NOT NULL THEN
    EXECUTE format('GRANT USAGE ON SEQUENCE %s TO service_role',seq);
  END IF; END LOOP;
END $grants_sequence$;

ALTER TABLE public."pack_access" ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON TABLE public."pack_access" TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public."pack_access" TO service_role;
DO $grants_sequence$ DECLARE seq text; BEGIN
  FOR seq IN SELECT pg_get_serial_sequence('public."pack_access"', a.attname)
    FROM pg_attribute a WHERE a.attrelid='public."pack_access"'::regclass AND a.attnum>0 AND NOT a.attisdropped
  LOOP IF seq IS NOT NULL THEN
    EXECUTE format('GRANT USAGE ON SEQUENCE %s TO service_role',seq);
  END IF; END LOOP;
END $grants_sequence$;

ALTER TABLE public."pack_prompts" ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON TABLE public."pack_prompts" TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."pack_prompts" TO authenticated;
DO $grants_sequence$ DECLARE seq text; BEGIN
  FOR seq IN SELECT pg_get_serial_sequence('public."pack_prompts"', a.attname)
    FROM pg_attribute a WHERE a.attrelid='public."pack_prompts"'::regclass AND a.attnum>0 AND NOT a.attisdropped
  LOOP IF seq IS NOT NULL THEN
    EXECUTE format('GRANT USAGE ON SEQUENCE %s TO authenticated',seq);
  END IF; END LOOP;
END $grants_sequence$;

ALTER TABLE public."packs" ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON TABLE public."packs" TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."packs" TO authenticated;
DO $grants_sequence$ DECLARE seq text; BEGIN
  FOR seq IN SELECT pg_get_serial_sequence('public."packs"', a.attname)
    FROM pg_attribute a WHERE a.attrelid='public."packs"'::regclass AND a.attnum>0 AND NOT a.attisdropped
  LOOP IF seq IS NOT NULL THEN
    EXECUTE format('GRANT USAGE ON SEQUENCE %s TO authenticated',seq);
  END IF; END LOOP;
END $grants_sequence$;

ALTER TABLE public."prompt_access" ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON TABLE public."prompt_access" TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public."prompt_access" TO service_role;
DO $grants_sequence$ DECLARE seq text; BEGIN
  FOR seq IN SELECT pg_get_serial_sequence('public."prompt_access"', a.attname)
    FROM pg_attribute a WHERE a.attrelid='public."prompt_access"'::regclass AND a.attnum>0 AND NOT a.attisdropped
  LOOP IF seq IS NOT NULL THEN
    EXECUTE format('GRANT USAGE ON SEQUENCE %s TO service_role',seq);
  END IF; END LOOP;
END $grants_sequence$;
