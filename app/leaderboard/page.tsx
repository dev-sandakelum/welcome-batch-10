'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Score {
  id: string
  participant_name: string
  score: number
  total_questions: number
  percentage: number
  completed_at: string
}

export default function LeaderboardPage() {
  const [scores, setScores] = useState<Score[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('scores')
          .select('*')
          .order('score', { ascending: false })
          .limit(50)

        if (error) throw error
        setScores(data || [])
      } catch (error) {
        console.error('[v0] Error fetching leaderboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchScores()

    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchScores, 10000)
    return () => clearInterval(interval)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-5 py-8">
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
              className="text-primary hover:bg-card mb-4 rounded-xl"
            >
              ← Back
            </Button>
          </Link>
          <h1 className="font-playfair text-4xl md:text-5xl font-700 text-primary mb-2">
            Leaderboard
          </h1>
          <p className="text-foreground/70 font-lora text-lg">
            Top performers in the challenge
          </p>
        </motion.header>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-accent border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-foreground font-lora">Loading leaderboard...</p>
          </div>
        ) : scores.length === 0 ? (
          <motion.div
            className="bg-card backdrop-blur-md border-2 border-border rounded-3xl p-8 text-center card-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-foreground/70 font-lora text-lg mb-4">
              No scores yet. Be the first to take the quiz! 🎯
            </p>
            <Link href="/quiz">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-playfair shadow-lg">
                Take the Quiz
              </Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {scores.map((score, index) => {
              const isTopThree = index < 3
              const medals = ['🥇', '🥈', '🥉']

              return (
                <motion.div
                  key={score.id}
                  variants={itemVariants}
                  className={`relative bg-card backdrop-blur-md border-2 rounded-3xl p-5 transition-all card-shadow ${
                    isTopThree
                      ? 'border-accent/60'
                      : 'border-border hover:border-accent/40'
                  }`}
                  whileHover={{ scale: 1.01, x: 5 }}
                >
                  {/* Shimmer effect for rank 1 */}
                  {index === 0 && (
                    <div
                      className="absolute inset-0 rounded-3xl opacity-20"
                      style={{
                        background:
                          'linear-gradient(45deg, transparent 30%, rgba(207,181,59,0.4) 50%, transparent 70%)',
                        backgroundSize: '200% 200%',
                        animation: 'shimmer 2s infinite',
                      }}
                    />
                  )}

                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-3xl">
                        {isTopThree ? medals[index] : `#${index + 1}`}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-playfair font-600 text-primary text-lg">
                          {score.participant_name}
                        </h3>
                        <p className="text-sm text-foreground/60 font-lora">
                          {new Date(score.completed_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-playfair font-700 text-2xl text-accent">
                        {score.score}/{score.total_questions}
                      </div>
                      <div className="text-sm font-lora text-foreground/70">
                        {Math.round(score.percentage)}%
                      </div>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="mt-3 w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="gradient-maroon-gold h-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${score.percentage}%`,
                      }}
                      transition={{ delay: 0.3 + index * 0.05, duration: 0.6 }}
                    />
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/quiz">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-playfair text-lg px-8 py-6 shadow-lg">
              Take the Quiz
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Shimmer keyframe animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            backgroundPosition: -1000px 0;
          }
          100% {
            backgroundPosition: 1000px 0;
          }
        }
      `}</style>
    </main>
  )
}
