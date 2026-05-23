import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for database tables
export interface Question {
  id: string;
  name: string;
  email?: string;
  question: string;
  answer?: string;
  answered: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuizScore {
  id: string;
  player_name: string;
  score: number;
  total_questions: number;
  created_at: string;
}

export interface Feedback {
  id: string;
  name: string;
  email?: string;
  rating: number;
  feedback_text: string;
  created_at: string;
}
