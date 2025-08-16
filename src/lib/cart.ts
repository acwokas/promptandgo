// Lightweight cart utilities using localStorage
// Items: { id: string, type: 'prompt' | 'pack', title: string, unitAmountCents: number, quantity: number }

import { supabase } from "@/integrations/supabase/client";

export type CartItem = {
  id: string;
  type: 'prompt' | 'pack' | 'membership' | 'lifetime';
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
  
  // Allow adding any items - just merge by id+type
  const idx = items.findIndex((i) => i.id === newItem.id && i.type === newItem.type);
  if (idx >= 0) {
    items[idx] = { ...items[idx], quantity: items[idx].quantity + newItem.quantity };
  } else {
    items.push(newItem);
  }
  saveCart(items);
}

// Add items to favorites for when membership activates
export async function addToMyPrompts(itemIds: string[], itemType: 'prompt' | 'pack'): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    if (itemType === 'prompt') {
      const { error } = await supabase
        .from('favorites')
        .upsert(
          itemIds.map(id => ({ user_id: user.id, prompt_id: id })),
          { onConflict: 'user_id,prompt_id' }
        );
      return !error;
    }
    // For packs, we'd need to get all prompts in the pack and add them
    return true;
  } catch (error) {
    console.error('Error adding to My Prompts:', error);
    return false;
  }
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
  const cartItems = getCartForUser(isAuthenticated);
  const hasLifetime = cartItems.some((i) => i.type === 'lifetime');
  const hasMembership = cartItems.some((i) => i.type === 'membership');
  
  return cartItems.reduce((sum, i) => {
    // If lifetime is in cart, everything else is free
    if (hasLifetime && i.type !== 'lifetime') {
      return sum;
    }
    // If only membership (no lifetime), prompts and packs are free
    if (!hasLifetime && hasMembership && (i.type === 'prompt' || i.type === 'pack')) {
      return sum;
    }
    return sum + i.unitAmountCents * i.quantity;
  }, 0);
}
