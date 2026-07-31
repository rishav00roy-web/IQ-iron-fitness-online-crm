-- 1. Create Trainers & Payroll Tables
CREATE TABLE trainers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE payroll (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trainer_id UUID REFERENCES trainers(id) ON DELETE CASCADE NOT NULL,
  period TEXT NOT NULL,
  basic_pay NUMERIC DEFAULT 0,
  commission NUMERIC DEFAULT 0,
  total_salary NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(trainer_id, period)
);

-- 2. Add Relational Columns to Members
ALTER TABLE members 
  ADD COLUMN trainer_id UUID REFERENCES trainers(id) ON DELETE SET NULL,
  ADD COLUMN pt_fee NUMERIC DEFAULT 0;

-- 3. Migration: Backfill Trainers & Link Members
-- Insert all unique trainer names currently typed into the members table
INSERT INTO trainers (name)
SELECT DISTINCT TRIM(trainer_name) FROM members WHERE trainer_name IS NOT NULL AND TRIM(trainer_name) != '';

-- Link members to their new trainer ID and calculate default PT fee (20% of total_fee)
UPDATE members m
SET 
  trainer_id = t.id,
  pt_fee = COALESCE(m.total_fee, 0) * 0.2
FROM trainers t
WHERE TRIM(m.trainer_name) = t.name AND m.has_personal_trainer = true;

-- 4. Clean Up: Drop the old text column to remove the duplicate source of truth
ALTER TABLE members DROP COLUMN trainer_name;

-- 5. Enable RLS
ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all access for anon" ON trainers;
DROP POLICY IF EXISTS "Enable all access for anon" ON payroll;

CREATE POLICY "Enable all access for anon" ON trainers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for anon" ON payroll FOR ALL USING (true) WITH CHECK (true);

-- 6. Add Mock Trainer
INSERT INTO trainers (id, name) VALUES (gen_random_uuid(), 'Mock Trainer') ON CONFLICT DO NOTHING;

-- 7. Update Existing Constraints (For already deployed databases)
ALTER TABLE members
  DROP CONSTRAINT IF EXISTS members_trainer_id_fkey,
  ADD CONSTRAINT members_trainer_id_fkey FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE SET NULL;

ALTER TABLE payroll
  DROP CONSTRAINT IF EXISTS payroll_trainer_id_fkey,
  ADD CONSTRAINT payroll_trainer_id_fkey FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE;
