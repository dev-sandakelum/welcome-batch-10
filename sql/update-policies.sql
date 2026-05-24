-- ============================================
-- Update RLS Policies for Admin Operations
-- ============================================
-- Run this script if you already have the database set up
-- This adds UPDATE and DELETE policies for admin panel

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure admin_users table exists with plain text passwords
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL,
    password TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE admin_users DROP CONSTRAINT IF EXISTS admin_users_username_key;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Drop old bcrypt-based function if it exists
DROP FUNCTION IF EXISTS verify_admin_credentials(TEXT, TEXT);

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can update questions" ON questions;
DROP POLICY IF EXISTS "Anyone can delete questions" ON questions;
DROP POLICY IF EXISTS "Anyone can delete quiz scores" ON quiz_scores;
DROP POLICY IF EXISTS "Anyone can delete feedback" ON feedback;
DROP POLICY IF EXISTS "Service role can manage admin users" ON admin_users;

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

-- admin_users: service_role only
CREATE POLICY "Service role can manage admin users" ON admin_users
    FOR ALL USING (true);

-- Seed admin credentials (plain text, idempotent)
INSERT INTO admin_users (username, password, is_active)
SELECT username, password, TRUE
FROM (
    VALUES
        ('welcome_admin', 'fot_26_1'),
        ('welcome_admin', 'fot_26_2'),
        ('welcome_admin', 'fot_26_3'),
        ('welcome_admin', 'fot_26_4'),
        ('welcome_admin', 'fot_26_5')
) AS creds(username, password)
WHERE NOT EXISTS (
    SELECT 1 FROM admin_users u
    WHERE u.username = creds.username
      AND u.password = creds.password
      AND u.is_active = TRUE
);

-- ============================================
-- Verify Policies
-- ============================================
DO $$
BEGIN
    RAISE NOTICE 'RLS policies updated successfully!';
    RAISE NOTICE 'Admin can now UPDATE questions and DELETE all records';
    RAISE NOTICE 'admin_users table ready with plain text passwords';
END $$;
