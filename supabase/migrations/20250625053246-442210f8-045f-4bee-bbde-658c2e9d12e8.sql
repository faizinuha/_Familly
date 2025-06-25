
-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can only see groups they are members of" ON public.family_groups;
DROP POLICY IF EXISTS "Users can create their own groups" ON public.family_groups;
DROP POLICY IF EXISTS "Head of family can update their groups" ON public.family_groups;
DROP POLICY IF EXISTS "Head of family can delete their groups" ON public.family_groups;

DROP POLICY IF EXISTS "Group members can see other members" ON public.group_members;
DROP POLICY IF EXISTS "Users can join groups" ON public.group_members;
DROP POLICY IF EXISTS "Users can leave groups" ON public.group_members;

DROP POLICY IF EXISTS "Group members can see messages" ON public.group_messages;
DROP POLICY IF EXISTS "Group members can send messages" ON public.group_messages;

DROP POLICY IF EXISTS "Users can see devices of group members" ON public.devices;
DROP POLICY IF EXISTS "Users can update their own devices" ON public.devices;

DROP POLICY IF EXISTS "Users can see activity logs of group members" ON public.activity_logs;
DROP POLICY IF EXISTS "Users can create their own activity logs" ON public.activity_logs;

DROP POLICY IF EXISTS "Users can see status of group members" ON public.user_status;
DROP POLICY IF EXISTS "Users can update their own status" ON public.user_status;

-- Enable RLS on all tables
ALTER TABLE public.family_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_status ENABLE ROW LEVEL SECURITY;

-- Create new policies for family_groups
CREATE POLICY "Users can only see groups they are members of" 
  ON public.family_groups 
  FOR SELECT 
  USING (
    id IN (
      SELECT group_id FROM public.group_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own groups" 
  ON public.family_groups 
  FOR INSERT 
  WITH CHECK (head_of_family_id = auth.uid());

CREATE POLICY "Head of family can update their groups" 
  ON public.family_groups 
  FOR UPDATE 
  USING (head_of_family_id = auth.uid());

CREATE POLICY "Head of family can delete their groups" 
  ON public.family_groups 
  FOR DELETE 
  USING (head_of_family_id = auth.uid());

-- Create new policies for group_members
CREATE POLICY "Group members can see other members" 
  ON public.group_members 
  FOR SELECT 
  USING (
    group_id IN (
      SELECT group_id FROM public.group_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join groups" 
  ON public.group_members 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can leave groups" 
  ON public.group_members 
  FOR DELETE 
  USING (user_id = auth.uid());

-- Create new policies for group_messages
CREATE POLICY "Group members can see messages" 
  ON public.group_messages 
  FOR SELECT 
  USING (
    group_id IN (
      SELECT group_id FROM public.group_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Group members can send messages" 
  ON public.group_messages 
  FOR INSERT 
  WITH CHECK (
    sender_id = auth.uid() AND
    group_id IN (
      SELECT group_id FROM public.group_members 
      WHERE user_id = auth.uid()
    )
  );

-- Create new policies for devices
CREATE POLICY "Users can see devices of group members" 
  ON public.devices 
  FOR SELECT 
  USING (
    user_id IN (
      SELECT DISTINCT gm2.user_id 
      FROM public.group_members gm1
      JOIN public.group_members gm2 ON gm1.group_id = gm2.group_id
      WHERE gm1.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own devices" 
  ON public.devices 
  FOR ALL 
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create new policies for activity_logs
CREATE POLICY "Users can see activity logs of group members" 
  ON public.activity_logs 
  FOR SELECT 
  USING (
    user_id IN (
      SELECT DISTINCT gm2.user_id 
      FROM public.group_members gm1
      JOIN public.group_members gm2 ON gm1.group_id = gm2.group_id
      WHERE gm1.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own activity logs" 
  ON public.activity_logs 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

-- Create new policies for user_status
CREATE POLICY "Users can see status of group members" 
  ON public.user_status 
  FOR SELECT 
  USING (
    user_id IN (
      SELECT DISTINCT gm2.user_id 
      FROM public.group_members gm1
      JOIN public.group_members gm2 ON gm1.group_id = gm2.group_id
      WHERE gm1.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own status" 
  ON public.user_status 
  FOR ALL 
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
