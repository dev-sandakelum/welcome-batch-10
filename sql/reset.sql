-- ============================================
-- Welcome 10th Batch - Database Reset
-- ============================================
-- This script removes all tables and data
-- WARNING: This will delete ALL data permanently!

-- ============================================
-- Drop all triggers first
-- ============================================
DROP TRIGGER IF EXISTS update_questions_updated_at ON questions;
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;

-- ============================================
-- Drop all functions
-- ============================================
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS verify_admin_credentials(TEXT, TEXT);

-- ============================================
-- Drop all tables (CASCADE removes dependencies)
-- ============================================
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS quiz_scores CASCADE;
DROP TABLE IF EXISTS feedback CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- ============================================
-- Success Message
-- ============================================
DO $$
BEGIN
    RAISE NOTICE 'Database reset completed!';
    RAISE NOTICE 'All tables, triggers, and functions have been removed.';
    RAISE NOTICE 'Run setup.sql to recreate the database structure.';
END $$;
