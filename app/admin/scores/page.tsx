'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase, QuizScore } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import '../../styles/admin-common.css';
import '../../styles/admin-scores.css';

export default function AdminScoresPage() {
  const router = useRouter();
  const [scores, setScores] = useState<QuizScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'score' | 'date'>('score');

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    loadScores();
  }, [sortBy, router]);

  const loadScores = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_scores')
        .select('*')
        .order(sortBy === 'score' ? 'score' : 'created_at', { ascending: sortBy === 'date' });

      if (error) throw error;
      setScores(data || []);
    } catch (error) {
      console.error('Error loading scores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this score?')) return;

    try {
      const { error } = await supabase.from('quiz_scores').delete().eq('id', id);
      if (error) throw error;
      await loadScores();
      alert('Score deleted successfully!');
    } catch (error) {
      console.error('Error deleting score:', error);
      alert('Failed to delete score');
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

  const getMedalEmoji = (index: number) => {
    if (sortBy !== 'score') return null;
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return null;
  };

  const getRankClass = (index: number) => {
    if (sortBy !== 'score') return '';
    if (index === 0) return 'gold';
    if (index === 1) return 'silver';
    if (index === 2) return 'bronze';
    return '';
  };

  const averageScore = scores.length > 0
    ? (scores.reduce((sum, s) => sum + s.score, 0) / scores.length).toFixed(1)
    : '0.0';

  const perfectScores = scores.filter(s => s.score === s.total_questions).length;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cinzel+Decorative:wght@700&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="/assets/styles.css" />
      <link rel="stylesheet" href="/assets/styles-tablet.css" />
      <link rel="stylesheet" href="/assets/styles-mobile.css" />
      <link rel="stylesheet" href="/assets/styles-mobile-small.css" />
      <link rel="stylesheet" href="/assets/styles-mobile-extra-small.css" />

      <div className="bg-canvas"></div>

      <div className="admin-page-wrapper">
        <div className="admin-page-container">

          {/* Header */}
          <div className="admin-header">
            <Link href="/admin" className="admin-back-link">← Back to Dashboard</Link>
            <h1 className="admin-page-title">Quiz Scores</h1>
            <p className="admin-page-description">View and manage quiz leaderboard</p>
          </div>

          {/* Stats */}
          <div className="admin-stats-grid-sm">
            <div className="card admin-stat-card gold">
              <div className="admin-stat-icon-sm">🧠</div>
              <div className="admin-stat-value gold">{scores.length}</div>
              <div className="admin-stat-label">Total Attempts</div>
            </div>
            <div className="card admin-stat-card teal">
              <div className="admin-stat-icon-sm">📊</div>
              <div className="admin-stat-value teal">{averageScore}</div>
              <div className="admin-stat-label">Average Score</div>
            </div>
            <div className="card admin-stat-card success">
              <div className="admin-stat-icon-sm">🎯</div>
              <div className="admin-stat-value success">{perfectScores}</div>
              <div className="admin-stat-label">Perfect Scores</div>
            </div>
          </div>

          {/* Sort Options */}
          <div className="card admin-scores-sort-bar">
            <div className="admin-scores-sort-row">
              <span className="admin-scores-sort-label">Sort by:</span>
              <button
                onClick={() => setSortBy('score')}
                className={`btn-outline admin-filter-btn${sortBy === 'score' ? ' active' : ''}`}
              >
                🏆 Highest Score
              </button>
              <button
                onClick={() => setSortBy('date')}
                className={`btn-outline admin-filter-btn${sortBy === 'date' ? ' active' : ''}`}
              >
                📅 Most Recent
              </button>
            </div>
          </div>

          {/* Scores List */}
          {loading ? (
            <div className="card admin-state-card">
              <div className="admin-state-text">Loading scores...</div>
            </div>
          ) : scores.length === 0 ? (
            <div className="card admin-state-card">
              <div className="admin-state-icon">🏆</div>
              <div className="admin-state-text">No quiz scores yet</div>
            </div>
          ) : (
            <div className="card admin-score-list-card">
              {scores.map((score, index) => (
                <div key={score.id} className="admin-score-entry">
                  {getMedalEmoji(index) && (
                    <div className="admin-score-medal">{getMedalEmoji(index)}</div>
                  )}
                  <div className={`admin-score-rank ${getRankClass(index)}`}>
                    {index + 1}
                  </div>
                  <div className="admin-score-info">
                    <div className="admin-score-name">{score.player_name}</div>
                    <div className="admin-score-date">{formatDate(score.created_at)}</div>
                  </div>
                  <div className="admin-score-value">
                    {score.score}/{score.total_questions}
                  </div>
                  <button
                    onClick={() => handleDelete(score.id)}
                    className="admin-score-delete-btn"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
