import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { ShoppingBag, Calendar, DollarSign, Package, CheckCircle, Clock, XCircle, Trash2 } from "lucide-react";

type Order = { id: string; status: string; amount: number | null; mode: string; created_at: string };

type OrderItem = { id: string; order_id: string; item_type: string; title: string | null; unit_amount: number; quantity: number };

const PurchasesPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [items, setItems] = useState<Record<string, OrderItem[]>>({});
  const [deletingOrder, setDeletingOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data: ords, error } = await supabase.from('orders').select('id,status,amount,mode,created_at').order('created_at', { ascending: false });
    if (error) return;
    setOrders(ords || []);
    const ids = (ords || []).map(o => o.id);
    if (!ids.length) return;
    const { data: its } = await supabase.from('order_items').select('id,order_id,item_type,title,unit_amount,quantity').in('order_id', ids);
    const grouped: Record<string, OrderItem[]> = {};
    (its || []).forEach((it) => { (grouped[it.order_id] ||= []).push(it as any); });
    setItems(grouped);
  };

  const handleDeleteOrder = async (orderId: string) => {
    setDeletingOrder(orderId);
    try {
      // Delete the order (this will cascade delete the order items due to foreign key relationship)
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete the order. Please try again.',
          variant: 'destructive'
        });
        return;
      }

      // Refresh the orders list
      await fetchOrders();
      
      toast({
        title: 'Order deleted',
        description: 'Your purchase has been successfully removed from your history.'
      });
    } catch (error: any) {
      console.error('Delete order error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setDeletingOrder(null);
    }
  };

  const manageMembership = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) {
        // Check if this is a "no customer found" error
        if (error.message?.includes('No membership found') || error.message?.includes('No Stripe customer found')) {
          toast({ 
            title: 'No membership found', 
            description: 'You need to purchase a membership first. Redirecting to Power Packs...', 
            variant: 'default' 
          });
          // Redirect to packs page after a short delay
          setTimeout(() => {
            window.location.href = '/packs';
          }, 1500);
          return;
        }
        toast({ title: 'Portal error', description: error.message, variant: 'destructive' });
        return;
      }
      window.open((data as any).url, '_blank');
    } catch (err: any) {
      console.error('Manage membership error:', err);
      toast({ title: 'Portal error', description: 'Failed to access customer portal', variant: 'destructive' });
    }
  };

  const refreshMembership = async () => {
    await supabase.functions.invoke('check-subscription');
    toast({ title: 'Membership refreshed' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Complete</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getItemTypeDisplay = (itemType: string, title: string | null) => {
    if (itemType === 'lifetime') {
      return {
        name: 'Lifetime All-Access Pass',
        description: 'Unlimited access to all prompts and future content',
        icon: <Package className="w-5 h-5" />,
        linkTo: '/library'
      };
    }
    return {
      name: title || itemType,
      description: `${itemType} pack`,
      icon: <ShoppingBag className="w-5 h-5" />,
      linkTo: '/packs'
    };
  };

  return (
    <>
      <SEO title="My Purchases" description="View your purchased prompt packs and invoices." />
      <PageHero
        title={<><span className="text-gradient-brand">My</span> Purchases</>}
        subtitle={<>A history of your purchases and downloads.</>}
        minHeightClass="min-h-[28svh]"
      />
      <main className="container py-8 space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/account">My Account</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>My Purchases</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={refreshMembership}>Refresh Membership</Button>
          <Button variant="cta" onClick={manageMembership}>Manage Membership</Button>
        </div>
        
        {orders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="space-y-4">
              <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold mb-2">No purchases yet</h3>
                <p className="text-muted-foreground mb-4">You haven't made any purchases. Check out our prompt packs to get started!</p>
                <Button asChild variant="cta">
                  <Link to="/packs">Browse Power Packs</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {orders.map((o) => (
              <Card key={o.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-5 h-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">Order #{o.id.slice(0, 8).toUpperCase()}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {new Date(o.created_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(o.status)}
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-lg font-bold">
                          <DollarSign className="w-4 h-4" />
                          {((o.amount || 0) / 100).toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wide">
                          {o.mode}
                        </div>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            disabled={deletingOrder === o.id}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Purchase Record?</AlertDialogTitle>
                            <AlertDialogDescription className="space-y-2">
                              <p>Are you sure you want to delete this purchase from your history?</p>
                              <p className="font-semibold text-amber-600">
                                ⚠️ Warning: If you delete your purchase record, you may be required to purchase these items again to regain access.
                              </p>
                              <p>This action cannot be undone.</p>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteOrder(o.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Yes, Delete Purchase
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-base mb-3">Items Purchased</h4>
                    {(items[o.id] || []).length === 0 ? (
                      <p className="text-muted-foreground italic">No items found for this order</p>
                    ) : (
                      <div className="grid gap-3">
                        {(items[o.id] || []).map((item) => {
                          const itemDisplay = getItemTypeDisplay(item.item_type, item.title);
                          return (
                            <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors">
                              <Link to={itemDisplay.linkTo} className="flex items-center gap-3 flex-1 group">
                                <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                                  {itemDisplay.icon}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium group-hover:text-primary transition-colors">{itemDisplay.name}</div>
                                  <div className="text-sm text-muted-foreground">{itemDisplay.description}</div>
                                  {item.quantity > 1 && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                      Quantity: {item.quantity}
                                    </div>
                                  )}
                                  <div className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                                    Click to view →
                                  </div>
                                </div>
                              </Link>
                              <div className="text-right ml-4">
                                <div className="font-semibold">${(item.unit_amount / 100).toFixed(2)}</div>
                                {item.quantity > 1 && (
                                  <div className="text-xs text-muted-foreground">
                                    ${(item.unit_amount / 100).toFixed(2)} each
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default PurchasesPage;
