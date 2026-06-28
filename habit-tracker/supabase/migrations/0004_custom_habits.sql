-- ============================================================
-- Migration: Add Custom Habits Support
-- ============================================================

-- 1. Add owner_id to habits to support private custom habits
-- Existing global catalog habits will have owner_id = NULL
ALTER TABLE public.habits 
ADD COLUMN owner_id uuid REFERENCES auth.users (id) ON DELETE CASCADE;

-- 2. Update the public read policy so that habits with owner_id are only visible to their owner
DROP POLICY IF EXISTS habits_public_read ON public.habits;
CREATE POLICY habits_public_read ON public.habits
  FOR SELECT USING (owner_id IS NULL OR owner_id = auth.uid());

-- 3. Allow users to insert, update, and delete their own custom habits
CREATE POLICY habits_owner_insert ON public.habits
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY habits_owner_update ON public.habits
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY habits_owner_delete ON public.habits
  FOR DELETE USING (owner_id = auth.uid());
