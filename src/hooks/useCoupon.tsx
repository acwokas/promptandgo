import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "./useSupabaseAuth";
import { toast } from "./use-toast";

export interface CouponValidation {
  valid: boolean;
  couponId: string | null;
  discountType: 'percentage' | 'fixed_amount' | 'free_pack' | null;
  discountValue: number | null;
  freePackId: string | null;
  message: string;
}

export function useCoupon() {
  const { user } = useSupabaseAuth();
  const [isValidating, setIsValidating] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidation | null>(null);

  const validateCoupon = async (code: string, cartTotalCents: number): Promise<CouponValidation> => {
    if (!user) {
      return {
        valid: false,
        couponId: null,
        discountType: null,
        discountValue: null,
        freePackId: null,
        message: "Please log in to use coupons"
      };
    }

    if (!code || code.trim() === '') {
      return {
        valid: false,
        couponId: null,
        discountType: null,
        discountValue: null,
        freePackId: null,
        message: "Please enter a coupon code"
      };
    }

    setIsValidating(true);

    try {
      const { data, error } = await supabase.rpc('validate_coupon', {
        p_code: code.toUpperCase(),
        p_user_id: user.id,
        p_cart_total_cents: cartTotalCents
      });

      if (error) {
        console.error('Coupon validation error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        return {
          valid: false,
          couponId: null,
          discountType: null,
          discountValue: null,
          freePackId: null,
          message: "Invalid coupon code"
        };
      }

      const result = data[0];
      
      // Map snake_case to camelCase
      const mappedResult: CouponValidation = {
        valid: result.valid,
        couponId: result.coupon_id,
        discountType: result.discount_type as 'percentage' | 'fixed_amount' | 'free_pack' | null,
        discountValue: result.discount_value,
        freePackId: result.free_pack_id,
        message: result.message
      };
      
      if (mappedResult.valid) {
        setAppliedCoupon(mappedResult);
        toast({
          title: "Coupon Applied!",
          description: mappedResult.message,
        });
      } else {
        toast({
          title: "Coupon Invalid",
          description: mappedResult.message,
          variant: "destructive"
        });
      }

      return mappedResult;
    } catch (error: any) {
      console.error('Error validating coupon:', error);
      toast({
        title: "Error",
        description: "Failed to validate coupon code",
        variant: "destructive"
      });
      return {
        valid: false,
        couponId: null,
        discountType: null,
        discountValue: null,
        freePackId: null,
        message: "Error validating coupon"
      };
    } finally {
      setIsValidating(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast({
      title: "Coupon Removed",
      description: "Your coupon has been removed from the cart"
    });
  };

  const calculateDiscount = (cartTotalCents: number): number => {
    if (!appliedCoupon || !appliedCoupon.valid) return 0;

    switch (appliedCoupon.discountType) {
      case 'percentage':
        return Math.floor((cartTotalCents * (appliedCoupon.discountValue || 0)) / 100);
      case 'fixed_amount':
        return Math.min(appliedCoupon.discountValue || 0, cartTotalCents);
      case 'free_pack':
        // For free pack coupons, the discount is applied differently
        // This will be handled in the checkout process
        return 0;
      default:
        return 0;
    }
  };

  return {
    appliedCoupon,
    isValidating,
    validateCoupon,
    removeCoupon,
    calculateDiscount
  };
}
