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