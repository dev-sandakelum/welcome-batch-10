'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Stats {
  totalQuestions: number
  totalScores: number
  totalFeedback: number
  averageScore: number
}

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [stats, setStats] = useState<Stats>({
    totalQuestions: 0,
    totalScores: 0,
    totalFeedback: 0,
    averageScore: 0,
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for admin token in localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null

        if (!token) {
          router.push('/admin/login')
          return
        }

        setIsAuthenticated(true)

        // Fetch stats from Supabase
        const supabase = createClient()
        const [questionsData, scoresData, feedbackData] = await Promise.all([
          supabase.from('questions').select('*', { count: 'exact' }),
          supabase.from('scores').select('*', { count: 'exact' }),
          supabase.from('feedback').select('*', { count: 'exact' }),
        ])

        const scores = scoresData.data || []
        const avgScore =
          scores.length > 0
            ? Math.round(
                (scores.reduce((sum, s) => sum + s.score, 0) / scores.length) *
                  100
              ) / 100
            : 0

        setStats({
          totalQuestions: questionsData.count || 0,
          totalScores: scoresData.count || 0,
          totalFeedback: feedbackData.count || 0,
          averageScore: avgScore,
        })
      } catch (error) {
        console.error('[v0] Auth check error:', error)
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.push('/')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#FDF5E6] to-[#F5E6D3] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground font-lora">Loading dashboard...</p>
        </div>
      </main>
    )
  }

  const statItems = [
    {
      label: 'Total Questions',
      value: stats.totalQuestions,
      href: '/admin/questions',
      icon: '📋',
    },
    {
      label: 'Quiz Submissions',
      value: stats.totalScores,
      href: '/admin/scores',
      icon: '📊',
    },
    {
      label: 'Feedback Received',
      value: stats.totalFeedback,
      href: '/admin/feedback',
      icon: '💬',
    },
    {
      label: 'Average Score',
      value: `${stats.averageScore}%`,
      href: '/admin/scores',
      icon: '🏆',
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FDF5E6] to-[#F5E6D3]">
      <div className="max-w-6xl mx-auto px-5 py-8">
        {/* Header */}
        <motion.header
          className="mb-8 flex justify-between items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <h1 className="font-playfair text-4xl font-700 text-primary mb-1">
              Admin Dashboard
            </h1>
            <p className="text-foreground/70 font-lora">
              Manage the ceremony
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-accent text-primary hover:bg-accent/10"
          >
            Sign Out
          </Button>
        </motion.header>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {statItems.map((item, index) => (
            <Link key={`${item.label}-${index}`} href={item.href}>
              <motion.div
                className="bg-white/40 backdrop-blur-md border-2 border-accent/30 rounded-2xl p-6 hover:border-accent/60 transition-all cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <p className="text-foreground/70 font-lora text-sm mb-1">
                  {item.label}
                </p>
                <h3 className="font-playfair text-3xl font-700 text-primary">
                  {item.value}
                </h3>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Management Links */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/admin/questions">
            <motion.div
              className="bg-white/40 backdrop-blur-md border-2 border-accent/30 rounded-2xl p-6 hover:border-accent/60 transition-all cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="font-playfair text-xl font-600 text-primary mb-2">
                📝 Manage Questions
              </h3>
              <p className="text-foreground/70 font-lora text-sm mb-4">
                Add, edit, and delete quiz questions
              </p>
              <Button
                className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl"
                size="sm"
              >
                Go to Questions
              </Button>
            </motion.div>
          </Link>

          <Link href="/admin/feedback">
            <motion.div
              className="bg-white/40 backdrop-blur-md border-2 border-accent/30 rounded-2xl p-6 hover:border-accent/60 transition-all cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="font-playfair text-xl font-600 text-primary mb-2">
                💝 View Feedback
              </h3>
              <p className="text-foreground/70 font-lora text-sm mb-4">
                Review participant feedback and ratings
              </p>
              <Button
                className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl"
                size="sm"
              >
                Go to Feedback
              </Button>
            </motion.div>
          </Link>

          <Link href="/admin/scores">
            <motion.div
              className="bg-white/40 backdrop-blur-md border-2 border-accent/30 rounded-2xl p-6 hover:border-accent/60 transition-all cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="font-playfair text-xl font-600 text-primary mb-2">
                🏅 View Scores
              </h3>
              <p className="text-foreground/70 font-lora text-sm mb-4">
                See all quiz submissions and rankings
              </p>
              <Button
                className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl"
                size="sm"
              >
                Go to Scores
              </Button>
            </motion.div>
          </Link>

          <Link href="/admin/user-questions">
            <motion.div
              className="bg-white/40 backdrop-blur-md border-2 border-accent/30 rounded-2xl p-6 hover:border-accent/60 transition-all cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="font-playfair text-xl font-600 text-primary mb-2">
                💭 Answer Questions
              </h3>
              <p className="text-foreground/70 font-lora text-sm mb-4">
                Review and answer participant questions
              </p>
              <Button
                className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl"
                size="sm"
              >
                Go to Questions
              </Button>
            </motion.div>
          </Link>

          <Link href="/">
            <motion.div
              className="bg-white/40 backdrop-blur-md border-2 border-accent/30 rounded-2xl p-6 hover:border-accent/60 transition-all cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="font-playfair text-xl font-600 text-primary mb-2">
                🌐 View Public Site
              </h3>
              <p className="text-foreground/70 font-lora text-sm mb-4">
                See how participants experience the ceremony
              </p>
              <Button
                className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl"
                size="sm"
              >
                Go to Site
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </main>
  )
}
