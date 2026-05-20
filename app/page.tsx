'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect, useState } from 'react'

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

const shimmerVariants = {
  hidden: { backgroundPosition: '200% 0' },
  visible: {
    backgroundPosition: '-200% 0',
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

export default function Landing() {
  const [mounted, setMounted] = useState(false)
  const [visitorCount, setVisitorCount] = useState(0)

  useEffect(() => {
    setMounted(true)
    // Fetch live visitor count from Vercel Analytics
    const fetchLiveVisitors = async () => {
      try {
        const response = await fetch('/api/analytics/live-visitors', {
          method: 'GET',
        })
        if (response.ok) {
          const data = await response.json()
          setVisitorCount(data.count)
          console.log('[v0] Live visitors from', data.source, ':', data.count)
        }
      } catch (error) {
        console.error('[v0] Error fetching live visitors:', error)
      }
    }
    
    // Fetch immediately
    fetchLiveVisitors()
    
    // Refresh every 10 seconds
    const interval = setInterval(fetchLiveVisitors, 10000)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FDF5E6] to-[#F5E6D3] text-foreground overflow-hidden">
      {/* Decorative circles background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10">
        {/* Header */}
        <motion.header
          className="flex justify-between items-center p-5 md:p-6 max-w-7xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-4">
            <h1 className="font-edu text-2xl md:text-3xl font-700 text-primary">
              Welcome Ceremony
            </h1>
            {visitorCount > 0 && (
              <motion.div
                className="text-sm font-comic text-foreground/70"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  Live — {visitorCount} {visitorCount === 1 ? 'person' : 'people'} here
                </span>
              </motion.div>
            )}
          </div>
          <Link href="/admin/login">
            <Button
              variant="outline"
              className="text-sm border-accent text-primary hover:bg-accent/10"
            >
              Admin
            </Button>
          </Link>
        </motion.header>

        {/* Main content */}
        <motion.div
          className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-5 py-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Title */}
          <motion.div className="text-center max-w-2xl" variants={itemVariants}>
            <h2 className="font-licorice text-5xl md:text-7xl font-700 mb-4 text-primary">
              You&apos;re in!
            </h2>
            <p className="text-lg md:text-xl text-foreground/80 mb-8 font-comic">
              Join us for an interactive welcome ceremony. Ask questions, test your knowledge, and share your feedback!
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col md:flex-row gap-4 md:gap-6 mt-8 w-full md:w-auto justify-center flex-wrap"
            variants={itemVariants}
          >
            <Link href="/ask-question" className="w-full md:w-auto">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full"
              >
                <Button
                  size="lg"
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-2xl font-edu text-lg"
                >
                  Ask a Question 💭
                </Button>
              </motion.div>
            </Link>

            <Link href="/quiz" className="w-full md:w-auto">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full"
              >
                <Button
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-edu text-lg"
                >
                  Take the Quiz 🧠
                </Button>
              </motion.div>
            </Link>

            <Link href="/leaderboard" className="w-full md:w-auto">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full"
              >
                <Button
                  size="lg"
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-2xl font-edu text-lg"
                >
                  Leaderboard 🏆
                </Button>
              </motion.div>
            </Link>

            <Link href="/feedback" className="w-full md:w-auto">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full"
              >
                <Button
                  size="lg"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-edu text-lg"
                >
                  Give Feedback ⭐
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Features */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 w-full max-w-3xl"
            variants={itemVariants}
          >
            {[
              {
                title: 'Interactive Q&A',
                description: 'Real-time polling and questions',
                icon: '💬',
              },
              {
                title: 'Knowledge Quiz',
                description: '30-second timed challenges',
                icon: '🧠',
              },
              {
                title: 'Leaderboard',
                description: 'Compete and see rankings',
                icon: '🏆',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="relative group rounded-2xl overflow-hidden"
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent/30 via-accent/0 to-accent/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="bg-white/40 backdrop-blur-md border-2 border-accent/30 group-hover:border-accent/60 rounded-2xl p-5 text-center transition-all duration-300 relative z-10">
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h3 className="font-edu text-lg font-600 text-primary mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-foreground/70 font-comic">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Footer CTA */}
          <motion.div
            className="mt-16 text-center"
            variants={itemVariants}
          >
            <p className="text-foreground/70 font-lora mb-4">
              Share your feedback at the end to help us improve!
            </p>
            <Link href="/leaderboard">
              <Button
                variant="ghost"
                className="text-accent hover:bg-accent/10 font-playfair"
              >
                View Leaderboard →
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}
