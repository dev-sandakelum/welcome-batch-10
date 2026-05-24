import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getServerSupabaseClient() {
  if (!supabaseUrl) return null;

  const key = supabaseServiceRoleKey || supabaseAnonKey;
  if (!key) return null;

  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const supabase = getServerSupabaseClient();

    if (!supabase) {
      return NextResponse.json(
        { error: 'Admin auth is not configured on server. Set Supabase environment variables.' },
        { status: 500 }
      );
    }

    // Plain text password comparison — no bcrypt/RPC needed
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('username', username)
      .eq('password', password)
      .eq('is_active', true)
      .limit(1);

    if (error) {
      console.error('Admin login query error:', error);
      return NextResponse.json(
        { error: 'Database error during login. Please check your Supabase setup.' },
        { status: 500 }
      );
    }

    if (data && data.length > 0) {
      const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');

      return NextResponse.json({
        success: true,
        token,
        message: 'Login successful',
      });
    }

    return NextResponse.json(
      { error: 'Invalid username or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
