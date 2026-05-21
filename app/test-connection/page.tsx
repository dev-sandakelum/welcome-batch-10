'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function TestConnectionPage() {
  const [status, setStatus] = useState<'testing' | 'success' | 'error'>('testing')
  const [message, setMessage] = useState('')
  const [details, setDetails] = useState<any>(null)

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      setStatus('testing')
      setMessage('Testing Supabase connection...')

      // Check environment variables
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!url || !key) {
        setStatus('error')
        setMessage('Environment variables not set!')
        setDetails({
          url: url ? '✅ Set' : '❌ Missing',
          key: key ? '✅ Set' : '❌ Missing',
        })
        return
      }

      // Test connection
      const supabase = createClient()
      
      // Try to fetch from questions table
      const { data, error } = await supabase
        .from('questions')
        .select('count')
        .limit(1)

      if (error) {
        setStatus('error')
        setMessage('Connection failed!')
        setDetails({
          error: error.message,
          code: error.code,
          hint: error.hint,
          details: error.details,
        })
        return
      }

      setStatus('success')
      setMessage('Connection successful!')
      setDetails({
        url: url,
        keyPrefix: key.substring(0, 20) + '...',
        tablesAccessible: '✅ Yes',
      })
    } catch (err: any) {
      setStatus('error')
      setMessage('Unexpected error!')
      setDetails({
        error: err.message || 'Unknown error',
      })
    }
  }

  return (
    <div className="min-h-screen relative py-8">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="space-y-8 animate-fade-in">
          
          {/* Back Button */}
          <div className="flex justify-start">
            <Link href="/">
              <button className="glass-card px-6 py-3 text-white font-bold hover:bg-white/20 transition-all flex items-center gap-2">
                <span>←</span>
                <span>Back Home</span>
              </button>
            </Link>
          </div>

          {/* Title */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-white" style={{fontFamily: 'Permanent Marker, cursive'}}>
              🔌 Connection Test
            </h1>
            <p className="text-lg text-purple-100">
              Testing Supabase database connection
            </p>
          </div>

          {/* Status Card */}
          <div className={`glass-card p-8 text-center space-y-6 ${
            status === 'error' ? 'border-2 border-red-400' : 
            status === 'success' ? 'border-2 border-green-400' : ''
          }`}>
            
            {/* Icon */}
            <div className="text-6xl">
              {status === 'testing' && '⏳'}
              {status === 'success' && '✅'}
              {status === 'error' && '❌'}
            </div>

            {/* Message */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {message}
              </h2>
              {status === 'testing' && (
                <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mt-4" />
              )}
            </div>

            {/* Details */}
            {details && (
              <div className="glass-card p-6 text-left">
                <h3 className="text-lg font-bold text-white mb-4">Details:</h3>
                <pre className="text-sm text-purple-100 overflow-auto">
                  {JSON.stringify(details, null, 2)}
                </pre>
              </div>
            )}

            {/* Retry Button */}
            {status !== 'testing' && (
              <button
                onClick={testConnection}
                className="btn-primary mt-4"
              >
                🔄 Test Again
              </button>
            )}
          </div>

          {/* Instructions */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-xl font-bold text-white" style={{fontFamily: 'Permanent Marker, cursive'}}>
              📝 How to Fix Connection Issues
            </h3>
            
            <div className="space-y-3 text-purple-100">
              <div>
                <p className="font-bold text-white mb-1">1. Get your Supabase credentials:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Go to <a href="https://supabase.com/dashboard" target="_blank" className="text-yellow-400 hover:underline">supabase.com/dashboard</a></li>
                  <li>Select your project</li>
                  <li>Go to Settings → API</li>
                  <li>Copy the <strong>Project URL</strong></li>
                  <li>Copy the <strong>anon/public key</strong> (starts with "eyJhbGciOiJIUzI1NiI...")</li>
                </ul>
              </div>

              <div>
                <p className="font-bold text-white mb-1">2. Update your .env.local file:</p>
                <div className="bg-black/30 p-4 rounded-lg font-mono text-sm overflow-auto">
                  <code>
                    NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co<br/>
                    NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                  </code>
                </div>
              </div>

              <div>
                <p className="font-bold text-white mb-1">3. Restart your development server:</p>
                <div className="bg-black/30 p-4 rounded-lg font-mono text-sm">
                  <code>npm run dev</code>
                </div>
              </div>

              <div>
                <p className="font-bold text-white mb-1">4. Run the database migration:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Go to Supabase Dashboard → SQL Editor</li>
                  <li>Copy contents of <code className="bg-black/30 px-2 py-1 rounded">supabase/migrations/001_initialize_database.sql</code></li>
                  <li>Paste and run the SQL</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
