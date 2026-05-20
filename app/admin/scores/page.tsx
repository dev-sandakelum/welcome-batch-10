'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Score {
  id: string
  participant_name: string
  participant_email?: string
  score: number
  total_questions: number
  percentage: number
  completed_at: string
}

export default function AdminScoresPage() {
  const [scores, setScores] = useState<Score[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    averageScore: 0,
    averagePercentage: 0,
    highestScore: 0,
  })
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
          .from('scores')
          .select('*')
          .order('score', { ascending: false })

        if (error) throw error

        const scoresList = data || []
        setScores(scoresList)

        const avgScore =
          scoresList.length > 0
            ? Math.round(
                (scoresList.reduce((sum, s) => sum + s.score, 0) /
                  scoresList.length) *
                  100
              ) / 100
            : 0

        const avgPercentage =
          scoresList.length > 0
            ? Math.round(
                (scoresList.reduce((sum, s) => sum + s.percentage, 0) /
                  scoresList.length) *
                  100
              ) / 100
            : 0

        const highest =
          scoresList.length > 0
            ? Math.max(...scoresList.map((s) => s.score))
            : 0

        setStats({
          totalSubmissions: scoresList.length,
          averageScore: avgScore,
          averagePercentage: avgPercentage,
          highestScore: highest,
        })
      } catch (error) {
        console.error('[v0] Error fetching scores:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndFetch()
  }, [router])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this score?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from('scores').delete().eq('id', id)

      if (error) throw error
      setScores(scores.filter((s) => s.id !== id))
    } catch (error) {
      console.error('[v0] Error deleting score:', error)
      alert('Error deleting score')
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#FDF5E6] to-[#F5E6D3] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground font-lora">Loading scores...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FDF5E6] to-[#F5E6D3]">
      <div className="max-w-6xl mx-auto px-5 py-8">
        {/* Header */}
        <motion.header
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link href="/admin/dashboard">
            <Button
              variant="ghost"
              className="text-primary hover:bg-accent/10 mb-4"
            >
              ← Back
            </Button>
          </Link>
          <h1 className="font-playfair text-4xl font-700 text-primary mb-1">
            Quiz Scores
          </h1>
          <p className="text-foreground/70 font-lora">
            {stats.totalSubmissions} submission{stats.totalSubmissions !== 1 ? 's' : ''}
          </p>
        </motion.header>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {[
            {
              label: 'Total Submissions',
              value: stats.totalSubmissions,
              icon: '📊',
            },
            {
              label: 'Highest Score',
              value: stats.highestScore,
              icon: '🏆',
            },
            {
              label: 'Average Score',
              value: stats.averageScore.toString(),
              icon: '📈',
            },
            {
              label: 'Average %',
              value: `${stats.averagePercentage}%`,
              icon: '✅',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-white/40 backdrop-blur-md border-2 border-accent/30 rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <p className="text-foreground/70 font-lora text-sm mb-1">
                {item.icon} {item.label}
              </p>
              <h3 className="font-playfair text-2xl font-700 text-primary">
                {item.value}
              </h3>
            </motion.div>
          ))}
        </motion.div>

        {/* Scores Table */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {scores.length === 0 ? (
            <div className="bg-white/40 backdrop-blur-md border-2 border-accent/20 rounded-2xl p-8 text-center">
              <p className="text-foreground/70 font-lora">No scores yet. 🤔</p>
            </div>
          ) : (
            <div className="bg-white/40 backdrop-blur-md border-2 border-accent/20 rounded-2xl overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-4 gap-4 bg-accent/10 p-4 border-b border-accent/20 font-playfair font-600 text-primary text-sm">
                <div>Rank</div>
                <div>Name</div>
                <div>Score</div>
                <div>Action</div>
              </div>

              {/* Table rows */}
              {scores.map((score, index) => (
                <motion.div
                  key={score.id}
                  className="grid grid-cols-4 gap-4 p-4 border-b border-accent/10 last:border-0 hover:bg-accent/5 transition-colors items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="font-playfair font-600 text-primary">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-lora font-500 text-primary">
                      {score.participant_name}
                    </p>
                    {score.participant_email && (
                      <p className="text-xs text-foreground/60">
                        {score.participant_email}
                      </p>
                    )}
                  </div>
                  <div className="font-playfair font-600 text-accent">
                    {score.score}/{score.total_questions}{' '}
                    <span className="text-xs text-foreground/60">
                      ({score.percentage}%)
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleDelete(score.id)}
                      className="bg-red-500/50 hover:bg-red-500 text-white rounded-lg"
                      size="sm"
                    >
                      Delete
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  )
}
