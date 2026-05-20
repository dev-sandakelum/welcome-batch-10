'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface UserQuestion {
  id: string
  participant_name: string
  participant_email?: string
  question: string
  answer?: string
  asked_at: string
  answered_at?: string
  is_answered: boolean
}

export default function AdminUserQuestionsPage() {
  const [questions, setQuestions] = useState<UserQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [answeringId, setAnsweringId] = useState<string | null>(null)
  const [answerText, setAnswerText] = useState('')
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null

        if (!token) {
          router.push('/admin/login')
          return
        }

        const supabase = createClient()
        const { data, error } = await supabase
          .from('user_questions')
          .select('*')
          .order('asked_at', { ascending: false })

        if (error) throw error
        setQuestions(data || [])
      } catch (error) {
        console.error('[v0] Error fetching questions:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndFetch()
  }, [router])

  const handleAnswerSubmit = async (e: React.FormEvent, questionId: string) => {
    e.preventDefault()
    if (!answerText.trim()) {
      alert('Please enter an answer')
      return
    }

    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('user_questions')
        .update({
          answer: answerText,
          is_answered: true,
          answered_at: new Date().toISOString(),
        })
        .eq('id', questionId)

      if (error) throw error

      // Update local state
      setQuestions(
        questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                answer: answerText,
                is_answered: true,
                answered_at: new Date().toISOString(),
              }
            : q
        )
      )

      setAnsweringId(null)
      setAnswerText('')
    } catch (error) {
      console.error('[v0] Error submitting answer:', error)
      alert('Failed to submit answer')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('user_questions')
        .delete()
        .eq('id', questionId)

      if (error) throw error

      setQuestions(questions.filter((q) => q.id !== questionId))
    } catch (error) {
      console.error('[v0] Error deleting question:', error)
      alert('Failed to delete question')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      <motion.div
        className="max-w-6xl mx-auto p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="font-edu text-4xl font-700 text-primary mb-2">
              User Questions
            </h1>
            <p className="text-foreground/70 font-comic">
              Answer questions from participants
            </p>
          </div>
          <Link href="/admin/dashboard">
            <Button variant="outline" className="border-accent text-primary">
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-foreground/70 font-comic">Loading questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="bg-white/40 backdrop-blur-md rounded-3xl border-2 border-accent/30 p-12 text-center">
            <p className="text-foreground/70 font-comic text-lg">
              No questions yet. Users can ask questions through the ceremony.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {questions.map((question, index) => (
              <motion.div
                key={question.id}
                className="bg-white/40 backdrop-blur-md rounded-3xl border-2 border-accent/30 p-6 hover:border-accent/60 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                {/* Question Header */}
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-edu text-xl font-700 text-primary mb-1">
                        {question.participant_name}
                      </h3>
                      <p className="text-sm text-foreground/60 font-comic">
                        {question.participant_email && `${question.participant_email} • `}
                        {new Date(question.asked_at).toLocaleDateString()}
                      </p>
                    </div>
                    <motion.div
                      className={`px-3 py-1 rounded-full text-sm font-edu font-700 ${
                        question.is_answered
                          ? 'bg-green-500/20 text-green-700'
                          : 'bg-orange-500/20 text-orange-700'
                      }`}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                    >
                      {question.is_answered ? '✓ Answered' : 'Pending'}
                    </motion.div>
                  </div>

                  {/* Question Text */}
                  <p className="text-foreground font-comic text-base bg-white/20 rounded-xl p-3 my-3">
                    {question.question}
                  </p>

                  {/* Answer (if exists) */}
                  {question.answer && (
                    <div className="mt-4 pl-4 border-l-4 border-accent/50">
                      <p className="text-sm font-edu font-700 text-primary/80 mb-1">
                        Your Answer:
                      </p>
                      <p className="text-foreground/80 font-comic">{question.answer}</p>
                    </div>
                  )}
                </div>

                {/* Answer Form (if not answered) */}
                {!question.is_answered && answeringId === question.id ? (
                  <form onSubmit={(e) => handleAnswerSubmit(e, question.id)} className="mt-4">
                    <label className="block text-sm font-edu font-700 text-primary mb-2">
                      Your Answer
                    </label>
                    <Textarea
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder="Type your answer..."
                      className="rounded-xl mb-3 font-comic"
                      required
                    />
                    <div className="flex gap-2">
                      <motion.button
                        type="submit"
                        disabled={saving}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-edu py-2 rounded-xl disabled:opacity-50 transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {saving ? 'Saving...' : 'Submit Answer'}
                      </motion.button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setAnsweringId(null)
                          setAnswerText('')
                        }}
                        className="font-edu"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="flex gap-2 mt-4">
                    {!question.is_answered && (
                      <Button
                        onClick={() => setAnsweringId(question.id)}
                        className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-edu rounded-xl"
                      >
                        Answer Question
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDelete(question.id)}
                      variant="outline"
                      className="border-destructive text-destructive hover:bg-destructive/10 font-edu"
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </main>
  )
}
