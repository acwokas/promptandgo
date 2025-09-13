import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useToast } from "@/components/ui/use-toast";
import { useEnsureProfile } from "@/hooks/useEnsureProfile";
import { useEffect, useState } from "react";
import { getCartCount, clearCartOnLogout } from "@/lib/cart";

const Header = () => {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  useEnsureProfile();

  const [cartCount, setCartCount] = useState<number>(getCartCount(!!user));
  
  useEffect(() => {
    const onChange = () => setCartCount(getCartCount(!!user));
    window.addEventListener('cart:change', onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener('cart:change', onChange);
      window.removeEventListener('storage', onChange);
    };
  }, [user]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.warn("Normal signout failed, forcing local signout:", error.message);
        await supabase.auth.signOut({ scope: 'local' });
      }
      clearCartOnLogout();
      toast({ title: "Signed out successfully" });
    } catch (err: any) {
      console.error("All signout methods failed, clearing local state:", err);
      await supabase.auth.signOut({ scope: 'local' });
      clearCartOnLogout();
      toast({ title: "Signed out" });
    }
  };

  useEffect(() => {
    if (!user) {
      clearCartOnLogout();
    }
  }, [user]);

  return (
    <div 
      style={{
        width: '100%',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: '0',
        zIndex: '999',
        padding: '0',
        margin: '0'
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '56px',
          boxSizing: 'border-box'
        }}
      >
        {/* Logo */}
        <Link 
          to="/" 
          style={{ 
            display: 'flex', 
            alignItems: 'center',
            textDecoration: 'none',
            flexShrink: '0'
          }}
        >
          <img
            src="/lovable-uploads/99652d74-cac3-4e8f-ad70-8d2b77303b54.png"
            alt="promptandgo"
            style={{ 
              height: '24px', 
              width: 'auto',
              maxWidth: '80px',
              objectFit: 'contain',
              display: 'block'
            }}
          />
        </Link>
        
        {/* Right Actions */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            flexShrink: '0'
          }}
        >
          {/* CTA */}
          {user ? (
            <Link 
              to="/library?random=1"
              style={{
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                padding: '6px 12px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '14px',
                whiteSpace: 'nowrap',
                display: 'inline-block'
              }}
            >
              Inspire Me!
            </Link>
          ) : (
            <Link 
              to="/auth?mode=signup"
              style={{
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                padding: '6px 12px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '14px',
                whiteSpace: 'nowrap',
                display: 'inline-block'
              }}
            >
              Get FREE Pack!
            </Link>
          )}
          
          {/* Cart */}
          <Link 
            to="/cart"
            style={{
              position: 'relative',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              color: '#374151'
            }}
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span 
                style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  fontSize: '10px',
                  borderRadius: '50%',
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>
          
          {/* User/Login */}
          {user ? (
            <Link 
              to="/account"
              style={{
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                color: '#374151'
              }}
            >
              <User size={20} />
            </Link>
          ) : (
            <Link 
              to="/auth"
              style={{
                padding: '6px 12px',
                textDecoration: 'none',
                fontSize: '14px',
                color: '#374151',
                whiteSpace: 'nowrap'
              }}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;