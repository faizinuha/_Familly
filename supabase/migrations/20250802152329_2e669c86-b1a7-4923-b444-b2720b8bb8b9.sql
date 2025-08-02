-- Add is_private column to family_groups table
ALTER TABLE public.family_groups 
ADD COLUMN is_private BOOLEAN NOT NULL DEFAULT false;

-- Add comment to describe the column
COMMENT ON COLUMN public.family_groups.is_private IS 'Determines if the group is private (true) or public (false)';

-- Create or update RLS policies to handle private groups
-- Keep existing policies and add new ones for private groups

-- Allow users to view public groups (non-private groups that they can discover)
CREATE POLICY "Users can view public groups" 
ON public.family_groups 
FOR SELECT 
USING (is_private = false);

-- Ensure private groups can only be viewed by members or head of family
-- This policy will work alongside existing policies
CREATE POLICY "Private groups visible to members only" 
ON public.family_groups 
FOR SELECT 
USING (
  is_private = true AND (
    auth.uid() = head_of_family_id OR 
    EXISTS (
      SELECT 1 
      FROM group_members 
      WHERE group_members.group_id = family_groups.id 
      AND group_members.user_id = auth.uid()
    )
  )
);