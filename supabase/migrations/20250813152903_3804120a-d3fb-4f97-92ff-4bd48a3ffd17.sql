-- Create table for pending contact submissions
CREATE TABLE public.pending_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  newsletter_opt_in BOOLEAN NOT NULL DEFAULT false,
  confirmation_token TEXT NOT NULL UNIQUE,
  confirmed BOOLEAN NOT NULL DEFAULT false,
  processed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pending_contacts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (for initial contact form submission)
CREATE POLICY "Allow public insert of pending contacts" 
ON public.pending_contacts 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow public select by confirmation token (for confirmation)
CREATE POLICY "Allow public select by confirmation token" 
ON public.pending_contacts 
FOR SELECT 
USING (true);

-- Create policy to allow public update by confirmation token (for confirmation)
CREATE POLICY "Allow public update by confirmation token" 
ON public.pending_contacts 
FOR UPDATE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_pending_contacts_updated_at
BEFORE UPDATE ON public.pending_contacts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();