'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase, QuizScore } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/adminAuth';

export default function AdminScoresPage() {
  const router = useRouter();
  const [scores, setScores] = useState<QuizScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'score' | 'date'>('score');

  useEffect(() => {
    // Check authentication
    if (!isAdminAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    
    loadScores();
  }, [sortBy, router]);

  const loadScores = async () => {
    try {
      const orderColumn = sortBy === 'score' ? 'score' : 'created_at';
      const ascending = sortBy === 'date';

      const { data, error } = await supabase
        .from('quiz_scores')
        .select('*')
        .order(orderColumn, { ascending });

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
      const { error } = await supabase
        .from('quiz_scores')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadScores();
      alert('Score deleted successfully!');
    } catch (error) {
      console.error('Error deleting score:', error);
      alert('Failed to delete score');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMedalEmoji = (index: number) => {
    if (sortBy === 'score') {
      if (index === 0) return '🥇';
      if (index === 1) return '🥈';
      if (index === 2) return '🥉';
    }
    return '';
  };

  const getRankClass = (index: number) => {
    if (sortBy === 'score') {
      if (index === 0) return 'gold';
      if (index === 1) return 'silver';
      if (index === 2) return 'bronze';
    }
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

      <div className="bg-canvas"></div>

      <div style={{position: 'relative', zIndex: 1, minHeight: '100vh', padding: '40px 20px'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          {/* Header */}
          <div style={{marginBottom: '32px'}}>
            <Link href="/admin" style={{display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '20px', transition: 'all 0.3s'}}>
              ← Back to Dashboard
            </Link>
            
            <h1 style={{fontFamily: "'Cinzel Decorative', serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: 'var(--accent-gold-light)', marginBottom: '12px'}}>
              Quiz Scores
            </h1>
            <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>
              View and manage quiz leaderboard
            </p>
          </div>

          {/* Stats */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px'}}>
            <div className="card" style={{padding: '24px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(201,162,39,0.15) 0%, rgba(201,162,39,0.05) 100%)', border: '1px solid rgba(201,162,39,0.3)'}}>
              <div style={{fontSize: '2rem', marginBottom: '8px'}}>🧠</div>
              <div style={{fontFamily: "'Cinzel Decorative', serif", fontSize: '2rem', color: 'var(--accent-gold-light)', marginBottom: '4px'}}>
                {scores.length}
              </div>
              <div style={{fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)'}}>
                Total Attempts
              </div>
            </div>

            <div className="card" style={{padding: '24px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(0,180,216,0.15) 0%, rgba(0,180,216,0.05) 100%)', border: '1px solid rgba(0,180,216,0.3)'}}>
              <div style={{fontSize: '2rem', marginBottom: '8px'}}>📊</div>
              <div style={{fontFamily: "'Cinzel Decorative', serif", fontSize: '2rem', color: 'var(--accent-teal-light)', marginBottom: '4px'}}>
                {averageScore}
              </div>
              <div style={{fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)'}}>
                Average Score
              </div>
            </div>

            <div className="card" style={{padding: '24px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(61,220,132,0.15) 0%, rgba(61,220,132,0.05) 100%)', border: '1px solid rgba(61,220,132,0.3)'}}>
              <div style={{fontSize: '2rem', marginBottom: '8px'}}>🎯</div>
              <div style={{fontFamily: "'Cinzel Decorative', serif", fontSize: '2rem', color: '#3ddc84', marginBottom: '4px'}}>
                {perfectScores}
              </div>
              <div style={{fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)'}}>
                Perfect Scores
              </div>
            </div>
          </div>

          {/* Sort Options */}
          <div className="card" style={{padding: '20px', marginBottom: '24px'}}>
            <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center'}}>
              <span style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginRight: '8px'}}>Sort by:</span>
              <button
                onClick={() => setSortBy('score')}
                className="btn-outline"
                style={{
                  padding: '10px 24px',
                  background: sortBy === 'score' ? 'rgba(201,162,39,0.2)' : 'transparent',
                  borderColor: sortBy === 'score' ? 'var(--accent-gold)' : 'rgba(245,240,232,0.35)',
                  color: sortBy === 'score' ? 'var(--accent-gold-light)' : 'var(--text-primary)'
                }}
              >
                🏆 Highest Score
              </button>
              <button
                onClick={() => setSortBy('date')}
                className="btn-outline"
                style={{
                  padding: '10px 24px',
                  background: sortBy === 'date' ? 'rgba(201,162,39,0.2)' : 'transparent',
                  borderColor: sortBy === 'date' ? 'var(--accent-gold)' : 'rgba(245,240,232,0.35)',
                  color: sortBy === 'date' ? 'var(--accent-gold-light)' : 'var(--text-primary)'
                }}
              >
                📅 Most Recent
              </button>
            </div>
          </div>

          {/* Scores List */}
          {loading ? (
            <div className="card" style={{padding: '60px', textAlign: 'center'}}>
              <div style={{color: 'var(--text-muted)'}}>Loading scores...</div>
            </div>
          ) : scores.length === 0 ? (
            <div className="card" style={{padding: '60px', textAlign: 'center'}}>
              <div style={{fontSize: '3rem', marginBottom: '16px'}}>🏆</div>
              <div style={{color: 'var(--text-muted)'}}>No quiz scores yet</div>
            </div>
          ) : (
            <div className="card" style={{padding: '24px'}}>
              {scores.map((score, index) => (
                <div
                  key={score.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px',
                    borderBottom: index < scores.length - 1 ? '1px solid rgba(201,162,39,0.1)' : 'none',
                    transition: 'background 0.2s',
                    borderRadius: 'var(--radius-sm)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(201,162,39,0.06)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {getMedalEmoji(index) && (
                    <div style={{fontSize: '1.5rem', minWidth: '32px', textAlign: 'center'}}>
                      {getMedalEmoji(index)}
                    </div>
                  )}
                  
                  <div style={{
                    minWidth: '40px',
                    textAlign: 'center',
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    color: getRankClass(index) === 'gold' ? '#ffd700' : 
                           getRankClass(index) === 'silver' ? '#c0c0c0' : 
                           getRankClass(index) === 'bronze' ? '#cd7f32' : 
                           'var(--accent-gold)'
                  }}>
                    {index + 1}
                  </div>

                  <div style={{flex: 1}}>
                    <div style={{fontWeight: 600, fontSize: '1rem', marginBottom: '4px'}}>
                      {score.player_name}
                    </div>
                    <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>
                      {formatDate(score.created_at)}
                    </div>
                  </div>

                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1.4rem',
                    fontWeight: 600,
                    color: 'var(--accent-gold-light)',
                    minWidth: '60px',
                    textAlign: 'center'
                  }}>
                    {score.score}/{score.total_questions}
                  </div>

                  <button
                    onClick={() => handleDelete(score.id)}
                    style={{
                      padding: '8px 16px',
                      background: 'transparent',
                      border: '1px solid rgba(255,107,107,0.3)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#ff6b6b',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,107,107,0.1)';
                      e.currentTarget.style.borderColor = '#ff6b6b';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'rgba(255,107,107,0.3)';
                    }}
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
