
-- Create group_invitations table for handling invitations
CREATE TABLE public.group_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.family_groups(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  invited_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days')
);

-- Add Row Level Security
ALTER TABLE public.group_invitations ENABLE ROW LEVEL SECURITY;

-- Create policies for group invitations
CREATE POLICY "Group members can view invitations for their groups" 
  ON public.group_invitations 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members 
      WHERE group_id = group_invitations.group_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Group members can create invitations for their groups" 
  ON public.group_invitations 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.group_members 
      WHERE group_id = group_invitations.group_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update invitations sent to their email" 
  ON public.group_invitations 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE email = group_invitations.email 
      AND id = auth.uid()
    )
  );
