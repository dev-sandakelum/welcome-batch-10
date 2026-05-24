'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  initAuroraParticles,
  initMagneticCards,
  initGlassShimmer,
} from '@/lib/gsap-animations';
import '../styles/quiz.css';

// ─── Scoring constants ────────────────────────────────────────────────────────
const TIMER_SECONDS   = 30;
const BASE_POINTS     = 100;   // points for a correct answer
const SPEED_BONUS     = 5;     // extra points per remaining second
const OVERDUE_PENALTY = 10;    // flat points awarded when overdue + correct

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

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen = 'instructions' | 'name-entry' | 'quiz' | 'results' | 'already-done';

interface QuestionResult {
  questionIndex: number;
  selectedAnswer: number | null;
  isCorrect: boolean;
  isOverdue: boolean;
  pointsEarned: number;
  secondsRemaining: number;
}

export default function QuizPage() {

  // ── Screen state ─────────────────────────────────────────────────────────
  const [screen, setScreen] = useState<Screen>('instructions');

  // ── Player ───────────────────────────────────────────────────────────────
  const [playerName, setPlayerName] = useState('');

  // ── Quiz progress ─────────────────────────────────────────────────────────
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [results, setResults] = useState<QuestionResult[]>([]);

  // ── Per-question state ────────────────────────────────────────────────────
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);          // answer locked in
  const [isOverdue, setIsOverdue] = useState(false);          // timer hit 0
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);

  // ── Toast ─────────────────────────────────────────────────────────────────
  const [showToast, setShowToast] = useState(false);
  const [toastIsCorrect, setToastIsCorrect] = useState(false);
  const [toastPoints, setToastPoints] = useState(0);

  // ── DB submission ─────────────────────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false);

  // ── Refs ──────────────────────────────────────────────────────────────────
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Init animations ──────────────────────────────────────────────────────
  useEffect(() => {
    const completedQuiz = document.cookie
      .split('; ')
      .find(row => row.startsWith('quiz_completed='));
    if (completedQuiz) {
      setScreen('already-done');
    }

    initAuroraParticles();
    initMagneticCards();
    initGlassShimmer();
  }, []);

  // ─── Start countdown for a question ───────────────────────────────────────
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(TIMER_SECONDS);
    setQuestionStartTime(Date.now());

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsOverdue(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // ─── Clean up timer on unmount ─────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // ─── Start quiz ────────────────────────────────────────────────────────────
  const handleStartQuiz = () => {
    if (!playerName.trim()) {
      alert('Please enter your name to start the quiz!');
      return;
    }
    setScreen('quiz');
    setCurrentQuestion(0);
    setTotalScore(0);
    setResults([]);
    setSelectedAnswer(null);
    setSubmitted(false);
    setIsOverdue(false);
    startTimer();
  };

  // ─── Select an answer → immediately evaluate ──────────────────────────────
  const handleSelectAnswer = (index: number) => {
    if (submitted) return;   // already locked

    setSelectedAnswer(index);

    // Stop timer
    if (timerRef.current) clearInterval(timerRef.current);

    const elapsed = (Date.now() - questionStartTime) / 1000;
    const secondsRemaining = Math.max(0, TIMER_SECONDS - Math.floor(elapsed));
    const isCorrect = index === quizData[currentQuestion].correct;
    const overdueNow = isOverdue || secondsRemaining === 0;

    // Calculate points
    let pointsEarned = 0;
    if (isCorrect) {
      pointsEarned = overdueNow
        ? OVERDUE_PENALTY
        : BASE_POINTS + secondsRemaining * SPEED_BONUS;
    }

    const result: QuestionResult = {
      questionIndex: currentQuestion,
      selectedAnswer: index,
      isCorrect,
      isOverdue: overdueNow,
      pointsEarned,
      secondsRemaining,
    };

    setResults(prev => [...prev, result]);
    setTotalScore(prev => prev + pointsEarned);
    setSubmitted(true);

    // Show toast
    setToastIsCorrect(isCorrect);
    setToastPoints(pointsEarned);
    setShowToast(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setShowToast(false), 8000);
  };

  // ─── (submit button removed — evaluation happens on click) ────────────────

  // ─── Next question / finish ────────────────────────────────────────────────
  const handleNextQuestion = () => {
    setShowToast(false);

    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setSubmitted(false);
      setIsOverdue(false);
      startTimer();
    } else {
      // Quiz complete — save to DB
      setScreen('results');
      saveScore(totalScore);
    }
  };

  // ─── Save score to Supabase ────────────────────────────────────────────────
  const saveScore = async (finalScore: number) => {
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('quiz_scores')
        .insert([{
          player_name: playerName,
          score: finalScore,
          total_questions: quizData.length,
        }]);

      if (error) throw error;

      // Cookie to prevent retake (30 days)
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 30);
      document.cookie = `quiz_completed=true; expires=${expiry.toUTCString()}; path=/`;
    } catch (err) {
      console.error('Error submitting score:', err);
      alert('Failed to submit score. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Option CSS class ──────────────────────────────────────────────────────
  const getOptionClass = (index: number): string => {
    if (!submitted) {
      return selectedAnswer === index ? 'quiz-option selected' : 'quiz-option';
    }
    if (index === quizData[currentQuestion].correct) return 'quiz-option correct';
    if (index === selectedAnswer) return 'quiz-option incorrect';
    return 'quiz-option';
  };

  // ─── Timer colour ──────────────────────────────────────────────────────────
  const timerClass = isOverdue
    ? 'quiz-timer overdue'
    : timeLeft <= 10
    ? 'quiz-timer danger'
    : timeLeft <= 20
    ? 'quiz-timer warning'
    : 'quiz-timer';

  const progress = ((currentQuestion + 1) / quizData.length) * 100;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <canvas id="aurora-canvas" aria-hidden="true" />

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
          <Link href="/" className="quiz-back-link">← Back to Home</Link>

          <div className="card">
            <div className="quiz-card-label">Test Your Knowledge</div>
            <div className="quiz-card-title">University Quiz</div>
            <div className="gold-line"></div>

            {/* ── Already completed ── */}
            {screen === 'already-done' && (
              <div className="quiz-already-completed">
                <div className="quiz-completed-icon">🎓</div>
                <div className="quiz-completed-title">Quiz Already Completed</div>
                <p className="quiz-completed-message">
                  You have already taken this quiz. Each person can only take the quiz once.
                </p>
                <div className="quiz-completed-actions">
                  <Link href="/leaderboard" className="btn-gold">View Leaderboard 🏆</Link>
                  <Link href="/" className="btn-outline">Back to Home</Link>
                </div>
              </div>
            )}

            {/* ── Instructions screen ── */}
            {screen === 'instructions' && (
              <div className="quiz-instructions-screen">
                
                <h2 className="quiz-instructions-title">Before You Begin</h2>
                <p className="quiz-instructions-subtitle">
                  Read these rules carefully — they apply for the entire quiz.
                </p>

                <ul className="quiz-rules-list">
                  <li className="quiz-rule-item">
                    <span className="quiz-rule-icon">🔒</span>
                    <div>
                      <strong>One-Time Attempt</strong>
                      <p>This quiz is a one-time event. Once you click Start, you cannot restart, refresh, or retake it.</p>
                    </div>
                  </li>
                  <li className="quiz-rule-item">
                    <span className="quiz-rule-icon">⏱️</span>
                    <div>
                      <strong>30-Second Dynamic Timer</strong>
                      <p>You have a maximum of 30 seconds to answer each question. The clock starts the moment the question appears.</p>
                    </div>
                  </li>
                  <li className="quiz-rule-item">
                    <span className="quiz-rule-icon">🚀</span>
                    <div>
                      <strong>Speed Bonus</strong>
                      <p>Every single second counts! Correct answers submitted faster earn significantly higher extra points. </p>
                    </div>
                  </li>
                  <li className="quiz-rule-item">
                    <span className="quiz-rule-icon">⚠️</span>
                    <div>
                      <strong>Overdue Penalty</strong>
                      <p>If the 30-second timer runs out, the quiz will <em>not</em> skip automatically. You can still submit your answer, but it will be marked <strong>Overdue</strong> and will receive only {OVERDUE_PENALTY} points even if correct.</p>
                    </div>
                  </li>
                  <li className="quiz-rule-item">
                    <span className="quiz-rule-icon">🏁</span>
                    <div>
                      <strong>Finality</strong>
                      <p>Your score is locked immediately upon submission. Ensure your internet connection is stable before proceeding.</p>
                    </div>
                  </li>
                </ul>

                <button
                  className="btn-gold quiz-start-btn"
                  onClick={() => setScreen('name-entry')}
                >
                  I Understand &amp; Continue
                </button>
              </div>
            )}

            {/* ── Name entry ── */}
            {screen === 'name-entry' && (
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
                    onKeyDown={(e) => { if (e.key === 'Enter') handleStartQuiz(); }}
                  />
                </div>

                <button className="btn-gold quiz-start-btn" onClick={handleStartQuiz}>
                  Start Quiz →
                </button>
              </div>
            )}

            {/* ── Active quiz ── */}
            {screen === 'quiz' && (
              <>
                {/* Progress bar */}
                <div className="quiz-progress-container">
                  <div className="quiz-progress-bar" style={{ width: `${progress}%` }}></div>
                </div>

                {/* Timer + question header */}
                <div className="quiz-question-header">
                  <div className="quiz-question-number">
                    Question {currentQuestion + 1} of {quizData.length}
                  </div>
                  <div className={timerClass} aria-live="polite" aria-label={`Time remaining: ${timeLeft} seconds`}>
                    {isOverdue ? (
                      <span className="quiz-timer-overdue-label">⚠ OVERDUE</span>
                    ) : (
                      <>
                        <svg className="quiz-timer-ring" viewBox="0 0 36 36" aria-hidden="true">
                          <circle
                            className="quiz-timer-ring-bg"
                            cx="18" cy="18" r="15.9"
                            fill="none" strokeWidth="2.5"
                          />
                          <circle
                            className="quiz-timer-ring-fill"
                            cx="18" cy="18" r="15.9"
                            fill="none" strokeWidth="2.5"
                            strokeDasharray={`${(timeLeft / TIMER_SECONDS) * 100} 100`}
                            strokeLinecap="round"
                            transform="rotate(-90 18 18)"
                          />
                        </svg>
                        <span className="quiz-timer-number">{timeLeft}</span>
                      </>
                    )}
                  </div>
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
                      disabled={submitted}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {/* Next button — disabled until an answer is clicked */}
                {!submitted ? (
                  <button
                    className="btn-gold quiz-next-btn"
                    disabled
                  >
                    {isOverdue ? '⚠ Select an answer to continue' : 'Select an answer →'}
                  </button>
                ) : (
                  <button className="btn-gold quiz-next-btn" onClick={handleNextQuestion}>
                    {currentQuestion < quizData.length - 1 ? 'Next Question →' : 'Finish Quiz →'}
                  </button>
                )}
              </>
            )}

            {/* ── Results ── */}
            {screen === 'results' && (
              <div className="quiz-results">
                <div className="quiz-score-display">{totalScore}</div>
                <div className="quiz-score-label">Total Points</div>
                <p className="quiz-score-message">
                  {results.filter(r => r.isCorrect).length} / {quizData.length} correct — well done, {playerName}!
                </p>

                {/* Per-question breakdown */}
                <div className="quiz-breakdown">
                  {results.map((r, i) => (
                    <div key={i} className={`quiz-breakdown-row ${r.isCorrect ? 'correct' : 'incorrect'}`}>
                      <span className="quiz-breakdown-q">Q{i + 1}</span>
                      <span className="quiz-breakdown-status">
                        {r.isCorrect ? '✓' : '✗'}
                        {r.isOverdue && <span className="quiz-overdue-tag"> Overdue</span>}
                      </span>
                      <span className="quiz-breakdown-pts">+{r.pointsEarned} pts</span>
                    </div>
                  ))}
                </div>

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

      {/* ── Toast notification ── */}
      {showToast && submitted && (
        <div className={`quiz-toast ${toastIsCorrect ? 'correct' : 'incorrect'}`}>
          <div className="quiz-toast-icon">
            {toastIsCorrect ? '✓' : '✗'}
          </div>
          <div className="quiz-toast-content">
            <div className="quiz-toast-title">
              {toastIsCorrect
                ? `Correct! +${toastPoints} pts${results[results.length - 1]?.isOverdue ? ' (Overdue)' : ''}`
                : 'Incorrect — 0 pts'}
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
