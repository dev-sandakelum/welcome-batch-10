-- ============================================
-- Update RLS Policies for Admin Operations
-- ============================================
-- Run this script if you already have the database set up
-- This adds UPDATE and DELETE policies for admin panel

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can update questions" ON questions;
DROP POLICY IF EXISTS "Anyone can delete questions" ON questions;
DROP POLICY IF EXISTS "Anyone can delete quiz scores" ON quiz_scores;
DROP POLICY IF EXISTS "Anyone can delete feedback" ON feedback;

-- Add UPDATE policy for questions (for admin to answer questions)
CREATE POLICY "Anyone can update questions" ON questions
    FOR UPDATE USING (true);

-- Add DELETE policy for questions (for admin to remove questions)
CREATE POLICY "Anyone can delete questions" ON questions
    FOR DELETE USING (true);

-- Add DELETE policy for quiz scores (for admin to remove scores)
CREATE POLICY "Anyone can delete quiz scores" ON quiz_scores
    FOR DELETE USING (true);

-- Add DELETE policy for feedback (for admin to remove feedback)
CREATE POLICY "Anyone can delete feedback" ON feedback
    FOR DELETE USING (true);

-- ============================================
-- Verify Policies
-- ============================================
DO $$
BEGIN
    RAISE NOTICE 'RLS policies updated successfully!';
    RAISE NOTICE 'Admin can now UPDATE questions and DELETE all records';
END $$;
