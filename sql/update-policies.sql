-- ============================================
-- Update RLS Policies for Admin Operations
-- ============================================
-- Run this script if you already have the database set up
-- This adds UPDATE and DELETE policies for admin panel

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure admin auth table exists for DB-backed admin login.
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE admin_users DROP CONSTRAINT IF EXISTS admin_users_username_key;

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

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

-- Create/replace server-side login validator.
CREATE OR REPLACE FUNCTION verify_admin_credentials(p_username TEXT, p_password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    is_valid BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM admin_users
        WHERE username = p_username
          AND is_active = TRUE
          AND password_hash = crypt(p_password, password_hash)
    )
    INTO is_valid;

    RETURN is_valid;
END;
$$;

REVOKE ALL ON FUNCTION verify_admin_credentials(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION verify_admin_credentials(TEXT, TEXT) TO anon, authenticated, service_role;

INSERT INTO admin_users (username, password_hash, is_active)
SELECT creds.username, crypt(creds.password, gen_salt('bf')), TRUE
FROM (
        VALUES
            ('welcome_admin', 'fot_26_1'),
            ('welcome_admin', 'fot_26_2'),
            ('welcome_admin', 'fot_26_3'),
            ('welcome_admin', 'fot_26_4'),
            ('welcome_admin', 'fot_26_5')
) AS creds(username, password)
WHERE NOT EXISTS (
        SELECT 1
        FROM admin_users u
        WHERE u.username = creds.username
            AND u.is_active = TRUE
            AND u.password_hash = crypt(creds.password, u.password_hash)
);

-- ============================================
-- Verify Policies
-- ============================================
DO $$
BEGIN
    RAISE NOTICE 'RLS policies updated successfully!';
    RAISE NOTICE 'Admin can now UPDATE questions and DELETE all records';
    RAISE NOTICE 'admin_users table and DB-backed admin login function are ready';
END $$;
