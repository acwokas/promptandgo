-- Allow users to delete their own orders
DROP POLICY IF EXISTS "Users can delete their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can delete their own orders" ON public.orders;
CREATE POLICY "Users can delete their own orders" 
ON public.orders 
FOR DELETE 
USING (user_id = auth.uid());

-- Allow users to delete order items for their own orders
DROP POLICY IF EXISTS "Users can delete items for their own orders" ON public.order_items;
DROP POLICY IF EXISTS "Users can delete items for their own orders" ON public.order_items;
CREATE POLICY "Users can delete items for their own orders" 
ON public.order_items 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM orders o 
  WHERE o.id = order_items.order_id 
  AND o.user_id = auth.uid()
));

-- Explicit Data API privileges (Supabase new-table defaults, 30 October 2026).
-- Per-table rights accompany existing RLS and policies; no default privileges change.
ALTER TABLE public."order_items" ENABLE ROW LEVEL SECURITY;
GRANT SELECT, DELETE ON TABLE public."order_items" TO authenticated;
GRANT SELECT, INSERT ON TABLE public."order_items" TO service_role;
DO $grants_sequence$ DECLARE seq text; BEGIN
  FOR seq IN SELECT pg_get_serial_sequence('public."order_items"', a.attname)
    FROM pg_attribute a WHERE a.attrelid='public."order_items"'::regclass AND a.attnum>0 AND NOT a.attisdropped
  LOOP IF seq IS NOT NULL THEN
    EXECUTE format('GRANT USAGE ON SEQUENCE %s TO service_role',seq);
  END IF; END LOOP;
END $grants_sequence$;

ALTER TABLE public."orders" ENABLE ROW LEVEL SECURITY;
GRANT SELECT, DELETE ON TABLE public."orders" TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public."orders" TO service_role;
DO $grants_sequence$ DECLARE seq text; BEGIN
  FOR seq IN SELECT pg_get_serial_sequence('public."orders"', a.attname)
    FROM pg_attribute a WHERE a.attrelid='public."orders"'::regclass AND a.attnum>0 AND NOT a.attisdropped
  LOOP IF seq IS NOT NULL THEN
    EXECUTE format('GRANT USAGE ON SEQUENCE %s TO service_role',seq);
  END IF; END LOOP;
END $grants_sequence$;
