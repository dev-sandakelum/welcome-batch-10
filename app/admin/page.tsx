'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { isAdminAuthenticated, logoutAdmin } from '@/lib/adminAuth';
import '../styles/admin-common.css';
import '../styles/admin-dashboard.css';
import PageShell from '@/app/components/PageShell';

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
    if (!isAdminAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    loadStats();
  }, [router]);

  const loadStats = async () => {
    try {
      const { data: questions } = await supabase.from('questions').select('answered');
      const totalQuestions = questions?.length || 0;
      const answeredQuestions = questions?.filter(q => q.answered).length || 0;

      const { count: quizCount } = await supabase
        .from('quiz_scores')
        .select('*', { count: 'exact', head: true });

      const { data: feedback } = await supabase.from('feedback').select('rating');
      const totalFeedback = feedback?.length || 0;
      const averageRating = totalFeedback > 0 && feedback
        ? feedback.reduce((sum, f) => sum + f.rating, 0) / totalFeedback
        : 0;

      setStats({
        totalQuestions,
        answeredQuestions,
        pendingQuestions: totalQuestions - answeredQuestions,
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
      <link rel="stylesheet" href="/assets/styles.css" />
      <link rel="stylesheet" href="/assets/styles-tablet.css" />
      <link rel="stylesheet" href="/assets/styles-mobile.css" />
      <link rel="stylesheet" href="/assets/styles-mobile-small.css" />
      <link rel="stylesheet" href="/assets/styles-mobile-extra-small.css" />

      <PageShell>

      <div className="admin-page-wrapper">
        <div className="admin-page-container">

          {/* Header */}
          <div className="admin-header-lg">
            <div className="admin-dashboard-topbar">
              <div className="admin-dashboard-label">Admin Panel</div>
              <button onClick={handleLogout} className="btn-outline admin-logout-btn">
                🚪 Logout
              </button>
            </div>
            <h1 className="admin-page-title-center">Dashboard</h1>
            <p className="admin-page-description-center">
              Manage questions, view feedback, and monitor quiz scores
            </p>
          </div>

          {/* Stats Grid */}
          {loading ? (
            <div className="admin-dashboard-loading">Loading statistics...</div>
          ) : (
            <div className="admin-stats-grid">
              <div className="card admin-stat-card gold">
                <div className="admin-stat-icon">❓</div>
                <div className="admin-stat-value gold">{stats.totalQuestions}</div>
                <div className="admin-stat-label">Total Questions</div>
              </div>

              <div className="card admin-stat-card success">
                <div className="admin-stat-icon">✅</div>
                <div className="admin-stat-value success">{stats.answeredQuestions}</div>
                <div className="admin-stat-label">Answered</div>
              </div>

              <div className="card admin-stat-card warning">
                <div className="admin-stat-icon">⏳</div>
                <div className="admin-stat-value warning">{stats.pendingQuestions}</div>
                <div className="admin-stat-label">Pending</div>
              </div>

              <div className="card admin-stat-card teal">
                <div className="admin-stat-icon">🧠</div>
                <div className="admin-stat-value teal">{stats.totalQuizScores}</div>
                <div className="admin-stat-label">Quiz Attempts</div>
              </div>

              <div className="card admin-stat-card gold">
                <div className="admin-stat-icon">💌</div>
                <div className="admin-stat-value gold">{stats.totalFeedback}</div>
                <div className="admin-stat-label">Feedback Received</div>
              </div>

              <div className="card admin-stat-card gold">
                <div className="admin-stat-icon">⭐</div>
                <div className="admin-stat-value gold">{stats.averageRating.toFixed(1)}</div>
                <div className="admin-stat-label">Average Rating</div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="card admin-quick-actions-card">
            <h2 className="admin-quick-actions-title">Quick Actions</h2>
            <div className="admin-quick-actions-grid">
              <Link href="/admin/questions" className="btn-gold admin-quick-btn">
                📝 Manage Questions
              </Link>
              <Link href="/admin/feedback" className="btn-gold admin-quick-btn teal">
                💌 View Feedback
              </Link>
              <Link href="/admin/scores" className="btn-gold admin-quick-btn purple">
                🏆 Quiz Scores
              </Link>
            </div>
          </div>

          <div className="admin-back-home">
            <Link href="/" className="admin-back-home-link">← Back to Home</Link>
          </div>

        </div>
      </div>
      </PageShell>
    </>
  );
}
