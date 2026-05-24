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
    question: "Where is the main campus complex of the University of Ruhuna located?",
    options: ["Wellamadama Matara", "Karapitiya Galle", "Karagoda Uyangoda Kaburupitiya", "Hapugala Galle"],
    correct: 0,
    feedback: "The central administrative offices and main 72-acre complex are situated at Wellamadama in Matara."
  },
  {
    question: "In what year was the Faculty of Technology officially established?",
    options: ["1984", "2000", "2022", "2016"],
    correct: 3,
    feedback: "The Faculty of Technology is a relatively young faculty, founded via official gazette on April 26, 2016."
  },
  {
    question: "How many academic departments under the Faculty of Technology?",
    options: ["2", "4", "6", "8"],
    correct: 1,
    feedback: "It comprises four departments:- Engineering Technology, ICT, Biosystems Technology, and Multidisciplinary Studies."
  },
  {
    question: "Which nearest faculty is located right alongside the Faculty of Technology in the Kamburupitiya area?",
    options: ["Faculty of Engineering", "Faculty of Medicine", "Faculty of Agriculture", "Faculty of Management and Finance"],
    correct: 2,
    feedback: "The Faculty of Agriculture is located in the Kaburupitiya district zone."
  },
  {
    question: "Who was the world-renowned architect who designed the scenic main campus buildings?",
    options: ["Minnette de Silva", "Valentine Gunasekara", "Geoffrey Bawa", "Oliver Weerasinghe"],
    correct: 2,
    feedback: "All our events are equally popular and well-attended by students!"
  },
  {
    question: "The University of Ruhuna is the _____ oldest university in Sri Lanka.",
    options: ["6th", "5th", "4th", "3rd"],
    correct: 0,
    feedback: "The university, elevated to a fully-fledged university in 1984, is Sri Lanka's 6th oldest university."
  },
  {
    question: "How many faculties does the University of Ruhuna currently have?",
    options: ["7", "8", "10", "12"],
    correct: 2,
    feedback: "The University of Ruhuna comprises ten faculties, including Agriculture, Medicine, Engineering, Science, and Technology."
  },
  {
    question: "What annual event is held specifically to display the artistic skills of the newest freshman batch?",
    options: ["TechSprint", "Bhawa Talent Show", "RICIT", "HackTrail"],
    correct: 1,
    feedback: "Bhawa is the traditional freshers' welcome cultural show arranged by the technology students."
  },
  {
    question: "Who serves as the ceremonial head of the university to preside over the convocation?",
    options: ["The Vice-Chancellor", "The Dean", "The Registrar", "The Chancellor"],
    correct: 3,
    feedback: "The Chancellor serves as the ceremonial head of the university to officially preside over the convocation and confer degrees upon the graduates."
  },
  {
    question: "Who serves as the Dean of the Faculty of Technology, entering a second consecutive tenure in early 2026?",
    options: ["Prof. Subash Jayasinghe", "Dr. Kaushalya Wijesekara", "Dr. Wathsala Rajawatta", "Dr. Nissanka Wijeratne"],
    correct: 0,
    feedback: "Prof. Subash Jayasinghe formally assumed duties for his second tenure as Dean."
  },
  {
    question: "How many books are held in the core collection of the university's Main Library?",
    options: ["About 100,000", "Over 500,000", "Nearly 300,000", "Over 1 million"],
    correct: 2,
    feedback: "The Main Library's core collection contains nearly 300,000 books."
  },
  {
    question: "What is the official motto of the University of Ruhuna?",
    options: ["Knowledge is Power", "Learn, Lead, Serve", "Wisdom to mankind is a treasure", "To be the prime intellectual thrust"],
    correct: 2,
    feedback: "In keeping with its motto 'Wisdom to mankind is a treasure' the university strives for high academic standards."
  },
  {
    question: "What type of degree does the Faculty of Technology offer?",
    options: ["3-year pass degree", "4-year honours degree", "2-year diploma", "Postgraduate only"],
    correct: 1,
    feedback: "4-year honours degree."
  },
  {
    question: "Which faculties are located at the Galle?",
    options: ["Agriculture and Technology", "Science and Management", "Fisheries and Humanities", "Engineering and Medicine"],
    correct: 3,
    feedback: "The faculties of Engineering and Medicine are located in Galle."
  },
  
  {
    question: ". The University of Ruhuna offers degrees at which levels?",
    options: ["Bachelor's only", "Bachelor's and Master's only", "Bachelor's, Master's, and PhD", "Diploma and Bachelor's only"],
    correct: 2,
    feedback: "The University of Ruhuna offers Bachelor's, Master's, and PhD degrees."
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
  const [isHighDpi, setIsHighDpi] = useState(false);

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

  // ─── Detect high-DPI display (>300 dpi) ───────────────────────────────────
  useEffect(() => {
    // window.devicePixelRatio maps CSS px → physical px.
    // 300 DPI on a ~96 DPI baseline ≈ ratio > 3.
    const checkDpi = () => {
      setIsHighDpi(window.devicePixelRatio > 3);
    };
    checkDpi();
    // Re-check if the user moves the window to a different monitor
    const mq = window.matchMedia(`(resolution > 300dpi)`);
    mq.addEventListener('change', checkDpi);
    return () => mq.removeEventListener('change', checkDpi);
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
    toastTimerRef.current = setTimeout(() => setShowToast(false), isHighDpi ? 5000 : 8000);
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

                <ul className="quiz-rules-list">
                  <li className="quiz-rule-item">
                    <span className="quiz-rule-icon">🔒</span>
                    <div>
                      <strong>One Attempt Only</strong>
                      <p>You cannot restart or retake the quiz.</p>
                    </div>
                  </li>
                  <li className="quiz-rule-item">
                    <span className="quiz-rule-icon">⏱️</span>
                    <div>
                      <strong>30-Second Timer</strong>
                      <p>Each question has a 30-second countdown.</p>
                    </div>
                  </li>
                  <li className="quiz-rule-item">
                    <span className="quiz-rule-icon">🚀</span>
                    <div>
                      <strong>Speed Bonus</strong>
                      <p>Faster correct answers earn more points.</p>
                    </div>
                  </li>
                  <li className="quiz-rule-item">
                    <span className="quiz-rule-icon">⚠️</span>
                    <div>
                      <strong>Overdue</strong>
                      <p>After time runs out you can still answer, but only earn {OVERDUE_PENALTY} pts.</p>
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
        <div className={`quiz-toast ${toastIsCorrect ? 'correct' : 'incorrect'}${isHighDpi ? ' high-dpi' : ''}`}>
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
