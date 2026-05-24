-- ============================================
-- Drop All Tables (Public Schema)
-- ============================================
-- WARNING: This permanently deletes all tables and data
-- in the public schema.

DO $$
DECLARE
    table_record RECORD;
BEGIN
    -- Drop every table in public schema, including dependencies.
    FOR table_record IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP TABLE IF EXISTS public.%I CASCADE;', table_record.tablename);
    END LOOP;

    RAISE NOTICE 'All public schema tables have been removed.';
END $$;
