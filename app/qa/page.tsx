'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Question {
  id: string
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  display_order?: number
}

export default function QAPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .order('display_order', { ascending: true })
          .limit(5)

        if (error) throw error
        setQuestions(data || [])
      } catch (error) {
        console.error('[v0] Error fetching questions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()

    // Poll for new questions every 15 seconds
    const pollInterval = setInterval(fetchQuestions, 15000)
    return () => clearInterval(pollInterval)
  }, [])

  const handleAnswer = (questionId: string, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleSubmit = async () => {
    // Store responses and redirect to results
    setSubmitted(true)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#FDF5E6] to-[#F5E6D3] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground font-lora">Loading questions...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FDF5E6] to-[#F5E6D3]">
      <div className="max-w-3xl mx-auto px-5 py-8">
        {/* Header */}
        <motion.header
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link href="/">
            <Button
              variant="ghost"
              className="text-primary hover:bg-accent/10 mb-4"
            >
              ← Back
            </Button>
          </Link>
          <h1 className="font-playfair text-4xl md:text-5xl font-700 text-primary mb-2">
            Interactive Q&A
          </h1>
          <p className="text-foreground/70 font-lora text-lg">
            Share your thoughts on these questions
          </p>
        </motion.header>

        {/* Questions */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {questions.length === 0 ? (
            <div className="bg-white/40 backdrop-blur-md rounded-2xl p-8 text-center border-2 border-accent/20">
              <p className="text-foreground/70 font-lora text-lg">
                No questions available yet. Check back soon! 🙏
              </p>
            </div>
          ) : (
            questions.map((question, index) => (
              <motion.div
                key={question.id}
                className="bg-white/40 backdrop-blur-md border-2 border-accent/30 rounded-2xl p-6 hover:border-accent/60 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <h3 className="font-playfair text-xl font-600 text-primary mb-4">
                  {question.question_text}
                </h3>

                <div className="space-y-3">
                  {[
                    { key: 'A', text: question.option_a },
                    { key: 'B', text: question.option_b },
                    { key: 'C', text: question.option_c },
                    { key: 'D', text: question.option_d },
                  ].map(({ key, text }) => (
                    <button
                      key={key}
                      onClick={() => handleAnswer(question.id, key)}
                      className={`w-full p-4 text-left rounded-xl font-lora transition-all ${
                        selectedAnswers[question.id] === key
                          ? 'bg-accent text-accent-foreground border-2 border-accent'
                          : 'bg-white/50 hover:bg-white/70 border-2 border-accent/20'
                      }`}
                    >
                      <span className="font-600">{key}.</span> {text}
                    </button>
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Submit Button */}
        {questions.length > 0 && (
          <motion.div
            className="mt-8 flex gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-playfair text-lg py-6"
            >
              Submit Answers! 🎉
            </Button>
            <Link href="/" className="flex-1">
              <Button
                variant="outline"
                className="w-full border-accent text-primary hover:bg-accent/10 rounded-2xl font-playfair text-lg py-6"
              >
                Skip for now
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </main>
  )
}
