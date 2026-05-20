'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Question {
  id: string
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: string
  category?: string
  display_order?: number
}

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Question>>({
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 'A',
    category: '',
    display_order: 0,
  })
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        // Check for admin token in localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null

        if (!token) {
          router.push('/admin/login')
          return
        }

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

    checkAuthAndFetch()
  }, [router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !formData.question_text ||
      !formData.option_a ||
      !formData.option_b ||
      !formData.option_c ||
      !formData.option_d
    ) {
      alert('Please fill in all fields')
      return
    }

    setSaving(true)
    try {
      const supabase = createClient()

      if (editingId) {
        const { error } = await supabase
          .from('questions')
          .update(formData)
          .eq('id', editingId)

        if (error) throw error
      } else {
        const { error } = await supabase.from('questions').insert([formData])
        if (error) throw error
      }

      // Refresh list
      const { data } = await supabase
        .from('questions')
        .select('*')
        .order('display_order', { ascending: true })

      setQuestions(data || [])
      setShowForm(false)
      setEditingId(null)
      setFormData({
        question_text: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_answer: 'A',
        category: '',
        display_order: 0,
      })
    } catch (error) {
      console.error('[v0] Error saving question:', error)
      alert('Error saving question')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from('questions').delete().eq('id', id)

      if (error) throw error
      setQuestions(questions.filter((q) => q.id !== id))
    } catch (error) {
      console.error('[v0] Error deleting question:', error)
      alert('Error deleting question')
    }
  }

  const handleEdit = (question: Question) => {
    setEditingId(question.id)
    setFormData(question)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_answer: 'A',
      category: '',
      display_order: 0,
    })
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
      <div className="max-w-6xl mx-auto px-5 py-8">
        {/* Header */}
        <motion.header
          className="mb-8 flex justify-between items-start"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <Link href="/admin/dashboard">
              <Button
                variant="ghost"
                className="text-primary hover:bg-accent/10 mb-4"
              >
                ← Back
              </Button>
            </Link>
            <h1 className="font-playfair text-4xl font-700 text-primary mb-1">
              Manage Questions
            </h1>
            <p className="text-foreground/70 font-lora">
              {questions.length} question{questions.length !== 1 ? 's' : ''} total
            </p>
          </div>
          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-playfair"
            >
              + Add Question
            </Button>
          )}
        </motion.header>

        {/* Form */}
        {showForm && (
          <motion.form
            onSubmit={handleSave}
            className="bg-white/40 backdrop-blur-md border-2 border-accent/30 rounded-2xl p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="font-playfair text-2xl font-600 text-primary mb-6">
              {editingId ? 'Edit Question' : 'Add New Question'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-playfair font-600 text-primary mb-2">
                  Question Text
                </label>
                <Textarea
                  value={formData.question_text || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      question_text: e.target.value,
                    })
                  }
                  className="rounded-xl font-lora"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {['option_a', 'option_b', 'option_c', 'option_d'].map(
                  (key) => (
                    <div key={key}>
                      <label className="block text-sm font-playfair font-600 text-primary mb-2">
                        Option {key.split('_')[1].toUpperCase()}
                      </label>
                      <Input
                        value={
                          formData[key as keyof Question] as string
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [key]: e.target.value,
                          })
                        }
                        className="rounded-xl font-lora"
                        required
                      />
                    </div>
                  )
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-playfair font-600 text-primary mb-2">
                    Correct Answer
                  </label>
                  <select
                    value={formData.correct_answer || 'A'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        correct_answer: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-accent/20 bg-white/50 font-lora"
                  >
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <option key={opt} value={opt}>
                        Option {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-playfair font-600 text-primary mb-2">
                    Order
                  </label>
                  <Input
                    type="number"
                    value={formData.display_order || 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        display_order: parseInt(e.target.value),
                      })
                    }
                    className="rounded-xl font-lora"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button
                type="submit"
                disabled={saving}
                className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground rounded-2xl font-playfair py-6"
              >
                {saving ? 'Saving...' : editingId ? 'Update Question' : 'Add Question'}
              </Button>
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                className="flex-1 border-accent text-primary hover:bg-accent/10 rounded-2xl font-playfair py-6"
              >
                Cancel
              </Button>
            </div>
          </motion.form>
        )}

        {/* Questions List */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {questions.length === 0 ? (
            <div className="bg-white/40 backdrop-blur-md border-2 border-accent/20 rounded-2xl p-8 text-center">
              <p className="text-foreground/70 font-lora mb-4">
                No questions yet. Create your first question!
              </p>
              {!showForm && (
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-playfair"
                >
                  + Add Question
                </Button>
              )}
            </div>
          ) : (
            questions.map((question, index) => (
              <motion.div
                key={question.id}
                className="bg-white/40 backdrop-blur-md border-2 border-accent/20 rounded-2xl p-5 hover:border-accent/40 transition-all"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-block bg-accent/20 text-primary px-3 py-1 rounded-lg text-xs font-playfair font-600">
                        #{question.display_order || index + 1}
                      </span>
                      {question.category && (
                        <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-lg text-xs font-lora">
                          {question.category}
                        </span>
                      )}
                    </div>
                    <h3 className="font-playfair font-600 text-primary text-lg mb-3">
                      {question.question_text}
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm font-lora">
                      {[
                        {
                          letter: 'A',
                          text: question.option_a,
                        },
                        {
                          letter: 'B',
                          text: question.option_b,
                        },
                        {
                          letter: 'C',
                          text: question.option_c,
                        },
                        {
                          letter: 'D',
                          text: question.option_d,
                        },
                      ].map(({ letter, text }) => (
                        <div
                          key={letter}
                          className={`p-2 rounded-lg ${
                            letter === question.correct_answer
                              ? 'bg-green-500/20 border border-green-500/50 text-green-700 font-600'
                              : 'bg-foreground/5'
                          }`}
                        >
                          <span className="font-600">{letter}.</span> {text}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(question)}
                      className="bg-accent/50 hover:bg-accent text-accent-foreground rounded-lg"
                      size="sm"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(question.id)}
                      className="bg-red-500/50 hover:bg-red-500 text-white rounded-lg"
                      size="sm"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </main>
  )
}
