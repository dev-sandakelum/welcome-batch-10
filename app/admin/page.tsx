'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { isAdminAuthenticated, logoutAdmin } from '@/lib/adminAuth';

interface Stats {
  totalQuestions: number;
  answeredQuestions: number;
  pendingQuestions: number;
  totalQuizScores: number;
  totalFeedback: number;
  averageRating: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalQuestions: 0,
    answeredQuestions: 0,
    pendingQuestions: 0,
    totalQuizScores: 0,
    totalFeedback: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    if (!isAdminAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    
    loadStats();
  }, [router]);

  const loadStats = async () => {
    try {
      // Get questions stats
      const { data: questions } = await supabase
        .from('questions')
        .select('answered');
      
      const totalQuestions = questions?.length || 0;
      const answeredQuestions = questions?.filter(q => q.answered).length || 0;
      const pendingQuestions = totalQuestions - answeredQuestions;

      // Get quiz scores count
      const { count: quizCount } = await supabase
        .from('quiz_scores')
        .select('*', { count: 'exact', head: true });

      // Get feedback stats
      const { data: feedback } = await supabase
        .from('feedback')
        .select('rating');
      
      const totalFeedback = feedback?.length || 0;
      const averageRating = totalFeedback > 0 && feedback
        ? feedback.reduce((sum, f) => sum + f.rating, 0) / totalFeedback
        : 0;

      setStats({
        totalQuestions,
        answeredQuestions,
        pendingQuestions,
        totalQuizScores: quizCount || 0,
        totalFeedback,
        averageRating
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    router.push('/admin/login');
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cinzel+Decorative:wght@700&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="/assets/styles.css" />

      <div className="bg-canvas"></div>

      <div style={{position: 'relative', zIndex: 1, minHeight: '100vh', padding: '40px 20px'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          {/* Header */}
          <div style={{marginBottom: '40px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px'}}>
              <div style={{fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-teal-light)', opacity: 0.8}}>
                Admin Panel
              </div>
              <button
                onClick={handleLogout}
                className="btn-outline"
                style={{padding: '8px 20px', fontSize: '0.75rem', borderColor: '#ff6b6b', color: '#ff6b6b'}}
              >
                🚪 Logout
              </button>
            </div>
            <h1 style={{fontFamily: "'Cinzel Decorative', serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: 'var(--accent-gold-light)', marginBottom: '12px', textAlign: 'center'}}>
              Dashboard
            </h1>
            <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center'}}>
              Manage questions, view feedback, and monitor quiz scores
            </p>
          </div>

          {/* Stats Grid */}
          {loading ? (
            <div style={{textAlign: 'center', padding: '60px', color: 'var(--text-muted)'}}>
              Loading statistics...
            </div>
          ) : (
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px'}}>
              <div className="card" style={{padding: '24px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(201,162,39,0.15) 0%, rgba(201,162,39,0.05) 100%)', border: '1px solid rgba(201,162,39,0.3)'}}>
                <div style={{fontSize: '2.5rem', marginBottom: '8px'}}>❓</div>
                <div style={{fontFamily: "'Cinzel Decorative', serif", fontSize: '2rem', color: 'var(--accent-gold-light)', marginBottom: '4px'}}>
                  {stats.totalQuestions}
                </div>
                <div style={{fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)'}}>
                  Total Questions
                </div>
              </div>

              <div className="card" style={{padding: '24px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(61,220,132,0.15) 0%, rgba(61,220,132,0.05) 100%)', border: '1px solid rgba(61,220,132,0.3)'}}>
                <div style={{fontSize: '2.5rem', marginBottom: '8px'}}>✅</div>
                <div style={{fontFamily: "'Cinzel Decorative', serif", fontSize: '2rem', color: '#3ddc84', marginBottom: '4px'}}>
                  {stats.answeredQuestions}
                </div>
                <div style={{fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)'}}>
                  Answered
                </div>
              </div>

              <div className="card" style={{padding: '24px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(255,193,7,0.15) 0%, rgba(255,193,7,0.05) 100%)', border: '1px solid rgba(255,193,7,0.3)'}}>
                <div style={{fontSize: '2.5rem', marginBottom: '8px'}}>⏳</div>
                <div style={{fontFamily: "'Cinzel Decorative', serif", fontSize: '2rem', color: '#ffc107', marginBottom: '4px'}}>
                  {stats.pendingQuestions}
                </div>
                <div style={{fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)'}}>
                  Pending
                </div>
              </div>

              <div className="card" style={{padding: '24px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(0,180,216,0.15) 0%, rgba(0,180,216,0.05) 100%)', border: '1px solid rgba(0,180,216,0.3)'}}>
                <div style={{fontSize: '2.5rem', marginBottom: '8px'}}>🧠</div>
                <div style={{fontFamily: "'Cinzel Decorative', serif", fontSize: '2rem', color: 'var(--accent-teal-light)', marginBottom: '4px'}}>
                  {stats.totalQuizScores}
                </div>
                <div style={{fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)'}}>
                  Quiz Attempts
                </div>
              </div>

              <div className="card" style={{padding: '24px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(201,162,39,0.15) 0%, rgba(201,162,39,0.05) 100%)', border: '1px solid rgba(201,162,39,0.3)'}}>
                <div style={{fontSize: '2.5rem', marginBottom: '8px'}}>💌</div>
                <div style={{fontFamily: "'Cinzel Decorative', serif", fontSize: '2rem', color: 'var(--accent-gold-light)', marginBottom: '4px'}}>
                  {stats.totalFeedback}
                </div>
                <div style={{fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)'}}>
                  Feedback Received
                </div>
              </div>

              <div className="card" style={{padding: '24px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(201,162,39,0.15) 0%, rgba(201,162,39,0.05) 100%)', border: '1px solid rgba(201,162,39,0.3)'}}>
                <div style={{fontSize: '2.5rem', marginBottom: '8px'}}>⭐</div>
                <div style={{fontFamily: "'Cinzel Decorative', serif", fontSize: '2rem', color: 'var(--accent-gold-light)', marginBottom: '4px'}}>
                  {stats.averageRating.toFixed(1)}
                </div>
                <div style={{fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)'}}>
                  Average Rating
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="card" style={{padding: '32px'}}>
            <h2 style={{fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 600, color: 'var(--accent-gold-light)', marginBottom: '24px'}}>
              Quick Actions
            </h2>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px'}}>
              <Link href="/admin/questions" className="btn-gold" style={{justifyContent: 'center', padding: '16px 24px'}}>
                📝 Manage Questions
              </Link>
              <Link href="/admin/feedback" className="btn-gold" style={{justifyContent: 'center', padding: '16px 24px', background: 'linear-gradient(135deg, var(--accent-teal), #0090b0)'}}>
                💌 View Feedback
              </Link>
              <Link href="/admin/scores" className="btn-gold" style={{justifyContent: 'center', padding: '16px 24px', background: 'linear-gradient(135deg, #9333ea, #7e22ce)'}}>
                🏆 Quiz Scores
              </Link>
            </div>
          </div>

          {/* Back to Home */}
          <div style={{textAlign: 'center', marginTop: '40px'}}>
            <Link href="/" style={{color: 'var(--accent-gold)', textDecoration: 'none', fontSize: '0.85rem', transition: 'all 0.3s'}}>
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
