'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import confetti from 'canvas-confetti'

interface Question {
  id: string
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: string
  display_order?: number
}

type QuizStage = 'info' | 'quiz' | 'results'

export default function QuizPage() {
  const [stage, setStage] = useState<QuizStage>('info')
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [answered, setAnswered] = useState(false)
  const [participantName, setParticipantName] = useState('')
  const [participantEmail, setParticipantEmail] = useState('')

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .order('display_order', { ascending: true })

        if (error) throw error
        setQuestions(data || [])
      } catch (error) {
        console.error('[v0] Error fetching questions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  // Timer logic
  useEffect(() => {
    if (stage !== 'quiz' || answered) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [stage, answered])

  const handleTimeout = () => {
    setAnswered(true)
  }

  const handleAnswer = (answer: string) => {
    if (answered) return

    setSelectedAnswer(answer)
    setAnswered(true)

    const currentQuestion = questions[currentQuestionIndex]
    if (answer === currentQuestion.correct_answer) {
      setScore((prev) => prev + 1)
      // Green flash animation for correct
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#16a34a'],
      })
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setTimeLeft(30)
      setSelectedAnswer('')
      setAnswered(false)
    } else {
      handleQuizComplete()
    }
  }

  const handleQuizComplete = async () => {
    if (!participantName) return

    try {
      const supabase = createClient()
      const percentage = (score / questions.length) * 100

      const { error } = await supabase.from('scores').insert({
        participant_name: participantName,
        participant_email: participantEmail || null,
        score,
        total_questions: questions.length,
        percentage: Math.round(percentage * 100) / 100,
      })

      if (error) throw error

      // Celebration confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })

      setStage('results')
    } catch (error) {
      console.error('[v0] Error saving score:', error)
      setStage('results')
    }
  }

  const handleStartQuiz = () => {
    if (!participantName.trim()) return
    setStage('quiz')
    setScore(0)
    setCurrentQuestionIndex(0)
    setTimeLeft(30)
    setSelectedAnswer('')
    setAnswered(false)
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center relative">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] animate-pulse" />
        <div className="text-center relative z-10">
          <div className="w-12 h-12 border-4 border-accent border-t-primary rounded-full animate-spin mx-auto mb-4" style={{
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)'
          }} />
          <p className="text-foreground font-lora">Loading quiz questions...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen relative">
      {/* Ultra 3D background effects */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1.5s' }} />
      
      <div className="max-w-3xl mx-auto px-5 py-8 relative z-10">
        <motion.header
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link href="/">
            <Button
              variant="ghost"
              className="text-primary hover:bg-card mb-4 rounded-xl btn-3d"
            >
              ← Back
            </Button>
          </Link>
          <h1 className="font-playfair text-4xl md:text-5xl font-700 mb-2 neon-text" style={{
            background: 'linear-gradient(135deg, hsl(45 95% 70%) 0%, hsl(45 100% 55%) 50%, hsl(0 65% 45%) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Knowledge Quiz
          </h1>
          <p className="text-foreground/80 font-lora text-lg">
            30 seconds per question
          </p>
        </motion.header>

        <AnimatePresence mode="wait">
          {/* Info Stage */}
          {stage === 'info' && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="gradient-glass-card backdrop-blur-xl rounded-3xl p-8 card-shadow-3d glow-border"
            >
              <h2 className="font-playfair text-2xl font-600 mb-4 neon-text" style={{
                background: 'linear-gradient(135deg, hsl(45 95% 70%) 0%, hsl(0 65% 45%) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Ready to test your knowledge?
              </h2>
              <p className="text-foreground/80 font-lora mb-6">
                You&apos;ll have 30 seconds to answer each of {questions.length} questions.
                Answer correctly to earn points!
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-playfair font-600 text-accent mb-2">
                    Your Name (required)
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={participantName}
                    onChange={(e) => setParticipantName(e.target.value)}
                    className="rounded-xl text-base font-lora border-2 border-accent/50 bg-background/50 backdrop-blur-sm focus:border-accent focus:ring-2 focus:ring-accent/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-playfair font-600 text-accent mb-2">
                    Email (optional)
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={participantEmail}
                    onChange={(e) => setParticipantEmail(e.target.value)}
                    className="rounded-xl text-base font-lora border-2 border-accent/50 bg-background/50 backdrop-blur-sm focus:border-accent focus:ring-2 focus:ring-accent/50"
                  />
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  onClick={handleStartQuiz}
                  disabled={!participantName.trim()}
                  className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground rounded-2xl font-playfair text-lg py-6 btn-3d"
                >
                  Start Quiz! 🎮
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Quiz Stage */}
          {stage === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Progress */}
              <motion.div
                className="mb-6 bg-card backdrop-blur-md rounded-2xl p-4 border-2 border-border card-shadow"
                animate={
                  timeLeft === 0 && answered
                    ? { x: [-8, 8, -8, 8, 0] }
                    : timeLeft <= 10
                      ? { borderColor: ['#ef4444', '#fca5a5', '#ef4444'] }
                      : {}
                }
                transition={{
                  duration: timeLeft === 0 && answered ? 0.4 : 1,
                  repeat: timeLeft <= 10 && timeLeft > 0 && !answered ? Infinity : 0,
                  repeatType: 'loop',
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-playfair font-600 text-primary">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                  <motion.span
                    className={`font-playfair font-700 text-lg ${
                      timeLeft <= 10 ? 'text-red-600' : 'text-accent'
                    }`}
                    animate={
                      timeLeft <= 10
                        ? { scale: [1, 1.1, 1] }
                        : {}
                    }
                    transition={{
                      duration: 0.6,
                      repeat: timeLeft <= 10 && timeLeft > 0 && !answered ? Infinity : 0,
                    }}
                  >
                    {timeLeft}s
                  </motion.span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      timeLeft <= 10 ? 'bg-red-500' : 'bg-accent'
                    }`}
                    initial={{ width: '100%' }}
                    animate={{ width: `${(timeLeft / 30) * 100}%` }}
                    transition={{ duration: 0.3, ease: 'linear' }}
                  />
                </div>
              </motion.div>

              {/* Question */}
              <motion.div
                className="bg-card backdrop-blur-md border-2 border-border rounded-3xl p-6 mb-6 card-shadow"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                key={currentQuestionIndex}
              >
                <h3 className="font-playfair text-2xl font-600 text-primary mb-6">
                  {questions[currentQuestionIndex]?.question_text}
                </h3>

                <div className="space-y-3">
                  {[
                    { key: 'A', text: questions[currentQuestionIndex]?.option_a },
                    { key: 'B', text: questions[currentQuestionIndex]?.option_b },
                    { key: 'C', text: questions[currentQuestionIndex]?.option_c },
                    { key: 'D', text: questions[currentQuestionIndex]?.option_d },
                  ].map(({ key, text }) => {
                    const isSelected = selectedAnswer === key
                    const isCorrect = key === questions[currentQuestionIndex]?.correct_answer
                    const showCorrect = answered && isCorrect
                    const showIncorrect =
                      answered && isSelected && !isCorrect

                    return (
                      <motion.button
                        key={key}
                        onClick={() => handleAnswer(key)}
                        disabled={answered}
                        className={`w-full p-4 text-left rounded-2xl font-lora transition-all ${
                          showCorrect
                            ? 'bg-green-500 text-white border-2 border-green-600'
                            : showIncorrect
                            ? 'bg-red-500 text-white border-2 border-red-600'
                            : isSelected
                            ? 'bg-accent text-accent-foreground border-2 border-accent'
                            : 'bg-background hover:bg-muted/30 border-2 border-border'
                        }`}
                        whileHover={!answered ? { scale: 1.02 } : {}}
                        whileTap={!answered ? { scale: 0.98 } : {}}
                      >
                        <span className="font-600">{key}.</span> {text}
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>

              {/* Next Button */}
              {answered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Button
                    onClick={handleNextQuestion}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-playfair text-lg py-6 shadow-lg"
                  >
                    {currentQuestionIndex < questions.length - 1
                      ? 'Next Question →'
                      : 'See Results! 🏆'}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Results Stage */}
          {stage === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-card backdrop-blur-md border-2 border-border rounded-3xl p-8 text-center card-shadow"
            >
              <div className="mb-6">
                <div className="text-6xl mb-4 font-playfair font-700 text-primary">
                  {score}/{questions.length}
                </div>
                <h2 className="font-playfair text-3xl font-600 text-primary mb-2">
                  You&apos;re in! 🎉
                </h2>
                <p className="text-lg text-foreground/70 font-lora">
                  Congratulations! You scored {Math.round((score / questions.length) * 100)}%
                </p>
              </div>

              <div className="bg-accent/20 rounded-2xl p-6 mb-6 border-2 border-accent/40">
                <p className="font-playfair font-600 text-primary mb-2">
                  Thanks for participating! 🙏
                </p>
                <p className="text-foreground/70 font-lora text-sm">
                  Share your feedback to help us improve the ceremony.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <Link href="/feedback" className="w-full">
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-2xl font-playfair text-lg py-6 shadow-lg">
                    Share Feedback
                  </Button>
                </Link>
                <Link href="/leaderboard" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-2xl font-playfair text-lg py-6"
                  >
                    View Leaderboard
                  </Button>
                </Link>
                <Link href="/" className="w-full">
                  <Button
                    variant="ghost"
                    className="w-full text-primary hover:bg-card rounded-2xl font-playfair text-lg py-6"
                  >
                    Back to Home
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
