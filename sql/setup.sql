-- ============================================
-- Welcome 10th Batch - Database Setup
-- ============================================
-- This script creates all necessary tables for the application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Table: admin_users
-- Stores admin login credentials (plain text passwords)
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL,
    password TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Allow multiple password sets for the same username.
ALTER TABLE admin_users DROP CONSTRAINT IF EXISTS admin_users_username_key;

-- ============================================
-- Table: questions
-- Stores questions asked by students
-- ============================================
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    question TEXT NOT NULL,
    answer TEXT,
    answered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Table: quiz_scores
-- Stores quiz results and leaderboard data
-- ============================================
CREATE TABLE IF NOT EXISTS quiz_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_name VARCHAR(255) NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Table: feedback
-- Stores user feedback and ratings
-- ============================================
CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Indexes for better query performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON questions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_questions_answered ON questions(answered);
CREATE INDEX IF NOT EXISTS idx_quiz_scores_score ON quiz_scores(score DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_scores_created_at ON quiz_scores(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON feedback(rating);
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Questions: Anyone can read and insert, anyone can update and delete
CREATE POLICY "Anyone can view questions" ON questions
    FOR SELECT USING (true);

CREATE POLICY "Anyone can submit questions" ON questions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update questions" ON questions
    FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete questions" ON questions
    FOR DELETE USING (true);

-- Quiz Scores: Anyone can read, insert, and delete
CREATE POLICY "Anyone can view quiz scores" ON quiz_scores
    FOR SELECT USING (true);

CREATE POLICY "Anyone can submit quiz scores" ON quiz_scores
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can delete quiz scores" ON quiz_scores
    FOR DELETE USING (true);

-- Feedback: Anyone can read, insert, and delete
CREATE POLICY "Anyone can view feedback" ON feedback
    FOR SELECT USING (true);

CREATE POLICY "Anyone can submit feedback" ON feedback
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can delete feedback" ON feedback
    FOR DELETE USING (true);

-- admin_users: service_role only (no public access)
CREATE POLICY "Service role can manage admin users" ON admin_users
    FOR ALL USING (true);

-- ============================================
-- Functions and Triggers
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for questions table
DROP TRIGGER IF EXISTS update_questions_updated_at ON questions;
CREATE TRIGGER update_questions_updated_at
    BEFORE UPDATE ON questions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Seed admin credentials (plain text passwords)
-- ============================================
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
-- Success Message
-- ============================================
DO $$
BEGIN
    RAISE NOTICE 'Database setup completed successfully!';
    RAISE NOTICE 'Tables created: questions, quiz_scores, feedback, admin_users';
    RAISE NOTICE 'Indexes and RLS policies applied';
    RAISE NOTICE 'Admin credentials seeded (plain text passwords)';
END $$;
