-- Create Batches table
CREATE TABLE IF NOT EXISTS public.batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    org_id UUID REFERENCES public.orgs(id),
    name TEXT, -- Optional user friendly name (e.g. "Dec 31 Batch")
    status TEXT DEFAULT 'completed',
    total_items INTEGER DEFAULT 0
);

-- Enable RLS for batches
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;

-- Helper function for RLS (Safe Replacer)
CREATE OR REPLACE FUNCTION public.is_org_member(_org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.org_members
    WHERE user_id = auth.uid()
    AND org_id = _org_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Users can manage their own organization's batches"
    ON public.batches
    FOR ALL
    USING (public.is_org_member(org_id));

-- Add batch_id to runs table
ALTER TABLE public.runs ADD COLUMN IF NOT EXISTS batch_id UUID REFERENCES public.batches(id);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_runs_batch_id ON public.runs(batch_id);
