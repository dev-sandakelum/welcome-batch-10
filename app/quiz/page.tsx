'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
  initAuroraParticles,
  initMagneticCards,
  initGlassShimmer,
} from '@/lib/gsap-animations';
import '../styles/quiz.css';

const quizData = [
  {
    question: "What year was the university founded?",
    options: ["1985", "1990", "1995", "2000"],
    correct: 1,
    feedback: "The university was founded in 1990!"
  },
  {
    question: "What is the university's motto?",
    options: ["Knowledge is Power", "Excellence in Education", "Learn to Lead", "Wisdom and Growth"],
    correct: 2,
    feedback: "Our motto is 'Learn to Lead' - empowering students to become future leaders!"
  },
  {
    question: "How many faculties does the university have?",
    options: ["5", "7", "9", "11"],
    correct: 1,
    feedback: "We have 7 diverse faculties covering various fields of study!"
  },
  {
    question: "What is the name of the main library?",
    options: ["Central Library", "Knowledge Hub", "Heritage Library", "Scholar's Haven"],
    correct: 2,
    feedback: "The Heritage Library is our main library with over 100,000 books!"
  },
  {
    question: "Which annual event is the most popular?",
    options: ["Tech Fest", "Cultural Night", "Sports Week", "All of the above"],
    correct: 3,
    feedback: "All our events are equally popular and well-attended by students!"
  }
];

export default function QuizPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if user has already completed the quiz
    const completedQuiz = document.cookie
      .split('; ')
      .find(row => row.startsWith('quiz_completed='));
    
    if (completedQuiz) {
      setHasCompletedQuiz(true);
    }

    initAuroraParticles();
    initMagneticCards();
    initGlassShimmer();
  }, []);

  const handleStartQuiz = () => {
    if (!playerName.trim()) {
      alert('Please enter your name to start the quiz!');
      return;
    }
    setQuizStarted(true);
  };

  const handleSelectAnswer = (index: number) => {
    if (showFeedback) return;
    
    setSelectedAnswer(index);
    
    // Auto-check answer immediately
    const isCorrect = index === quizData[currentQuestion].correct;
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setShowFeedback(true);

    // Auto-hide toast after 8 seconds
    setTimeout(() => {
      setShowFeedback(false);
    }, 8000);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setQuizComplete(true);
      // Auto-submit score when quiz is completed
      handleSubmitScore();
    }
  };

  const handleSubmitScore = async () => {
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('quiz_scores')
        .insert([
          {
            player_name: playerName,
            score: score,
            total_questions: quizData.length
          }
        ]);

      if (error) throw error;

      // Set cookie to prevent retaking quiz (expires in 30 days)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      document.cookie = `quiz_completed=true; expires=${expiryDate.toUTCString()}; path=/`;

      // Redirect to leaderboard after a short delay
      setTimeout(() => {
        router.push('/leaderboard');
      }, 2000);
    } catch (error) {
      console.error('Error submitting score:', error);
      alert('Failed to submit score. Please try again.');
      setSubmitting(false);
    }
  };

  const getOptionClass = (index: number): string => {
    if (selectedAnswer === index) {
      if (showFeedback) {
        return index === quizData[currentQuestion].correct ? 'quiz-option correct' : 'quiz-option incorrect';
      }
      return 'quiz-option selected';
    }
    if (showFeedback && index === quizData[currentQuestion].correct) {
      return 'quiz-option correct';
    }
    return 'quiz-option';
  };

  const progress = ((currentQuestion + 1) / quizData.length) * 100;

  return (
    <>
      {/* Aurora particle canvas — sits above bg, below content */}
      <canvas id="aurora-canvas" aria-hidden="true" />

      {/* Background image layer */}
      <div className="bg-canvas">
        <svg
          className="feather-bg"
          viewBox="0 0 200 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <ellipse cx="100" cy="300" rx="12" ry="280" fill="url(#fg1)" opacity="0.7" />
          <ellipse cx="100" cy="120" rx="60" ry="100" fill="url(#fg2)" opacity="0.6" />
          <circle cx="100" cy="100" r="22" fill="#1b6b3a" opacity="0.8" />
          <circle cx="100" cy="100" r="14" fill="#00b4d8" opacity="0.9" />
          <circle cx="100" cy="100" r="7" fill="#241559" opacity="1" />
          <defs>
            <radialGradient id="fg1" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#1b6b3a" />
              <stop offset="100%" stopColor="#241559" />
            </radialGradient>
            <radialGradient id="fg2" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#00b4d8" />
              <stop offset="100%" stopColor="#1b6b3a" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <div className="quiz-page-wrapper">
        <div className="quiz-page-content">
          <Link href="/" className="quiz-back-link">
            ← Back to Home
          </Link>

          <div className="card">
            <div className="quiz-card-label">Test Your Knowledge</div>
            <div className="quiz-card-title">University Quiz</div>
            <div className="gold-line"></div>

            {hasCompletedQuiz ? (
              <div className="quiz-already-completed">
                <div className="quiz-completed-icon">🎓</div>
                <div className="quiz-completed-title">Quiz Already Completed</div>
                <p className="quiz-completed-message">
                  You have already taken this quiz. Each person can only take the quiz once.
                </p>
                <div className="quiz-completed-actions">
                  <Link href="/leaderboard" className="btn-gold">
                    View Leaderboard 🏆
                  </Link>
                  <Link href="/" className="btn-outline">
                    Back to Home
                  </Link>
                </div>
              </div>
            ) : !quizStarted ? (
              <div className="quiz-start-screen">
                <div className="quiz-start-icon">🧠</div>
                <p className="quiz-start-description">
                  Test your knowledge about our university! Answer {quizData.length} questions and see how you rank on the leaderboard.
                </p>
                
                <div className="form-group">
                  <label className="form-label">Enter Your Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Your name"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleStartQuiz();
                      }
                    }}
                  />
                </div>

                <button
                  className="btn-gold quiz-start-btn"
                  onClick={handleStartQuiz}
                >
                  Start Quiz →
                </button>
              </div>
            ) : !quizComplete ? (
              <>
                <div className="quiz-progress-container">
                  <div className="quiz-progress-bar" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="quiz-question-number">
                  Question {currentQuestion + 1} of {quizData.length}
                </div>
                <div className="quiz-question-text">
                  {quizData[currentQuestion].question}
                </div>

                <div className="quiz-options-grid">
                  {quizData[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      className={getOptionClass(index)}
                      onClick={() => handleSelectAnswer(index)}
                      disabled={showFeedback}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <button
                  className="btn-gold quiz-next-btn"
                  onClick={handleNextQuestion}
                  disabled={!showFeedback}
                >
                  {currentQuestion < quizData.length - 1 ? 'Next Question →' : 'Finish Quiz →'}
                </button>
              </>
            ) : (
              <div className="quiz-results">
                <div className="quiz-score-display">
                  {score} / {quizData.length}
                </div>
                <div className="quiz-score-label">Your Score</div>
                <p className="quiz-score-message">Great job, {playerName}!</p>

                {submitting ? (
                  <div className="quiz-submitting">
                    <div className="quiz-submitting-spinner"></div>
                    <p className="quiz-submitting-text">Submitting your score...</p>
                  </div>
                ) : (
                  <div className="quiz-submitted">
                    <div className="quiz-submitted-icon">✓</div>
                    <p className="quiz-submitted-text">Score submitted! Redirecting to leaderboard...</p>
                  </div>
                )}

                <div className="quiz-leaderboard-link">
                  <Link href="/leaderboard" className="btn-gold quiz-leaderboard-btn">
                    View Leaderboard →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showFeedback && (
        <div className={`quiz-toast ${selectedAnswer === quizData[currentQuestion].correct ? 'correct' : 'incorrect'}`}>
          <div className="quiz-toast-icon">
            {selectedAnswer === quizData[currentQuestion].correct ? '✓' : '✗'}
          </div>
          <div className="quiz-toast-content">
            <div className="quiz-toast-title">
              {selectedAnswer === quizData[currentQuestion].correct ? 'Correct!' : 'Incorrect'}
            </div>
            <div className="quiz-toast-text">
              {quizData[currentQuestion].feedback}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
