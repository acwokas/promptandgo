-- Create table to track daily AI sends per user
CREATE TABLE public.daily_ai_sends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  send_date DATE NOT NULL DEFAULT CURRENT_DATE,
  send_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.daily_ai_sends ENABLE ROW LEVEL SECURITY;

-- Create policies for daily AI sends
CREATE POLICY "Users can view their own daily AI sends" 
ON public.daily_ai_sends 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily AI sends" 
ON public.daily_ai_sends 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily AI sends" 
ON public.daily_ai_sends 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create unique constraint to ensure one record per user per day
ALTER TABLE public.daily_ai_sends 
ADD CONSTRAINT unique_user_date UNIQUE (user_id, send_date);

-- Create index for better performance
CREATE INDEX idx_daily_ai_sends_user_date ON public.daily_ai_sends (user_id, send_date);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_daily_ai_sends_updated_at
BEFORE UPDATE ON public.daily_ai_sends
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to check and increment daily AI send count
CREATE OR REPLACE FUNCTION public.check_and_increment_daily_ai_sends(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  current_count INTEGER := 0;
  daily_limit INTEGER := 5;
  record_exists BOOLEAN := FALSE;
BEGIN
  -- Check if user has a record for today
  SELECT send_count INTO current_count
  FROM public.daily_ai_sends
  WHERE user_id = p_user_id AND send_date = CURRENT_DATE;
  
  IF FOUND THEN
    record_exists := TRUE;
  ELSE
    current_count := 0;
  END IF;
  
  -- Check if user has reached daily limit
  IF current_count >= daily_limit THEN
    RETURN json_build_object(
      'success', false,
      'remaining', 0,
      'limit_reached', true,
      'daily_limit', daily_limit
    );
  END IF;
  
  -- Increment or create record
  IF record_exists THEN
    UPDATE public.daily_ai_sends 
    SET send_count = send_count + 1
    WHERE user_id = p_user_id AND send_date = CURRENT_DATE;
    current_count := current_count + 1;
  ELSE
    INSERT INTO public.daily_ai_sends (user_id, send_date, send_count)
    VALUES (p_user_id, CURRENT_DATE, 1);
    current_count := 1;
  END IF;
  
  RETURN json_build_object(
    'success', true,
    'remaining', daily_limit - current_count,
    'limit_reached', false,
    'daily_limit', daily_limit
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to get current daily AI send count
CREATE OR REPLACE FUNCTION public.get_daily_ai_sends_count(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  current_count INTEGER := 0;
  daily_limit INTEGER := 5;
BEGIN
  -- Get current count for today
  SELECT COALESCE(send_count, 0) INTO current_count
  FROM public.daily_ai_sends
  WHERE user_id = p_user_id AND send_date = CURRENT_DATE;
  
  RETURN json_build_object(
    'count', current_count,
    'remaining', daily_limit - current_count,
    'daily_limit', daily_limit,
    'limit_reached', current_count >= daily_limit
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;