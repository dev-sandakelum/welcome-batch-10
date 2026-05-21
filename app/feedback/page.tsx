'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import confetti from 'canvas-confetti'
import { ScrollFade } from '@/components/scroll-fade'

export default function FeedbackPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [rating, setRating] = useState(0)
  const [comments, setComments] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || rating === 0) return

    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('feedback').insert({
        participant_name: name,
        participant_email: email || null,
        rating,
        comments: comments || null,
      })

      if (error) throw error

      // Celebration confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF69B4'],
      })

      setSubmitted(true)
    } catch (error) {
      console.error('[v0] Error submitting feedback:', error)
      alert('Error submitting feedback. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-accent/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-primary/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="relative z-10 max-w-2xl mx-auto px-5 py-8">
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
              className="text-primary hover:bg-primary/10 mb-4 font-edu"
            >
              ← Back
            </Button>
          </Link>
          <h1 className="font-edu text-4xl md:text-5xl font-700 text-primary mb-2">
            Share Your Feedback
          </h1>
          <p className="text-foreground/70 font-comic text-lg">
            Help us improve the welcome ceremony
          </p>
        </motion.header>

        {!submitted ? (
          <motion.form
            onSubmit={handleSubmit}
            className="bg-card/90 backdrop-blur-md border-2 border-border rounded-3xl p-6 sm:p-8 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Name */}
            <ScrollFade delay={0}>
              <div className="mb-6">
                <label className="block text-sm font-edu font-600 text-primary mb-2">
                  Your Name (required)
                </label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl text-base font-comic border-2 border-border focus:border-primary"
                  required
                />
              </div>
            </ScrollFade>

            {/* Email */}
            <ScrollFade delay={0.1}>
              <div className="mb-6">
                <label className="block text-sm font-edu font-600 text-primary mb-2">
                  Email (optional)
                </label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl text-base font-comic border-2 border-border focus:border-primary"
                />
              </div>
            </ScrollFade>

            {/* Rating */}
            <ScrollFade delay={0.2}>
            <div className="mb-6">
              <label className="block text-sm font-playfair font-600 text-primary mb-4">
                How was the ceremony? (required)
              </label>
              <div className="flex gap-3 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-5xl transition-all duration-200 will-change-transform"
                    initial={{ scale: 0.8, opacity: 0.4 }}
                    animate={
                      rating >= star
                        ? { scale: 1.15, opacity: 1 }
                        : { scale: 0.8, opacity: 0.4 }
                    }
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 10,
                    }}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{
                      scale: 0.9,
                      transition: { duration: 0.1 },
                    }}
                  >
                    {rating >= star ? (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 15,
                        }}
                        style={{
                          filter: rating >= star ? 'drop-shadow(0 0 8px #CFB53B)' : 'none',
                        }}
                      >
                        ⭐
                      </motion.span>
                    ) : (
                      '⭐'
                    )}
                  </motion.button>
                ))}
              </div>
              <motion.p
                className="text-center text-sm text-foreground/60 font-lora mt-2"
                animate={{ opacity: rating > 0 ? 1 : 0.5 }}
              >
                {rating > 0
                  ? `You rated: ${rating} out of 5 stars!`
                  : 'Tap to rate us'}
              </motion.p>
            </div>
            </ScrollFade>

            {/* Comments */}
            <ScrollFade delay={0.3}>
            <div className="mb-6">
              <label className="block text-sm font-playfair font-600 text-primary mb-2">
                Additional Comments
              </label>
              <Textarea
                placeholder="Tell us what you think! What was your favorite part? What could we improve?"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="rounded-xl text-base font-lora min-h-32 resize-none"
              />
            </div>
            </ScrollFade>

            {/* Submit Button */}
            <ScrollFade delay={0.4}>
            <motion.div
              whileHover={{ scale: !name.trim() || rating === 0 || loading ? 1 : 1.03 }}
              whileTap={{ scale: !name.trim() || rating === 0 || loading ? 1 : 0.97 }}
            >
              <Button
                type="submit"
                disabled={!name.trim() || rating === 0 || loading}
                className="w-full gradient-maroon-gold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-edu text-lg py-6 shadow-lg border-2 border-primary/30 transition-all"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span> Sending...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Submit Feedback! 🎉
                  </span>
                )}
              </Button>
            </motion.div>
            </ScrollFade>
          </motion.form>
        ) : (
          <motion.div
            className="bg-card/90 backdrop-blur-md border-2 border-border rounded-3xl p-6 sm:p-8 text-center shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-6xl mb-4">🙏</div>
            <h2 className="font-playfair text-3xl font-600 text-primary mb-2">
              Thank you!
            </h2>
            <p className="text-lg text-foreground/70 font-lora mb-6">
              Your feedback helps us create better experiences for everyone.
            </p>

            <div className="space-y-3">
              <Link href="/leaderboard" className="block">
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-2xl font-playfair text-lg py-6">
                  View Leaderboard
                </Button>
              </Link>
              <Link href="/" className="block">
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary/10 rounded-2xl font-playfair text-lg py-6"
                >
                  Back to Home
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}
