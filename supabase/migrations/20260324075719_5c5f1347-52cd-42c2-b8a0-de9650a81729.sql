
-- Add admin reply fields to contact_messages
ALTER TABLE public.contact_messages 
  ADD COLUMN IF NOT EXISTS admin_reply text,
  ADD COLUMN IF NOT EXISTS replied_at timestamp with time zone;

-- Add UPDATE/DELETE policies for admin on contact_messages
CREATE POLICY "Admins can update contact messages"
  ON public.contact_messages FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete contact messages"
  ON public.contact_messages FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Add country to donations
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS country text;
