
-- ==========================================
-- STEP 1: DELETE EVERYTHING FROM DATABASE
-- ==========================================

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

-- Drop all functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Drop all policies (RLS policies)
DROP POLICY IF EXISTS "content_select_policy" ON content;
DROP POLICY IF EXISTS "content_insert_policy" ON content;
DROP POLICY IF EXISTS "content_update_policy" ON content;
DROP POLICY IF EXISTS "content_delete_policy" ON content;
DROP POLICY IF EXISTS "upcoming_content_select_policy" ON upcoming_content;
DROP POLICY IF EXISTS "upcoming_content_insert_policy" ON upcoming_content;
DROP POLICY IF EXISTS "upcoming_content_update_policy" ON upcoming_content;
DROP POLICY IF EXISTS "upcoming_content_delete_policy" ON upcoming_content;

-- Drop all triggers
DROP TRIGGER IF EXISTS update_content_updated_at ON content;
DROP TRIGGER IF EXISTS update_upcoming_content_updated_at ON upcoming_content;

-- ==========================================
-- STEP 2: RECREATE CONTENT-RELATED TABLES
-- ==========================================

-- Create app_role enum
CREATE TYPE app_role AS ENUM ('admin', 'user');

-- Create users table (minimal, for admin authentication)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- Create profiles table (for user profiles)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_roles table (for admin role management)
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create content table (main content management)
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  genres TEXT[] NOT NULL DEFAULT '{}',
  duration TEXT NOT NULL,
  episodes INTEGER,
  rating TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Published',
  views TEXT NOT NULL DEFAULT '0',
  description TEXT,
  thumbnail_url TEXT,
  video_url TEXT,
  trailer_url TEXT,
  release_year INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create upcoming_content table
CREATE TABLE upcoming_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  genres TEXT[] NOT NULL DEFAULT '{}',
  episodes INTEGER,
  release_date DATE NOT NULL,
  description TEXT NOT NULL,
  thumbnail_url TEXT,
  trailer_url TEXT,
  section_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create watchlist table (for user favorites)
CREATE TABLE watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  content_id UUID NOT NULL,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create viewing_history table (for user watch history)
CREATE TABLE viewing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  content_id UUID NOT NULL,
  watched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  progress_seconds INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE
);

-- ==========================================
-- STEP 3: CREATE FUNCTIONS FOR AUTO-UPDATE
-- ==========================================

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ==========================================
-- STEP 4: CREATE TRIGGERS
-- ==========================================

-- Trigger for content table
CREATE TRIGGER update_content_updated_at
  BEFORE UPDATE ON content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for upcoming_content table
CREATE TRIGGER update_upcoming_content_updated_at
  BEFORE UPDATE ON upcoming_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- STEP 5: ENABLE ROW LEVEL SECURITY
-- ==========================================

-- Enable RLS on tables
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE upcoming_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE viewing_history ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- STEP 6: CREATE POLICIES FOR CONTENT MANAGEMENT
-- ==========================================

-- Content policies (allow public read, admin write)
CREATE POLICY "content_select_policy" ON content
  FOR SELECT USING (true);

CREATE POLICY "content_insert_policy" ON content
  FOR INSERT WITH CHECK (true);

CREATE POLICY "content_update_policy" ON content
  FOR UPDATE USING (true);

CREATE POLICY "content_delete_policy" ON content
  FOR DELETE USING (true);

-- Upcoming content policies
CREATE POLICY "upcoming_content_select_policy" ON upcoming_content
  FOR SELECT USING (true);

CREATE POLICY "upcoming_content_insert_policy" ON upcoming_content
  FOR INSERT WITH CHECK (true);

CREATE POLICY "upcoming_content_update_policy" ON upcoming_content
  FOR UPDATE USING (true);

CREATE POLICY "upcoming_content_delete_policy" ON upcoming_content
  FOR DELETE USING (true);

-- Watchlist policies (users can only access their own)
CREATE POLICY "watchlist_select_policy" ON watchlist
  FOR SELECT USING (true);

CREATE POLICY "watchlist_insert_policy" ON watchlist
  FOR INSERT WITH CHECK (true);

CREATE POLICY "watchlist_delete_policy" ON watchlist
  FOR DELETE USING (true);

-- Viewing history policies
CREATE POLICY "viewing_history_select_policy" ON viewing_history
  FOR SELECT USING (true);

CREATE POLICY "viewing_history_insert_policy" ON viewing_history
  FOR INSERT WITH CHECK (true);

CREATE POLICY "viewing_history_update_policy" ON viewing_history
  FOR UPDATE USING (true);

-- ==========================================
-- STEP 7: INSERT SAMPLE ADMIN USER
-- ==========================================

-- Insert admin user (password should be hashed in real app)
INSERT INTO users (username, password) VALUES ('admin', 'admin123');

-- ==========================================
-- STEP 8: INSERT SAMPLE CONTENT
-- ==========================================

-- Insert sample content for testing
INSERT INTO content (title, type, genres, duration, rating, description, release_year) VALUES
('The Crown', 'TV Show', '{"Drama", "Biography", "History"}', '4 Seasons', 'TV-MA', 'A biographical drama that chronicles the reign of Queen Elizabeth II', 2022),
('Stranger Things', 'TV Show', '{"Sci-Fi", "Horror", "Drama"}', '4 Seasons', 'TV-14', 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments', 2023),
('Oppenheimer', 'Movie', '{"Biography", "Drama", "History"}', '180 min', 'R', 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb', 2023),
('Barbie', 'Movie', '{"Comedy", "Adventure", "Fantasy"}', '114 min', 'PG-13', 'Barbie and Ken are having the time of their lives in the colorful world of Barbie Land', 2023);

-- Insert sample upcoming content
INSERT INTO upcoming_content (title, type, genres, release_date, description, section_order) VALUES
('Avatar 3', 'Movie', '{"Action", "Adventure", "Sci-Fi"}', '2025-12-20', 'The third installment in the Avatar franchise continues the story on Pandora', 1),
('Stranger Things 5', 'TV Show', '{"Sci-Fi", "Horror", "Drama"}', '2024-07-15', 'The final season of the beloved supernatural series', 2),
('The Witcher Season 4', 'TV Show', '{"Fantasy", "Adventure", "Action"}', '2024-08-10', 'Geralt continues his adventures in the fantasy world', 3);
