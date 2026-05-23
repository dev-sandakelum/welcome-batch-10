'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase, QuizScore } from '@/lib/supabase';
import '../styles/leaderboard.css';
import PageShell from '@/app/components/PageShell';

export default function LeaderboardPage() {
  const [scores, setScores] = useState<QuizScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_scores')
        .select('*')
        .order('score', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) throw error;

      setScores(data || []);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalEmoji = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return null;
  };

  const getRankClass = (index: number) => {
    if (index === 0) return 'gold';
    if (index === 1) return 'silver';
    if (index === 2) return 'bronze';
    return '';
  };

  return (
    <>
      <link rel="stylesheet" href="/assets/styles.css" />
      <link rel="stylesheet" href="/assets/styles-tablet.css" />
      <link rel="stylesheet" href="/assets/styles-mobile.css" />
      <link rel="stylesheet" href="/assets/styles-mobile-small.css" />
      <link rel="stylesheet" href="/assets/styles-mobile-extra-small.css" />

      <PageShell>

      <div className="leaderboard-page-wrapper">
        <div className="leaderboard-page-content">
          <Link href="/" className="leaderboard-back-link">
            ← Back to Home
          </Link>

          <div className="card">
            <div className="leaderboard-card-label">Quiz Champions</div>
            <div className="leaderboard-card-title">Full Leaderboard</div>
            <p className="leaderboard-card-description">
              See all quiz participants and their scores!
            </p>
            <div className="gold-line"></div>

            <div>
              {loading ? (
                <div className="leaderboard-state">Loading leaderboard...</div>
              ) : scores.length === 0 ? (
                <div className="leaderboard-state">No scores yet. Be the first to take the quiz!</div>
              ) : (
                scores.map((entry, index) => (
                  <div key={entry.id} className="leaderboard-entry">
                    {getMedalEmoji(index) && (
                      <div className="leaderboard-medal">{getMedalEmoji(index)}</div>
                    )}
                    <div className={`leaderboard-rank ${getRankClass(index)}`}>
                      {index + 1}
                    </div>
                    <div className="leaderboard-name">{entry.player_name}</div>
                    <div className="leaderboard-score">
                      {entry.score}/{entry.total_questions}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="gold-line"></div>
            <Link href="/quiz" className="btn-gold leaderboard-cta-btn">
              Take the Quiz 🧠
            </Link>
          </div>
        </div>
      </PageShell>
    </>
  );
}
