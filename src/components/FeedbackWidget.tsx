import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Star, X, ChevronUp, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useToast } from "@/hooks/use-toast";

interface FeedbackWidgetProps {
  promptId?: string;
}

export const FeedbackWidget = ({ promptId }: FeedbackWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const { user } = useSupabaseAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    feedbackType: "",
    content: "",
    rating: "",
    name: "",
    email: ""
  });

  // Check if feedback widget is enabled
  useEffect(() => {
    const checkWidgetStatus = async () => {
      const { data } = await supabase
        .from("widget_settings")
        .select("setting_value")
        .eq("setting_key", "feedback_widget_enabled")
        .single();
      
      setIsEnabled(data?.setting_value ?? true);
    };
    
    checkWidgetStatus();
  }, []);

  const resetForm = () => {
    setFormData({
      feedbackType: "",
      content: "",
      rating: "",
      name: "",
      email: ""
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.feedbackType || !formData.content.trim()) {
      toast({
        title: "Missing information",
        description: "Please select a feedback type and provide your message.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("user_feedback")
        .insert({
          feedback_type: formData.feedbackType,
          content: formData.content.trim(),
          rating: formData.rating ? parseInt(formData.rating) : null,
          prompt_id: promptId || null,
          user_id: user?.id || null,
          name: formData.name.trim() || null,
          email: formData.email.trim() || null
        });

      if (error) throw error;

      toast({
        title: "Feedback submitted!",
        description: "Thank you for your feedback. We'll review it soon."
      });

      resetForm();
      setIsOpen(false);
      setIsMinimized(false);

    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isEnabled || isDismissed) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsMinimized(false)}
            size="sm"
            className="shadow-lg"
            aria-label="Open feedback"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Feedback
            <ChevronUp className="h-4 w-4 ml-2" />
          </Button>
          <Button
            onClick={() => setIsDismissed(true)}
            variant="ghost"
            size="sm"
            className="shadow-lg bg-background/80 backdrop-blur-sm border"
            aria-label="Dismiss feedback widget"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsOpen(true)}
            size="lg"
            className="shadow-lg"
            aria-label="Open feedback form"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Feedback
          </Button>
          <Button
            onClick={() => setIsDismissed(true)}
            variant="ghost"
            size="sm"
            className="shadow-lg bg-background/80 backdrop-blur-sm border"
            aria-label="Dismiss feedback widget"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Card className="w-80 shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageCircle className="h-5 w-5" />
                Send Feedback
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(true)}
                  aria-label="Minimize feedback"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close feedback"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="feedback-type">Feedback Type *</Label>
                <Select
                  value={formData.feedbackType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, feedbackType: value }))}
                >
                  <SelectTrigger id="feedback-type">
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bug">Bug Report</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="improvement">Improvement Suggestion</SelectItem>
                    <SelectItem value="prompt_feedback">Prompt Feedback</SelectItem>
                    <SelectItem value="general">General Feedback</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.feedbackType === "prompt_feedback" && (
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <Select
                    value={formData.rating}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, rating: value }))}
                  >
                    <SelectTrigger id="rating">
                      <SelectValue placeholder="Rate this prompt..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">⭐⭐⭐⭐⭐ Excellent</SelectItem>
                      <SelectItem value="4">⭐⭐⭐⭐ Good</SelectItem>
                      <SelectItem value="3">⭐⭐⭐ Average</SelectItem>
                      <SelectItem value="2">⭐⭐ Poor</SelectItem>
                      <SelectItem value="1">⭐ Very Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="content">Your Message *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Tell us what's on your mind..."
                  rows={4}
                  className="resize-none"
                />
              </div>

              {!user && (
                <>
                  <div>
                    <Label htmlFor="name">Your Name (Optional)</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Your Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com"
                    />
                  </div>
                </>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};