import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Calendar, Percent, DollarSign, Package, Trash2, Plus } from "lucide-react";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import SEO from "@/components/SEO";

interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed_amount' | 'free_pack';
  discount_value: number | null;
  free_pack_id: string | null;
  max_uses: number | null;
  current_uses: number;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;
  description: string | null;
  minimum_purchase_cents: number;
}

interface Pack {
  id: string;
  name: string;
  price_cents: number;
}

export default function AdminCoupons() {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form state
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed_amount' | 'free_pack'>('percentage');
  const [discountValue, setDiscountValue] = useState("");
  const [freePackId, setFreePackId] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [description, setDescription] = useState("");
  const [minimumPurchase, setMinimumPurchase] = useState("");

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchCoupons();
      fetchPacks();
    }
  }, [isAdmin]);

  const fetchCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoupons((data || []) as Coupon[]);
    } catch (error: any) {
      console.error('Error fetching coupons:', error);
      toast({
        title: "Error",
        description: "Failed to load coupons",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPacks = async () => {
    try {
      const { data, error } = await supabase
        .from('packs')
        .select('id, name, price_cents')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setPacks(data || []);
    } catch (error: any) {
      console.error('Error fetching packs:', error);
    }
  };

  const resetForm = () => {
    setCode("");
    setDiscountType('percentage');
    setDiscountValue("");
    setFreePackId("");
    setMaxUses("");
    setValidUntil("");
    setDescription("");
    setMinimumPurchase("");
    setShowCreateForm(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Coupon code is required",
        variant: "destructive"
      });
      return;
    }

    try {
      const couponData: any = {
        code: code.toUpperCase(),
        discount_type: discountType,
        discount_value: discountType !== 'free_pack' && discountValue ? parseInt(discountValue) : null,
        free_pack_id: discountType === 'free_pack' ? freePackId : null,
        max_uses: maxUses ? parseInt(maxUses) : null,
        valid_until: validUntil || null,
        description: description || null,
        minimum_purchase_cents: minimumPurchase ? parseInt(minimumPurchase) : 0,
        is_active: true
      };

      const { error } = await supabase
        .from('coupons')
        .insert([couponData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Coupon created successfully"
      });

      resetForm();
      fetchCoupons();
    } catch (error: any) {
      console.error('Error creating coupon:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create coupon",
        variant: "destructive"
      });
    }
  };

  const handleToggleActive = async (couponId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .update({ is_active: !currentStatus })
        .eq('id', couponId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Coupon ${!currentStatus ? 'activated' : 'deactivated'}`
      });

      fetchCoupons();
    } catch (error: any) {
      console.error('Error toggling coupon:', error);
      toast({
        title: "Error",
        description: "Failed to update coupon",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (couponId: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', couponId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Coupon deleted successfully"
      });

      fetchCoupons();
    } catch (error: any) {
      console.error('Error deleting coupon:', error);
      toast({
        title: "Error",
        description: "Failed to delete coupon",
        variant: "destructive"
      });
    }
  };

  if (adminLoading || loading) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <SEO title="Manage Coupons - Admin" description="Admin panel for managing coupon codes" />
      <div className="container mx-auto py-8">
        <AdminBreadcrumb
          items={[
            { label: "Admin Tools", href: "/admin" },
            { label: "Coupons", href: "/admin/coupons" }
          ]}
        />

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Coupon Management</h1>
            <p className="text-muted-foreground">Create and manage discount codes</p>
          </div>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? 'Cancel' : <><Plus className="h-4 w-4 mr-2" /> Create Coupon</>}
          </Button>
        </div>

        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Create New Coupon</CardTitle>
              <CardDescription>Set up a new discount code for customers</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="code">Coupon Code *</Label>
                    <Input
                      id="code"
                      placeholder="SUMMER2024"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="discountType">Discount Type *</Label>
                    <Select value={discountType} onValueChange={(value: any) => setDiscountType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage Off</SelectItem>
                        <SelectItem value="fixed_amount">Fixed Amount (cents)</SelectItem>
                        <SelectItem value="free_pack">Free Pack</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {discountType !== 'free_pack' ? (
                    <div>
                      <Label htmlFor="discountValue">
                        {discountType === 'percentage' ? 'Percentage (0-100)' : 'Amount in Cents'} *
                      </Label>
                      <Input
                        id="discountValue"
                        type="number"
                        placeholder={discountType === 'percentage' ? '50' : '1000'}
                        value={discountValue}
                        onChange={(e) => setDiscountValue(e.target.value)}
                        required
                      />
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="freePackId">Free Pack *</Label>
                      <Select value={freePackId} onValueChange={setFreePackId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a pack" />
                        </SelectTrigger>
                        <SelectContent>
                          {packs.map(pack => (
                            <SelectItem key={pack.id} value={pack.id}>
                              {pack.name} (${(pack.price_cents / 100).toFixed(2)})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="maxUses">Max Uses (leave empty for unlimited)</Label>
                    <Input
                      id="maxUses"
                      type="number"
                      placeholder="100"
                      value={maxUses}
                      onChange={(e) => setMaxUses(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="validUntil">Valid Until (leave empty for no expiry)</Label>
                    <Input
                      id="validUntil"
                      type="datetime-local"
                      value={validUntil}
                      onChange={(e) => setValidUntil(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="minimumPurchase">Minimum Purchase (cents)</Label>
                    <Input
                      id="minimumPurchase"
                      type="number"
                      placeholder="0"
                      value={minimumPurchase}
                      onChange={(e) => setMinimumPurchase(e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Summer sale discount"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">Create Coupon</Button>
                  <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {coupons.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No coupons created yet
              </CardContent>
            </Card>
          ) : (
            coupons.map((coupon) => (
              <Card key={coupon.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {coupon.code}
                        {!coupon.is_active && <Badge variant="secondary">Inactive</Badge>}
                      </CardTitle>
                      {coupon.description && (
                        <CardDescription>{coupon.description}</CardDescription>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={coupon.is_active ? "outline" : "default"}
                        size="sm"
                        onClick={() => handleToggleActive(coupon.id, coupon.is_active)}
                      >
                        {coupon.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(coupon.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="flex items-center gap-1 text-muted-foreground mb-1">
                        {coupon.discount_type === 'percentage' && <Percent className="h-3 w-3" />}
                        {coupon.discount_type === 'fixed_amount' && <DollarSign className="h-3 w-3" />}
                        {coupon.discount_type === 'free_pack' && <Package className="h-3 w-3" />}
                        <span>Discount</span>
                      </div>
                      <div className="font-medium">
                        {coupon.discount_type === 'percentage' && `${coupon.discount_value}%`}
                        {coupon.discount_type === 'fixed_amount' && `$${((coupon.discount_value || 0) / 100).toFixed(2)}`}
                        {coupon.discount_type === 'free_pack' && 'Free Pack'}
                      </div>
                    </div>

                    <div>
                      <div className="text-muted-foreground mb-1">Uses</div>
                      <div className="font-medium">
                        {coupon.current_uses} / {coupon.max_uses || '∞'}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-1 text-muted-foreground mb-1">
                        <Calendar className="h-3 w-3" />
                        <span>Valid Until</span>
                      </div>
                      <div className="font-medium">
                        {coupon.valid_until 
                          ? new Date(coupon.valid_until).toLocaleDateString() 
                          : 'No expiry'}
                      </div>
                    </div>

                    <div>
                      <div className="text-muted-foreground mb-1">Min Purchase</div>
                      <div className="font-medium">
                        ${(coupon.minimum_purchase_cents / 100).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
}
