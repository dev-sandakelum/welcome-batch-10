import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Get credentials from environment variables
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

    // Validate credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Generate a simple token (in production, use JWT or similar)
      const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');

      return NextResponse.json({
        success: true,
        token,
        message: 'Login successful'
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
