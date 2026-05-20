'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface UserQuestion {
  id: string
  participant_name: string
  question: string
  answer?: string
  is_answered: boolean
  asked_at: string
  answered_at?: string
}

export default function QAPage() {
  const [questions, setQuestions] = useState<UserQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnsweredQuestions = async () => {
      try {
        setLoading(true)
        const supabase = createClient()
        
        // Fetch with explicit column selection and error handling
        const { data, error, status } = await supabase
          .from('user_questions')
          .select('id, participant_name, question, answer, answered_at')
          .eq('is_answered', true)
          .order('answered_at', { ascending: false })

        console.log('Query status:', status)
        console.log('Query error:', error)
        console.log('Fetched data:', data)

        if (error) {
          console.error('Supabase error:', error)
          throw error
        }

        setQuestions(data || [])
      } catch (error) {
        console.error('[v0] Error fetching Q&A:', error)
        setQuestions([])
      } finally {
        setLoading(false)
      }
    }

    fetchAnsweredQuestions()

    // Subscribe to real-time changes
    const supabase = createClient()
    const subscription = supabase
      .channel('user_questions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_questions',
          filter: 'is_answered=eq.true',
        },
        (payload) => {
          console.log('Real-time update received:', payload)
          fetchAnsweredQuestions()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

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
            Frequently Asked Questions
          </h1>
          <p className="text-foreground/70 font-lora text-lg">
            See answers to questions from other participants
          </p>
        </motion.header>

        {/* Loading State */}
        {loading && (
          <div className="bg-white/40 backdrop-blur-md rounded-2xl p-8 text-center border-2 border-accent/20">
            <div className="w-12 h-12 border-4 border-accent border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-foreground font-lora">Loading Q&A...</p>
          </div>
        )}

        {/* Q&A List */}
        {!loading && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {questions.length === 0 ? (
              <div className="bg-white/40 backdrop-blur-md rounded-2xl p-8 text-center border-2 border-accent/20">
                <p className="text-foreground/70 font-lora text-lg">
                  No answered questions yet. Check back soon! 🙏
                </p>
              </div>
            ) : (
              questions.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === question.id ? null : question.id)
                    }
                    className="w-full bg-white/40 backdrop-blur-md border-2 border-accent/30 rounded-2xl p-6 hover:border-accent/60 transition-all text-left"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-playfair text-lg font-600 text-primary mb-2">
                          {question.question}
                        </h3>
                        <p className="text-sm text-foreground/60 font-lora">
                          Asked by {question.participant_name}
                        </p>
                      </div>
                      <div className="text-2xl flex-shrink-0">
                        {expandedId === question.id ? '▼' : '▶'}
                      </div>
                    </div>

                    {/* Answer - Expanded */}
                    <AnimatePresence>
                      {expandedId === question.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pt-4 border-t border-accent/30">
                            <p className="text-sm font-playfair font-600 text-accent mb-2">
                              Answer:
                            </p>
                            <p className="text-foreground font-lora leading-relaxed">
                              {question.answer || 'No answer provided yet.'}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {/* Ask Question Link */}
        {!loading && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link href="/ask-question">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-playfair text-lg py-6">
                Got a question? Ask it now! 💭
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </main>
  )
}
