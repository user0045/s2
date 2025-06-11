
-- Drop all tables (in correct order due to dependencies)
DROP TABLE IF EXISTS viewing_history CASCADE;
DROP TABLE IF EXISTS watchlist CASCADE;
DROP TABLE IF EXISTS upcoming_content CASCADE;
DROP TABLE IF EXISTS content CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop all custom types/enums
DROP TYPE IF EXISTS app_role CASCADE;

-- Drop all functions (if any exist)
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Drop all triggers (if any exist)
-- Note: Replace 'table_name' with actual table names if you have triggers
-- DROP TRIGGER IF EXISTS update_updated_at ON table_name;

-- Drop all sequences (auto-created by serial columns)
DROP SEQUENCE IF EXISTS users_id_seq CASCADE;

-- Drop all views (if any exist)
-- DROP VIEW IF EXISTS view_name CASCADE;

-- Drop all stored procedures (if any exist)
-- DROP PROCEDURE IF EXISTS procedure_name CASCADE;

-- Drop all materialized views (if any exist)
-- DROP MATERIALIZED VIEW IF EXISTS mat_view_name CASCADE;

-- Drop all indexes (CASCADE will handle most, but for custom ones)
-- DROP INDEX IF EXISTS index_name CASCADE;

-- Reset all sequences to start from 1 (if recreating)
-- This is useful if you plan to recreate tables immediately
-- ALTER SEQUENCE users_id_seq RESTART WITH 1;

-- Optional: Drop the entire schema and recreate (nuclear option)
-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;
-- GRANT ALL ON SCHEMA public TO postgres;
-- GRANT ALL ON SCHEMA public TO public;
