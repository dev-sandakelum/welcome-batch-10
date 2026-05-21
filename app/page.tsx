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
    <main className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Decorative elements inspired by the design */}
      <div className="absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-accent/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-primary/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-1/4 right-1/4 w-48 h-48 md:w-64 md:h-64 bg-secondary/10 rounded-full blur-2xl" />

      <div className="relative z-10">
        {/* Header */}
        <motion.header
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 md:p-6 max-w-7xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <h1 className="font-edu text-xl sm:text-2xl md:text-3xl font-700 text-primary">
              Welcome Ceremony
            </h1>
            {visitorCount > 0 && (
              <motion.div
                className="text-xs sm:text-sm font-comic text-foreground/70"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <span className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl bg-card border-2 border-border shadow-md">
                  <span className="inline-block w-2 h-2 bg-accent rounded-full animate-pulse" />
                  Live — {visitorCount} {visitorCount === 1 ? 'person' : 'people'} here
                </span>
              </motion.div>
            )}
          </div>
        </motion.header>

        {/* Main content */}
        <motion.div
          className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] sm:min-h-[calc(100vh-120px)] px-4 sm:px-5 py-8 sm:py-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Title */}
          <motion.div className="text-center max-w-2xl px-2" variants={itemVariants}>
            <h2 className="font-licorice text-4xl sm:text-5xl md:text-7xl font-700 mb-3 sm:mb-4 text-primary leading-tight">
              You&apos;re in!
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-foreground/80 mb-6 sm:mb-8 font-comic px-2">
              Join us for an interactive welcome ceremony. Ask questions, test your knowledge, and share your feedback!
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 mt-6 sm:mt-8 w-full sm:w-auto justify-center flex-wrap px-2"
            variants={itemVariants}
          >
            <Link href="/ask-question" className="w-full sm:w-auto sm:min-w-[180px]">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full"
              >
                <Button
                  size="lg"
                  className="w-full h-12 sm:h-auto bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl sm:rounded-2xl font-edu text-base sm:text-lg shadow-lg border-2 border-secondary/30"
                >
                  Ask a Question 💭
                </Button>
              </motion.div>
            </Link>

            <Link href="/quiz" className="w-full sm:w-auto sm:min-w-[180px]">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full"
              >
                <Button
                  size="lg"
                  className="w-full h-12 sm:h-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl sm:rounded-2xl font-edu text-base sm:text-lg shadow-lg border-2 border-primary/30"
                >
                  Take the Quiz 🧠
                </Button>
              </motion.div>
            </Link>

            <Link href="/leaderboard" className="w-full sm:w-auto sm:min-w-[180px]">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full"
              >
                <Button
                  size="lg"
                  className="w-full h-12 sm:h-auto bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl sm:rounded-2xl font-edu text-base sm:text-lg shadow-lg border-2 border-accent/30"
                >
                  Leaderboard 🏆
                </Button>
              </motion.div>
            </Link>

            <Link href="/feedback" className="w-full sm:w-auto sm:min-w-[180px]">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full"
              >
                <Button
                  size="lg"
                  className="w-full h-12 sm:h-auto gradient-maroon-gold hover:opacity-90 text-white rounded-xl sm:rounded-2xl font-edu text-base sm:text-lg shadow-lg border-2 border-primary/30"
                >
                  Give Feedback ⭐
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Features */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-10 sm:mt-16 w-full max-w-4xl px-2"
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
                className="relative group rounded-2xl sm:rounded-3xl overflow-hidden"
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="bg-card backdrop-blur-md border-2 border-border group-hover:border-accent/60 rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-center transition-all duration-300 relative z-10 card-shadow">
                  <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">{feature.icon}</div>
                  <h3 className="font-edu text-lg sm:text-xl font-600 text-primary mb-1.5 sm:mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-foreground/70 font-comic">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Footer CTA */}
          <motion.div
            className="mt-10 sm:mt-16 text-center px-4"
            variants={itemVariants}
          >
            <p className="text-sm sm:text-base text-foreground/70 font-lora mb-3 sm:mb-4">
              Share your feedback at the end to help us improve!
            </p>
            
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}
