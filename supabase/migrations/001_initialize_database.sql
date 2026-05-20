-- Drop existing tables (in correct order for foreign keys)
DROP TABLE IF EXISTS feedback CASCADE;
DROP TABLE IF EXISTS scores CASCADE;
DROP TABLE IF EXISTS user_questions CASCADE;
DROP TABLE IF EXISTS questions CASCADE;

-- Create questions table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer VARCHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for questions
CREATE INDEX idx_questions_display_order ON questions(display_order);
CREATE INDEX idx_questions_created_at ON questions(created_at);

-- Create scores table
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_name TEXT NOT NULL,
  participant_email TEXT,
  score INT NOT NULL,
  total_questions INT NOT NULL,
  percentage DECIMAL(5, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for scores
CREATE INDEX idx_scores_created_at ON scores(created_at DESC);
CREATE INDEX idx_scores_participant_name ON scores(participant_name);

-- Create user_questions table
CREATE TABLE user_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_name TEXT NOT NULL,
  participant_email TEXT,
  question TEXT NOT NULL,
  answer TEXT,
  is_answered BOOLEAN DEFAULT FALSE,
  asked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  answered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for user_questions
CREATE INDEX idx_user_questions_asked_at ON user_questions(asked_at DESC);
CREATE INDEX idx_user_questions_is_answered ON user_questions(is_answered);
CREATE INDEX idx_user_questions_participant_name ON user_questions(participant_name);

-- Create feedback table
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_name TEXT NOT NULL,
  participant_email TEXT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comments TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for feedback
CREATE INDEX idx_feedback_submitted_at ON feedback(submitted_at DESC);
CREATE INDEX idx_feedback_rating ON feedback(rating);
CREATE INDEX idx_feedback_participant_name ON feedback(participant_name);

-- Disable Row Level Security for public access
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE scores DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE feedback DISABLE ROW LEVEL SECURITY;

-- Insert test questions
INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer, display_order) VALUES
('What is 2 + 2?', '3', '4', '5', '6', 'B', 1),
('What is the capital of France?', 'London', 'Berlin', 'Paris', 'Madrid', 'C', 2),
('What is the largest planet in our solar system?', 'Saturn', 'Jupiter', 'Neptune', 'Uranus', 'B', 3),
('Who wrote Romeo and Juliet?', 'Jane Austen', 'William Shakespeare', 'Charles Dickens', 'Mark Twain', 'B', 4),
('What is the chemical symbol for Gold?', 'Gd', 'Go', 'Au', 'Ag', 'C', 5);

-- Insert test scores
INSERT INTO scores (participant_name, participant_email, score, total_questions, percentage) VALUES
('John Doe', 'john@example.com', 4, 5, 80.00),
('Jane Smith', 'jane@example.com', 5, 5, 100.00),
('Bob Johnson', 'bob@example.com', 3, 5, 60.00);

-- Insert test user questions with answers
INSERT INTO user_questions (participant_name, participant_email, question, answer, is_answered, asked_at, answered_at) VALUES
('Alice Brown', 'alice@example.com', 'What time does the event start?', 'The event starts at 10:00 AM. Please arrive 15 minutes early.', true, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour'),
('Charlie Wilson', 'charlie@example.com', 'Is there parking available?', 'Yes, there is free parking available in the main lot on the east side of the building.', true, NOW() - INTERVAL '1.5 hours', NOW() - INTERVAL '45 minutes'),
('Diana Lee', 'diana@example.com', 'What should I bring?', 'Please bring your ID and a notebook. Coffee and refreshments will be provided.', true, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '30 minutes');

-- Insert test feedback
INSERT INTO feedback (participant_name, participant_email, rating, comments) VALUES
('John Doe', 'john@example.com', 5, 'Great event! Very well organized.'),
('Jane Smith', 'jane@example.com', 4, 'Really enjoyed the Q&A session.'),
('Bob Johnson', 'bob@example.com', 5, 'Excellent presentations and networking opportunity.');

-- Verify all tables are created and populated
SELECT 'Questions' as table_name, COUNT(*) as row_count FROM questions
UNION ALL
SELECT 'Scores', COUNT(*) FROM scores
UNION ALL
SELECT 'User Questions', COUNT(*) FROM user_questions
UNION ALL
SELECT 'Feedback', COUNT(*) FROM feedback;
