// Lightweight cart utilities using localStorage
// Items: { id: string, type: 'prompt' | 'pack', title: string, unitAmountCents: number, quantity: number }

import { supabase } from "@/integrations/supabase/client";

export type CartItem = {
  id: string;
  type: 'prompt' | 'pack' | 'subscription' | 'lifetime';
  title: string;
  unitAmountCents: number;
  quantity: number;
};

const KEY = 'pag_cart_v1';

export function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as CartItem[];
    return [];
  } catch {
    return [];
  }
}

// Get cart only if user is authenticated
export function getCartForUser(isAuthenticated: boolean): CartItem[] {
  if (!isAuthenticated) {
    return [];
  }
  return getCart();
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('cart:change'));
}

export function addToCart(newItem: CartItem, isAuthenticated: boolean = true) {
  // Only allow adding to cart if user is authenticated
  if (!isAuthenticated) {
    return;
  }
  
  const items = getCart();
  // merge by id+type
  const idx = items.findIndex((i) => i.id === newItem.id && i.type === newItem.type);
  if (idx >= 0) {
    items[idx] = { ...items[idx], quantity: items[idx].quantity + newItem.quantity };
  } else {
    items.push(newItem);
  }
  saveCart(items);
}

export function removeFromCart(id: string, type: CartItem['type'], isAuthenticated: boolean = true) {
  // Only allow removing from cart if user is authenticated
  if (!isAuthenticated) {
    return;
  }
  
  const items = getCart().filter((i) => !(i.id === id && i.type === type));
  saveCart(items);
}

export function clearCart() {
  saveCart([]);
}

// Clear cart when user logs out
export function clearCartOnLogout() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent('cart:change'));
}

export function getCartCount(isAuthenticated: boolean = true): number {
  return getCartForUser(isAuthenticated).reduce((sum, i) => sum + i.quantity, 0);
}

export function getCartTotalCents(isAuthenticated: boolean = true): number {
  return getCartForUser(isAuthenticated).reduce((sum, i) => sum + i.unitAmountCents * i.quantity, 0);
}
