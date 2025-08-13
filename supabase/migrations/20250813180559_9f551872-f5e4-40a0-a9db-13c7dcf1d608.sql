-- Create feedback table for user submissions
CREATE TABLE public.user_feedback (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  feedback_type text NOT NULL CHECK (feedback_type IN ('bug', 'suggestion', 'rating', 'general')),
  content text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  prompt_id uuid, -- Can be null for general feedback
  email text, -- For anonymous users
  name text, -- For anonymous users
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status text DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'in_progress', 'resolved', 'closed')),
  ai_summary text, -- AI-generated summary
  ai_sentiment text, -- AI-analyzed sentiment (positive, negative, neutral)
  ai_category text, -- AI-categorized topic
  admin_notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create widget settings table for admin control
CREATE TABLE public.widget_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key text NOT NULL UNIQUE,
  setting_value boolean NOT NULL DEFAULT true,
  description text,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Insert default widget settings
INSERT INTO public.widget_settings (setting_key, setting_value, description) VALUES 
('feedback_widget_enabled', true, 'Enable/disable the feedback widget for all users'),
('context_popup_enabled', true, 'Enable/disable the context collection popup for new users');

-- Enable RLS
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.widget_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for feedback
CREATE POLICY "Anyone can submit feedback" ON public.user_feedback
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own feedback" ON public.user_feedback
FOR SELECT USING (user_id = auth.uid() OR auth.uid() IS NULL);

CREATE POLICY "Admins can view all feedback" ON public.user_feedback
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update feedback" ON public.user_feedback
FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for widget settings
CREATE POLICY "Everyone can read widget settings" ON public.widget_settings
FOR SELECT USING (true);

CREATE POLICY "Admins can modify widget settings" ON public.widget_settings
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for better performance
CREATE INDEX idx_feedback_type ON public.user_feedback(feedback_type);
CREATE INDEX idx_feedback_status ON public.user_feedback(status);
CREATE INDEX idx_feedback_priority ON public.user_feedback(priority);
CREATE INDEX idx_feedback_prompt_id ON public.user_feedback(prompt_id);
CREATE INDEX idx_feedback_created_at ON public.user_feedback(created_at DESC);