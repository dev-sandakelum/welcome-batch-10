'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface AnsweredQuestion {
  id: string
  participant_name: string
  question: string
  answer: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

export default function AskQuestionPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([])
  const [loadingAnswers, setLoadingAnswers] = useState(true)

  useEffect(() => {
    const fetchAnsweredQuestions = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('user_questions')
          .select('id, participant_name, question, answer')
          .eq('is_answered', true)
          .order('answered_at', { ascending: false })

        if (error) throw error
        setAnsweredQuestions(data || [])
      } catch (err) {
        console.error('Error fetching answered questions:', err)
        setAnsweredQuestions([])
      } finally {
        setLoadingAnswers(false)
      }
    }

    fetchAnsweredQuestions()

    // Set up real-time subscription
    const supabase = createClient()
    const channel = supabase
      .channel('answered_questions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_questions',
          filter: 'is_answered=eq.true',
        },
        () => {
          fetchAnsweredQuestions()
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: submitError } = await supabase
        .from('user_questions')
        .insert([
          {
            participant_name: name,
            participant_email: email,
            question: question,
          },
        ])

      if (submitError) throw submitError

      setName('')
      setEmail('')
      setQuestion('')
      setSubmitted(true)

      setTimeout(() => setSubmitted(false), 4000)
    } catch (err) {
      console.error('[v0] Error submitting question:', err)
      setError('Failed to submit question. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 overflow-hidden">
      <div className="relative z-10">
        {/* Header */}
        <motion.header
          className="flex justify-between items-center p-5 md:p-6 max-w-7xl mx-auto mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="font-edu text-3xl md:text-4xl font-700 text-primary">
            Ask a Question
          </h1>
          <Link href="/">
            <Button variant="outline" className="border-accent text-primary">
              Back Home
            </Button>
          </Link>
        </motion.header>

        {/* Main Content */}
        <motion.div
          className="max-w-2xl mx-auto px-5 md:px-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {submitted ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-6xl mb-4">✨</div>
              <h2 className="font-edu text-2xl font-700 text-primary mb-2">
                Question Submitted!
              </h2>
              <p className="text-foreground/70 font-comic mb-6">
                Thank you for your question. Our admin team will review and answer it shortly.
              </p>
              <Link href="/">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-edu">
                  Return to Home
                </Button>
              </Link>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              className="bg-white/40 backdrop-blur-lg rounded-3xl border-2 border-accent/30 p-8 shadow-2xl"
              variants={itemVariants}
            >
              {error && (
                <motion.div
                  className="mb-6 p-4 bg-destructive/20 border border-destructive/50 rounded-2xl text-destructive font-comic"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.div>
              )}

              {/* Name */}
              <div className="mb-6">
                <label className="block text-sm font-edu font-700 text-primary mb-2">
                  Your Name (required)
                </label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-2xl text-base font-comic border-accent/30 focus:border-accent"
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-6">
                <label className="block text-sm font-edu font-700 text-primary mb-2">
                  Email (optional)
                </label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-2xl text-base font-comic border-accent/30 focus:border-accent"
                />
              </div>

              {/* Question */}
              <div className="mb-6">
                <label className="block text-sm font-edu font-700 text-primary mb-2">
                  Your Question (required)
                </label>
                <Textarea
                  placeholder="Ask your question here..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="rounded-2xl text-base font-comic border-accent/30 focus:border-accent min-h-32 resize-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={loading || !name || !question}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-edu text-lg py-3 rounded-2xl disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Question 💭'}
                </Button>
              </motion.div>
            </motion.form>
          )}

          {/* Answered Questions Section */}
          <motion.div className="mt-16 mb-12" variants={itemVariants}>
            <h2 className="font-edu text-2xl font-700 text-primary mb-6">
              Answered Questions
            </h2>
            {loadingAnswers ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-accent border-t-primary rounded-full animate-spin mx-auto mb-2" />
                <p className="text-foreground/70 font-comic">Loading answered questions...</p>
              </div>
            ) : answeredQuestions.length === 0 ? (
              <div className="bg-white/30 backdrop-blur-md rounded-2xl border border-accent/20 p-6 text-center">
                <p className="text-foreground/70 font-comic">
                  No answered questions yet. Be the first to ask!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {answeredQuestions.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="bg-white/30 backdrop-blur-md rounded-2xl border border-accent/20 p-6 hover:border-accent/40 transition-all"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-primary text-sm font-700">Q</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-edu text-lg font-700 text-primary mb-2">
                          {item.question}
                        </h3>
                        <p className="text-sm text-foreground/60 font-comic mb-4">
                          —{item.participant_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 ml-11">
                      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-accent text-xs font-700">A</span>
                      </div>
                      <p className="text-foreground/80 font-comic leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}
