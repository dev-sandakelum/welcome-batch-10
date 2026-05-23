'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

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

  const progress = ((currentQuestion + 1) / quizData.length) * 100;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cinzel+Decorative:wght@700&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="/assets/styles.css" />

      <div className="bg-canvas"></div>

      <div style={{position: 'relative', zIndex: 1, maxWidth: '700px', width: '100%', margin: '0 auto', padding: '40px 20px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{width: '100%'}}>
          <Link href="/" style={{display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '20px', transition: 'all 0.3s'}}>
            ← Back to Home
          </Link>
          
          <div className="card">
            <div style={{fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-teal-light)', opacity: 0.8}}>Test Your Knowledge</div>
            <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 600, color: 'var(--accent-gold-light)', marginBottom: '10px'}}>University Quiz</div>
            <div className="gold-line"></div>

            {!quizComplete ? (
              <>
                <div style={{height: '4px', background: 'rgba(201,162,39,0.15)', borderRadius: '4px', marginBottom: '32px'}}>
                  <div style={{height: '100%', background: 'linear-gradient(90deg, var(--accent-gold), var(--accent-teal))', borderRadius: '4px', transition: 'width 0.5s ease', width: `${progress}%`}}></div>
                </div>

                <div style={{fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--accent-teal-light)', textTransform: 'uppercase', marginBottom: '10px'}}>
                  Question {currentQuestion + 1} of {quizData.length}
                </div>
                <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontWeight: 600, marginBottom: '28px', lineHeight: 1.4}}>
                  {quizData[currentQuestion].question}
                </div>

                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px'}}>
                  {quizData[currentQuestion].options.map((option, index) => {
                    let className = 'quiz-opt';
                    let style: React.CSSProperties = {
                      padding: '14px 18px',
                      background: 'rgba(20,8,60,0.65)',
                      border: '1px solid rgba(201,162,39,0.2)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: showFeedback ? 'default' : 'pointer',
                      transition: 'all 0.25s',
                      fontSize: '0.88rem',
                      textAlign: 'left',
                      lineHeight: 1.4,
                      color: 'var(--text-primary)'
                    };

                    if (selectedAnswer === index) {
                      if (showFeedback) {
                        if (index === quizData[currentQuestion].correct) {
                          style = {...style, borderColor: '#3ddc84', background: 'rgba(61,220,132,0.12)', color: '#3ddc84'};
                        } else {
                          style = {...style, borderColor: '#ff6b6b', background: 'rgba(255,107,107,0.12)', color: '#ff6b6b'};
                        }
                      } else {
                        style = {...style, borderColor: 'var(--accent-teal)', background: 'rgba(0,180,216,0.1)'};
                      }
                    } else if (showFeedback && index === quizData[currentQuestion].correct) {
                      style = {...style, borderColor: '#3ddc84', background: 'rgba(61,220,132,0.12)', color: '#3ddc84'};
                    }

                    return (
                      <button
                        key={index}
                        style={style}
                        onClick={() => handleSelectAnswer(index)}
                        disabled={showFeedback}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                <div style={{minHeight: '48px', fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px', fontStyle: 'italic', lineHeight: 1.5}}>
                  {showFeedback && quizData[currentQuestion].feedback}
                </div>

                <button
                  className="btn-gold"
                  onClick={handleNextQuestion}
                  disabled={selectedAnswer === null}
                  style={{width: '100%', justifyContent: 'center'}}
                >
                  {currentQuestion < quizData.length - 1 ? 'Next Question →' : 'Finish Quiz →'}
                </button>
              </>
            ) : (
              <div style={{textAlign: 'center'}}>
                <div style={{fontFamily: "'Cinzel Decorative', serif", fontSize: '4rem', color: 'var(--accent-gold-light)'}}>
                  {score} / {quizData.length}
                </div>
                <div style={{fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '20px'}}>
                  Your Score
                </div>
                <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px'}}>
                  Great job completing the quiz!
                </p>
                
                <div style={{display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', margin: '24px 0 0'}}>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name"
                    className="form-input"
                    style={{flex: 1, minWidth: '140px', borderRadius: '50px', padding: '12px 20px'}}
                  />
                  <button
                    className="btn-gold"
                    onClick={handleSubmitScore}
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit to Leaderboard'}
                  </button>
                </div>
                
                <div style={{marginTop: '20px'}}>
                  <Link href="/leaderboard" className="btn-gold" style={{width: '100%', justifyContent: 'center'}}>
                    View Leaderboard →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .quiz-opt {
            grid-column: 1 / -1 !important;
          }
        }
      `}</style>
    </>
  );
}
