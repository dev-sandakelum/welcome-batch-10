-- ============================================
-- Welcome 10th Batch - Database Setup
-- ============================================
-- This script creates all necessary tables for the application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

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
CREATE TRIGGER update_questions_updated_at
    BEFORE UPDATE ON questions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Success Message
-- ============================================
DO $$
BEGIN
    RAISE NOTICE 'Database setup completed successfully!';
    RAISE NOTICE 'Tables created: questions, quiz_scores, feedback';
    RAISE NOTICE 'Indexes and RLS policies applied';
END $$;
