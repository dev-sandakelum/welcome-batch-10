import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Use environment variables if set, otherwise use default credentials
    const adminUsername = process.env.ADMIN_USERNAME || 'admin'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

    console.log('[v0] Login attempt:', { username, adminUsername, passwordMatch: password === adminPassword })

    if (username !== adminUsername || password !== adminPassword) {
      console.log('[v0] Login failed - credentials mismatch')
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Create a simple token (in production, use JWT)
    const token = Buffer.from(`${username}:${Date.now()}`).toString('base64')

    return NextResponse.json({
      token,
      message: 'Login successful',
    })
  } catch (error) {
    console.error('[v0] Admin login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
