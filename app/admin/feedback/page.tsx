'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Feedback {
  id: string
  participant_name: string
  participant_email?: string
  rating: number
  comments?: string
  submitted_at: string
}

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalFeedback: 0,
    averageRating: 0,
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
          .from('feedback')
          .select('*')
          .order('submitted_at', { ascending: false })

        if (error) throw error

        const feedbackList = data || []
        setFeedback(feedbackList)

        const avgRating =
          feedbackList.length > 0
            ? Math.round(
                (feedbackList.reduce((sum, f) => sum + f.rating, 0) /
                  feedbackList.length) *
                  100
              ) / 100
            : 0

        setStats({
          totalFeedback: feedbackList.length,
          averageRating: avgRating,
        })
      } catch (error) {
        console.error('[v0] Error fetching feedback:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndFetch()
  }, [router])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from('feedback').delete().eq('id', id)

      if (error) throw error
      setFeedback(feedback.filter((f) => f.id !== id))
    } catch (error) {
      console.error('[v0] Error deleting feedback:', error)
      alert('Error deleting feedback')
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#FDF5E6] to-[#F5E6D3] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground font-lora">Loading feedback...</p>
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
            Participant Feedback
          </h1>
          <p className="text-foreground/70 font-lora">
            {stats.totalFeedback} feedback{stats.totalFeedback !== 1 ? 's' : ''} received
          </p>
        </motion.header>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white/40 backdrop-blur-md border-2 border-accent/30 rounded-2xl p-6">
            <p className="text-foreground/70 font-lora text-sm mb-1">
              Total Feedback
            </p>
            <h3 className="font-playfair text-3xl font-700 text-primary">
              {stats.totalFeedback}
            </h3>
          </div>
          <div className="bg-white/40 backdrop-blur-md border-2 border-accent/30 rounded-2xl p-6">
            <p className="text-foreground/70 font-lora text-sm mb-1">
              Average Rating
            </p>
            <h3 className="font-playfair text-3xl font-700 text-accent">
              {stats.averageRating}/5 ⭐
            </h3>
          </div>
        </motion.div>

        {/* Feedback List */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {feedback.length === 0 ? (
            <div className="bg-white/40 backdrop-blur-md border-2 border-accent/20 rounded-2xl p-8 text-center">
              <p className="text-foreground/70 font-lora">
                No feedback received yet. 🙏
              </p>
            </div>
          ) : (
            feedback.map((item, index) => (
              <motion.div
                key={item.id}
                className="bg-white/40 backdrop-blur-md border-2 border-accent/20 rounded-2xl p-6 hover:border-accent/40 transition-all"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-playfair font-600 text-primary text-lg">
                        {item.participant_name}
                      </h3>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < item.rating ? 'text-yellow-400' : 'text-gray-300'
                            }
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                    {item.participant_email && (
                      <p className="text-sm text-foreground/60 font-lora mb-2">
                        {item.participant_email}
                      </p>
                    )}
                    {item.comments && (
                      <p className="text-foreground/80 font-lora mb-2 italic">
                        &quot;{item.comments}&quot;
                      </p>
                    )}
                    <p className="text-xs text-foreground/50 font-lora">
                      {new Date(item.submitted_at).toLocaleDateString()} at{' '}
                      {new Date(item.submitted_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500/50 hover:bg-red-500 text-white rounded-lg"
                    size="sm"
                  >
                    Delete
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </main>
  )
}
