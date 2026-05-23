'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase, QuizScore } from '@/lib/supabase';

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
    return '';
  };

  const getRankClass = (index: number) => {
    if (index === 0) return 'gold';
    if (index === 1) return 'silver';
    if (index === 2) return 'bronze';
    return '';
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cinzel+Decorative:wght@700&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="/assets/styles.css" />

      <div className="bg-canvas"></div>

      <div style={{position: 'relative', zIndex: 1, maxWidth: '700px', width: '100%', margin: '0 auto', padding: '40px 20px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{width: '100%'}}>
          <Link href="/" style={{display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '20px', transition: 'all 0.3s'}}>
            ← Back to Home
          </Link>
          
          <div className="card">
            <div style={{fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-teal-light)', opacity: 0.8}}>Quiz Champions</div>
            <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 600, color: 'var(--accent-gold-light)', marginBottom: '10px'}}>Full Leaderboard</div>
            <p style={{color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '12px', lineHeight: 1.7}}>
              See all quiz participants and their scores!
            </p>
            <div className="gold-line"></div>

            <div>
              {loading ? (
                <div style={{textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic', padding: '32px 0', fontSize: '0.9rem'}}>
                  Loading leaderboard...
                </div>
              ) : scores.length === 0 ? (
                <div style={{textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic', padding: '32px 0', fontSize: '0.9rem'}}>
                  No scores yet. Be the first to take the quiz!
                </div>
              ) : (
                scores.map((entry, index) => (
                  <div
                    key={entry.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '14px 20px',
                      borderBottom: '1px solid rgba(201,162,39,0.1)',
                      transition: 'background 0.2s',
                      borderRadius: 'var(--radius-sm)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(201,162,39,0.06)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {getMedalEmoji(index) && (
                      <div style={{fontSize: '1.3rem'}}>{getMedalEmoji(index)}</div>
                    )}
                    <div
                      style={{
                        width: '32px',
                        textAlign: 'center',
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '1.3rem',
                        fontWeight: 700,
                        color: getRankClass(index) === 'gold' ? '#ffd700' : getRankClass(index) === 'silver' ? '#c0c0c0' : getRankClass(index) === 'bronze' ? '#cd7f32' : 'var(--accent-gold)'
                      }}
                    >
                      {index + 1}
                    </div>
                    <div style={{flex: 1, fontWeight: 500, fontSize: '0.92rem'}}>
                      {entry.player_name}
                    </div>
                    <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 600, color: 'var(--accent-gold-light)'}}>
                      {entry.score}/{entry.total_questions}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="gold-line"></div>
            <Link href="/quiz" className="btn-gold" style={{width: '100%', justifyContent: 'center'}}>
              Take the Quiz 🧠
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
