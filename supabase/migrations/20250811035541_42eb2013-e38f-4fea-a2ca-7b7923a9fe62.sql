-- Fix: remove IF NOT EXISTS from CREATE POLICY statements

-- Packs table (already created if previous step partially succeeded)
CREATE TABLE IF NOT EXISTS public.packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price_cents INTEGER NOT NULL DEFAULT 999,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.packs ENABLE ROW LEVEL SECURITY;

-- Policies for packs
DO $$ BEGIN
  CREATE POLICY "Public can view packs"
  ON public.packs FOR SELECT
  USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can insert packs"
  ON public.packs FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can update packs"
  ON public.packs FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can delete packs"
  ON public.packs FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DROP TRIGGER IF EXISTS update_packs_updated_at ON public.packs;
CREATE TRIGGER update_packs_updated_at
BEFORE UPDATE ON public.packs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- pack_prompts
CREATE TABLE IF NOT EXISTS public.pack_prompts (
  pack_id UUID NOT NULL REFERENCES public.packs(id) ON DELETE CASCADE,
  prompt_id UUID NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (pack_id, prompt_id)
);
ALTER TABLE public.pack_prompts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Public can view pack_prompts"
  ON public.pack_prompts FOR SELECT
  USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can modify pack_prompts"
  ON public.pack_prompts FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- orders
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE,
  amount INTEGER,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'pending',
  mode TEXT NOT NULL CHECK (mode IN ('payment','subscription')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "select_own_orders"
  ON public.orders FOR SELECT
  USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);

-- order_items
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('prompt','pack','subscription')),
  item_id UUID,
  title TEXT,
  unit_amount INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "select_items_for_own_orders"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.user_id = auth.uid()
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- prompt_access
CREATE TABLE IF NOT EXISTS public.prompt_access (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_id UUID NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, prompt_id)
);
ALTER TABLE public.prompt_access ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "select_own_prompt_access"
  ON public.prompt_access FOR SELECT
  USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- pack_access
CREATE TABLE IF NOT EXISTS public.pack_access (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pack_id UUID NOT NULL REFERENCES public.packs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, pack_id)
);
ALTER TABLE public.pack_access ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "select_own_pack_access"
  ON public.pack_access FOR SELECT
  USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- subscribers
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

DO $$ BEGIN
  CREATE POLICY "select_own_subscription"
  ON public.subscribers FOR SELECT
  USING (user_id = auth.uid() OR email = auth.email());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "update_own_subscription"
  ON public.subscribers FOR UPDATE
  USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "insert_subscription"
  ON public.subscribers FOR INSERT
  WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DROP TRIGGER IF EXISTS update_subscribers_updated_at ON public.subscribers;
CREATE TRIGGER update_subscribers_updated_at
BEFORE UPDATE ON public.subscribers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
