import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import PageHero from "@/components/layout/PageHero";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Star, Calendar, User, Filter, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Feedback {
  id: string;
  feedback_type: string;
  content: string;
  rating: number | null;
  status: string;
  priority: string;
  user_id: string | null;
  prompt_id: string | null;
  name: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
  admin_notes: string | null;
  ai_summary: string | null;
  ai_sentiment: string | null;
  ai_category: string | null;
}

const AdminFeedback = () => {
  const { user, loading: authLoading } = useSupabaseAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    type: "all",
    status: "all",
    priority: "all"
  });
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const loadFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from("user_feedback")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFeedback(data || []);
    } catch (error) {
      console.error("Error loading feedback:", error);
      toast({
        title: "Error",
        description: "Failed to load feedback",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFeedbackStatus = async (feedbackId: string, status: string, priority?: string) => {
    setUpdatingStatus(true);
    try {
      const updates: any = { 
        status,
        updated_at: new Date().toISOString()
      };
      
      if (priority) updates.priority = priority;
      if (adminNotes.trim()) updates.admin_notes = adminNotes.trim();

      const { error } = await supabase
        .from("user_feedback")
        .update(updates)
        .eq("id", feedbackId);

      if (error) throw error;

      setFeedback(prev => 
        prev.map(item => 
          item.id === feedbackId 
            ? { ...item, ...updates }
            : item
        )
      );

      toast({
        title: "Feedback updated",
        description: "Status has been updated successfully"
      });

      setSelectedFeedback(null);
      setAdminNotes("");

    } catch (error) {
      console.error("Error updating feedback:", error);
      toast({
        title: "Error",
        description: "Failed to update feedback",
        variant: "destructive"
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  // Wait for both auth and admin checks to complete
  if (authLoading || adminLoading) {
    return <div>Loading...</div>;
  }

  const emailAllow = ["me@adrianwatkins.com"];
  const effectiveIsAdmin = isAdmin || (user?.email ? emailAllow.includes(user.email) : false);

  if (!effectiveIsAdmin) {
    navigate("/");
    return null;
  }

  const filteredFeedback = feedback.filter(item => {
    if (filter.type !== "all" && item.feedback_type !== filter.type) return false;
    if (filter.status !== "all" && item.status !== filter.status) return false;
    if (filter.priority !== "all" && item.priority !== filter.priority) return false;
    return true;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "bug": return "bg-red-100 text-red-800 border-red-200";
      case "feature": return "bg-blue-100 text-blue-800 border-blue-200";
      case "improvement": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "prompt_feedback": return "bg-green-100 text-green-800 border-green-200";
      case "general": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800 border-blue-200";
      case "in_progress": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "resolved": return "bg-green-100 text-green-800 border-green-200";
      case "closed": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <PageHero title="User Feedback" subtitle="Loading..." variant="admin" />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Loading feedback...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="User Feedback - Admin"
        description="Manage user feedback and suggestions"
      />
      
      <PageHero
        title="User Feedback"
        subtitle={`${filteredFeedback.length} feedback items`}
        variant="admin"
      />

      <div className="container mx-auto px-4 py-12">
        <AdminBreadcrumb
          items={[
            { label: "Admin Tools", href: "/admin" },
            { label: "User Feedback" }
          ]}
        />

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mt-8 mb-6">
          <Select
            value={filter.type}
            onValueChange={(value) => setFilter(prev => ({ ...prev, type: value }))}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="bug">Bug Reports</SelectItem>
              <SelectItem value="feature">Feature Requests</SelectItem>
              <SelectItem value="improvement">Improvements</SelectItem>
              <SelectItem value="prompt_feedback">Prompt Feedback</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filter.status}
            onValueChange={(value) => setFilter(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filter.priority}
            onValueChange={(value) => setFilter(prev => ({ ...prev, priority: value }))}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Feedback List */}
        <div className="grid gap-6">
          {filteredFeedback.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getTypeColor(item.feedback_type)}>
                        {item.feedback_type.replace("_", " ")}
                      </Badge>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status.replace("_", " ")}
                      </Badge>
                      <Badge className={getPriorityColor(item.priority)}>
                        {item.priority} priority
                      </Badge>
                      {item.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{item.rating}/5</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                      </div>
                      {(item.name || item.email) && (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {item.name || item.email}
                        </div>
                      )}
                      {item.prompt_id && (
                        <div className="flex items-center gap-1">
                          <ExternalLink className="h-4 w-4" />
                          <span>Prompt feedback</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedFeedback(item)}
                  >
                    Manage
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{item.content}</p>
                {item.admin_notes && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium mb-1">Admin Notes:</p>
                    <p className="text-sm text-muted-foreground">{item.admin_notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {filteredFeedback.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No feedback matches your filters.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Management Dialog */}
        {selectedFeedback && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90svh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Manage Feedback</CardTitle>
                <CardDescription>Update status and add admin notes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Content:</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {selectedFeedback.content}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      defaultValue={selectedFeedback.status}
                      onValueChange={(value) => 
                        setSelectedFeedback(prev => prev ? {...prev, status: value} : null)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Priority</label>
                    <Select
                      defaultValue={selectedFeedback.priority}
                      onValueChange={(value) => 
                        setSelectedFeedback(prev => prev ? {...prev, priority: value} : null)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Admin Notes</label>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes for your team..."
                    rows={4}
                    className="mt-1"
                  />
                  {selectedFeedback.admin_notes && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Current notes: {selectedFeedback.admin_notes}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => updateFeedbackStatus(
                      selectedFeedback.id,
                      selectedFeedback.status,
                      selectedFeedback.priority
                    )}
                    disabled={updatingStatus}
                  >
                    {updatingStatus ? "Updating..." : "Update"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedFeedback(null);
                      setAdminNotes("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFeedback;