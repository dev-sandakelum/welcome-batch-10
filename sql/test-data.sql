-- ============================================
-- Welcome 10th Batch - Test Data
-- ============================================
-- This script inserts sample data for testing

-- ============================================
-- Sample Questions
-- ============================================
INSERT INTO questions (name, email, question, answer, answered, created_at) VALUES
('Alex Kumar', 'alex@example.com', 'What documents do I need to bring on the first day?', 
 'You''ll need to bring your admission letter, ID proof (Aadhar/Passport), passport-size photographs (4 copies), and any relevant certificates. Also bring a notebook and pen for orientation sessions.', 
 true, NOW() - INTERVAL '3 days'),

('Priya Sharma', 'priya@example.com', 'Is there accommodation available for outstation students?', 
 'Yes! We have both on-campus hostels and a list of verified off-campus accommodations. The hostel application form is available on the student portal. Apply early as spots fill up quickly.', 
 true, NOW() - INTERVAL '2 days'),

('Rahul Verma', 'rahul@example.com', 'Can I change my elective subjects after registration?', 
 'Yes, you can change electives within the first two weeks of the semester. Visit the academic office with your student ID and fill out the subject change form. Some subjects have limited seats, so act quickly!', 
 true, NOW() - INTERVAL '1 day'),

('Sneha Patel', 'sneha@example.com', 'Are there any scholarship opportunities for first-year students?', 
 NULL, false, NOW() - INTERVAL '12 hours'),

('Arjun Singh', 'arjun@example.com', 'What is the dress code for regular classes?', 
 'We follow a smart casual dress code. Formal attire is required only for presentations, seminars, and special events. Comfortable clothing is recommended for regular classes and lab sessions.', 
 true, NOW() - INTERVAL '6 hours'),

('Meera Reddy', 'meera@example.com', 'How do I access the library resources online?', 
 NULL, false, NOW() - INTERVAL '3 hours'),

('Vikram Joshi', 'vikram@example.com', 'Are there any coding clubs or tech communities?', 
 'Absolutely! We have several tech clubs including the Coding Club, AI/ML Society, Web Development Club, and Robotics Club. Join the club fair during orientation week to sign up!', 
 true, NOW() - INTERVAL '1 hour');

-- ============================================
-- Sample Quiz Scores (Leaderboard)
-- ============================================
INSERT INTO quiz_scores (player_name, score, total_questions, created_at) VALUES
('Sarah Johnson', 5, 5, NOW() - INTERVAL '5 days'),
('Michael Chen', 5, 5, NOW() - INTERVAL '4 days'),
('Emma Williams', 4, 5, NOW() - INTERVAL '4 days'),
('David Brown', 4, 5, NOW() - INTERVAL '3 days'),
('Sophia Martinez', 4, 5, NOW() - INTERVAL '3 days'),
('James Wilson', 3, 5, NOW() - INTERVAL '2 days'),
('Olivia Taylor', 3, 5, NOW() - INTERVAL '2 days'),
('Liam Anderson', 3, 5, NOW() - INTERVAL '1 day'),
('Ava Thomas', 2, 5, NOW() - INTERVAL '1 day'),
('Noah Jackson', 2, 5, NOW() - INTERVAL '12 hours'),
('Isabella White', 5, 5, NOW() - INTERVAL '10 hours'),
('Ethan Harris', 4, 5, NOW() - INTERVAL '8 hours'),
('Mia Martin', 4, 5, NOW() - INTERVAL '6 hours'),
('Lucas Thompson', 3, 5, NOW() - INTERVAL '4 hours'),
('Charlotte Garcia', 3, 5, NOW() - INTERVAL '2 hours');

-- ============================================
-- Sample Feedback
-- ============================================
INSERT INTO feedback (name, email, rating, feedback_text, created_at) VALUES
('Aditya Kapoor', 'aditya@example.com', 5, 
 'The welcome program was amazing! The quiz was fun and informative. Really helped me learn about the university culture.', 
 NOW() - INTERVAL '4 days'),

('Riya Gupta', 'riya@example.com', 4, 
 'Great initiative by the 9th batch! The website is beautiful and easy to navigate. Would love to see more interactive features.', 
 NOW() - INTERVAL '3 days'),

('Karan Malhotra', 'karan@example.com', 5, 
 'Loved the FAQ section! It answered most of my questions. The leaderboard feature makes the quiz competitive and exciting.', 
 NOW() - INTERVAL '2 days'),

('Ananya Iyer', 'ananya@example.com', 4, 
 'The design is stunning! The peacock theme and royal colors really represent our university well. Minor suggestion: add a dark mode toggle.', 
 NOW() - INTERVAL '1 day'),

('Rohan Desai', 'rohan@example.com', 5, 
 'This is exactly what we needed as freshers! The Q&A section is super helpful. Thank you 9th batch for this wonderful welcome!', 
 NOW() - INTERVAL '12 hours'),

('Kavya Nair', 'kavya@example.com', 3, 
 'Good effort overall. The quiz questions could be a bit more challenging. Also, it would be nice to have a mobile app version.', 
 NOW() - INTERVAL '6 hours');

-- ============================================
-- Success Message
-- ============================================
DO $$
BEGIN
    RAISE NOTICE 'Test data inserted successfully!';
    RAISE NOTICE '- 7 sample questions (5 answered, 2 pending)';
    RAISE NOTICE '- 15 sample quiz scores';
    RAISE NOTICE '- 6 sample feedback entries';
END $$;
