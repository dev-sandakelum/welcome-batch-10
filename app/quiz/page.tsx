'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import '../styles/quiz.css';
import PageShell from '@/app/components/PageShell';

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

  const handleSelectAnswer = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === quizData[currentQuestion].correct;
    if (isCorrect) {
      setScore(score + 1);
    }

    setShowFeedback(true);

    setTimeout(() => {
      if (currentQuestion < quizData.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        setQuizComplete(true);
      }
    }, 2000);
  };

  const handleSubmitScore = async () => {
    if (!playerName.trim()) {
      alert('Please enter your name!');
      return;
    }

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

      alert('Score submitted successfully!');
      router.push('/leaderboard');
    } catch (error) {
      console.error('Error submitting score:', error);
      alert('Failed to submit score. Please try again.');
    } finally {
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
      <link rel="stylesheet" href="/assets/styles.css" />
      <link rel="stylesheet" href="/assets/styles-tablet.css" />
      <link rel="stylesheet" href="/assets/styles-mobile.css" />
      <link rel="stylesheet" href="/assets/styles-mobile-small.css" />
      <link rel="stylesheet" href="/assets/styles-mobile-extra-small.css" />

      <PageShell>

      <div className="quiz-page-wrapper">
        <div className="quiz-page-content">
          <Link href="/" className="quiz-back-link">
            ← Back to Home
          </Link>

          <div className="card">
            <div className="quiz-card-label">Test Your Knowledge</div>
            <div className="quiz-card-title">University Quiz</div>
            <div className="gold-line"></div>

            {!quizComplete ? (
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

                <div className="quiz-feedback">
                  {showFeedback && quizData[currentQuestion].feedback}
                </div>

                <button
                  className="btn-gold quiz-next-btn"
                  onClick={handleNextQuestion}
                  disabled={selectedAnswer === null}
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
                <p className="quiz-score-message">Great job completing the quiz!</p>

                <div className="quiz-submit-row">
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name"
                    className="form-input quiz-name-input"
                  />
                  <button
                    className="btn-gold"
                    onClick={handleSubmitScore}
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit to Leaderboard'}
                  </button>
                </div>

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
      </PageShell>
    </>
  );
}
