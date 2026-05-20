'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

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

          {/* FAQ Section */}
          <motion.div className="mt-16 mb-12" variants={itemVariants}>
            <h2 className="font-edu text-2xl font-700 text-primary mb-6">
              Answered Questions
            </h2>
            <div className="space-y-4">
              <div className="bg-white/30 backdrop-blur-md rounded-2xl border border-accent/20 p-6">
                <h3 className="font-edu text-lg font-700 text-primary mb-2">
                  How long will the ceremony last?
                </h3>
                <p className="text-foreground/80 font-comic">
                  The ceremony typically lasts about 2-3 hours. You can participate at your own pace.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}
