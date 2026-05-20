import { NextRequest, NextResponse } from 'next/server'

// In-memory store for visitor count (resets on server restart)
let visitorCount = 0
const visitorSessions = new Map<string, number>()

export async function POST(request: NextRequest) {
  try {
    // Get client IP or use a session identifier
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const sessionId = `${clientIp}-${Math.random()}`

    // Store session for 5 minutes
    if (!visitorSessions.has(sessionId)) {
      visitorCount++
      visitorSessions.set(sessionId, Date.now())

      // Clean up old sessions (older than 5 minutes)
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
      for (const [key, timestamp] of visitorSessions.entries()) {
        if (timestamp < fiveMinutesAgo) {
          visitorSessions.delete(key)
          visitorCount = Math.max(0, visitorCount - 1)
        }
      }
    }

    return NextResponse.json({
      count: visitorSessions.size,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[v0] Visitors API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    count: visitorSessions.size,
  })
}
